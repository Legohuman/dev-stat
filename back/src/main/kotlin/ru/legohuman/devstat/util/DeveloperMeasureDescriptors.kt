package ru.legohuman.devstat.util

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.core.env.Environment
import org.springframework.stereotype.Component
import ru.legohuman.devstat.dao.ChartDataDao
import ru.legohuman.devstat.domain.DeveloperFactEntity
import ru.legohuman.devstat.dto.*
import java.time.LocalDate

interface DeveloperMeasureDescriptor<out T : ChartValuesType> {
    fun getMeanValue(chartDataDao: ChartDataDao, request: DashboardCountryPeriodMeasureTypeRequest): Double?

    fun getChartValues(chartDataDao: ChartDataDao, request: DashboardCountryPeriodMeasureTypeRequest): List<T>
}

abstract class DeveloperMeasureDescriptorBase<out T : ChartValuesType>(
        open protected val propertyName: String
) : DeveloperMeasureDescriptor<T> {

    override fun getMeanValue(chartDataDao: ChartDataDao, request: DashboardCountryPeriodMeasureTypeRequest): Double? {
        val propertyExpression = getEntityPropertyExpression("d")
        return chartDataDao.getMeanValue(propertyExpression, request.countryCode!!, request.startDate ?: LocalDate.MIN, request.endDate ?: LocalDate.MAX)
    }

    protected fun getEntityPropertyExpression(entityAlias: String): String {
        return "$entityAlias.$propertyName"
    }
}

abstract class ChartBinDeveloperMeasureDescriptorBase(
        env: Environment,
        final override val propertyName: String,
        defaultGroupWidth: Int
) : DeveloperMeasureDescriptorBase<ChartBin>(propertyName) {
    private val groupWidth: Int = ConversionUtil.parseInt(env.getProperty("app.measure.bins.group.width.$propertyName"), defaultGroupWidth)

    override fun getChartValues(chartDataDao: ChartDataDao, request: DashboardCountryPeriodMeasureTypeRequest): List<ChartBin> {
        val discriminatorExpression = getDiscriminatorExpression("d")
        return chartDataDao.getChartGroupedValues(discriminatorExpression, request.countryCode!!, request.startDate ?: LocalDate.MIN, request.endDate ?: LocalDate.MAX)
                .map { row -> mapResultRow(row) }
    }

    private fun getDiscriminatorExpression(entityAlias: String): String {
        return "$entityAlias.$propertyName/$groupWidth"
    }

    private fun mapResultRow(cells: Array<out Any>): ChartBin {
        val ageGroupBase = cells[0] as Int
        val x0 = ageGroupBase * groupWidth
        val x1 = (ageGroupBase + 1) * groupWidth
        val height = cells[1] as Long
        return ChartBin(x0, x1, height)

    }
}

abstract class ChartPointDeveloperMeasureDescriptorBase(
        env: Environment,
        final override val propertyName: String,
        defaultPointsCount: Int
) : DeveloperMeasureDescriptorBase<ChartPoint>(propertyName) {
    private val pointsCount: Int = ConversionUtil.parseInt(env.getProperty("app.measure.density.points.count.$propertyName"), defaultPointsCount)
    private val extentShiftFactor = 0.5

    override fun getChartValues(chartDataDao: ChartDataDao, request: DashboardCountryPeriodMeasureTypeRequest): List<ChartPoint> {
        val propertyExpression = getEntityPropertyExpression("d")

        @Suppress("UNCHECKED_CAST")
        val values = chartDataDao.getChartSortedValues(propertyExpression, request.countryCode!!, request.startDate ?: LocalDate.MIN, request.endDate ?: LocalDate.MAX)
                .map { row -> row.toDouble() }
        return when {
            values.isEmpty() -> listOf()
            else -> {
                val minVal = values[0]
                val maxVal = values[values.size - 1]
                val spread = maxVal - minVal
                val extentShift = spread * extentShiftFactor
                KernelDensityEstimator.calculateDensityPoints(values, DensityEstimationParameters(minVal - extentShift, maxVal + extentShift, pointsCount, 7.0))
            }
        }
    }
}

class AgeDeveloperMeasureDescriptor(
        env: Environment
) : ChartBinDeveloperMeasureDescriptorBase(env, DeveloperFactEntity::age.name, 5)

class SalaryDeveloperMeasureDescriptor(
        env: Environment
) : ChartPointDeveloperMeasureDescriptorBase(env, DeveloperFactEntity::salary.name, 10)

class ExperienceDeveloperMeasureDescriptor(
        env: Environment
) : ChartBinDeveloperMeasureDescriptorBase(env, DeveloperFactEntity::experience.name, 2)

class CompanySizeDeveloperMeasureDescriptor(
        env: Environment
) : ChartBinDeveloperMeasureDescriptorBase(env, DeveloperFactEntity::companySize.name, 50)

@Component
open class DeveloperMeasureDescriptorRegistry @Autowired constructor(
        env: Environment
) {
    private val measureTypeToDescriptor: Map<DeveloperMeasureType, DeveloperMeasureDescriptor<ChartValuesType>> = mapOf(
            Pair(DeveloperMeasureType.age, AgeDeveloperMeasureDescriptor(env)),
            Pair(DeveloperMeasureType.salary, SalaryDeveloperMeasureDescriptor(env)),
            Pair(DeveloperMeasureType.experience, ExperienceDeveloperMeasureDescriptor(env)),
            Pair(DeveloperMeasureType.companySize, CompanySizeDeveloperMeasureDescriptor(env))
    )

    @Suppress("UNCHECKED_CAST")
    fun <T : ChartValuesType> getDescriptor(measureType: DeveloperMeasureType): DeveloperMeasureDescriptor<T>? {
        return measureTypeToDescriptor[measureType] as DeveloperMeasureDescriptor<T>?
    }
}