package ru.legohuman.devstat.util

import org.springframework.stereotype.Component
import ru.legohuman.devstat.CommonConfiguration
import ru.legohuman.devstat.dao.ChartDataDao
import ru.legohuman.devstat.domain.DeveloperFactEntity
import ru.legohuman.devstat.dto.*

interface DeveloperMeasureDescriptor<out T : ChartValuesType> {
    fun getMeanValue(chartDataDao: ChartDataDao, request: DashboardCountryPeriodMeasureTypeRequest): Double?

    fun getChartValues(chartDataDao: ChartDataDao, request: DashboardCountryPeriodMeasureTypeRequest): List<T>
}

abstract class DeveloperMeasureDescriptorBase<out T : ChartValuesType>(
        open protected val propertyName: String
) : DeveloperMeasureDescriptor<T> {

    override fun getMeanValue(chartDataDao: ChartDataDao, request: DashboardCountryPeriodMeasureTypeRequest): Double? {
        val propertyExpression = getEntityPropertyExpression("d")
        return chartDataDao.getMeanValue(propertyExpression, request.countryCode!!, request.startDate ?: Validators.minDate, request.endDate ?: Validators.maxDate)
    }

    protected fun getEntityPropertyExpression(entityAlias: String): String {
        return "$entityAlias.$propertyName"
    }
}

abstract class ChartBinDeveloperMeasureDescriptorBase(
        final override val propertyName: String,
        private val groupWidth: Int
) : DeveloperMeasureDescriptorBase<ChartBin>(propertyName) {

    override fun getChartValues(chartDataDao: ChartDataDao, request: DashboardCountryPeriodMeasureTypeRequest): List<ChartBin> {
        val discriminatorExpression = getDiscriminatorExpression("d")
        return chartDataDao.getChartGroupedValues(discriminatorExpression, request.countryCode!!, request.startDate ?: Validators.minDate, request.endDate ?: Validators.maxDate)
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
        final override val propertyName: String,
        private val pointsCount: Int
) : DeveloperMeasureDescriptorBase<ChartPoint>(propertyName) {
    private val extentShiftFactor = 0.5

    override fun getChartValues(chartDataDao: ChartDataDao, request: DashboardCountryPeriodMeasureTypeRequest): List<ChartPoint> {
        val propertyExpression = getEntityPropertyExpression("d")

        @Suppress("UNCHECKED_CAST")
        val values = chartDataDao.getChartSortedValues(propertyExpression, request.countryCode!!, request.startDate ?: Validators.minDate, request.endDate ?: Validators.maxDate)
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
        conf: CommonConfiguration
) : ChartBinDeveloperMeasureDescriptorBase(DeveloperFactEntity::age.name, conf.measureBinsGroupWidthAge)

class SalaryDeveloperMeasureDescriptor(
        conf: CommonConfiguration
) : ChartPointDeveloperMeasureDescriptorBase(DeveloperFactEntity::salary.name, conf.measureDensityPointsCountSalary)

class ExperienceDeveloperMeasureDescriptor(
        conf: CommonConfiguration
) : ChartBinDeveloperMeasureDescriptorBase(DeveloperFactEntity::experience.name, conf.measureBinsGroupWidthExperience)

class CompanySizeDeveloperMeasureDescriptor(
        conf: CommonConfiguration
) : ChartBinDeveloperMeasureDescriptorBase(DeveloperFactEntity::companySize.name, conf.measureBinsGroupWidthCompanySize)

@Component
class DeveloperMeasureDescriptorRegistry(
        conf: CommonConfiguration
) {
    private val measureTypeToDescriptor: Map<DeveloperMeasureType, DeveloperMeasureDescriptor<ChartValuesType>> = mapOf(
            Pair(DeveloperMeasureType.age, AgeDeveloperMeasureDescriptor(conf)),
            Pair(DeveloperMeasureType.salary, SalaryDeveloperMeasureDescriptor(conf)),
            Pair(DeveloperMeasureType.experience, ExperienceDeveloperMeasureDescriptor(conf)),
            Pair(DeveloperMeasureType.companySize, CompanySizeDeveloperMeasureDescriptor(conf))
    )

    @Suppress("UNCHECKED_CAST")
    fun <T : ChartValuesType> getDescriptor(measureType: DeveloperMeasureType): DeveloperMeasureDescriptor<T>? {
        return measureTypeToDescriptor[measureType] as DeveloperMeasureDescriptor<T>?
    }
}