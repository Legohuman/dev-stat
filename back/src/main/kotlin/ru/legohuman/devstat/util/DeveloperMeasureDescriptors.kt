package ru.legohuman.devstat.util

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.core.env.Environment
import org.springframework.stereotype.Component
import ru.legohuman.devstat.domain.DeveloperFactEntity
import ru.legohuman.devstat.dto.*
import javax.persistence.EntityManager

interface DeveloperMeasureDescriptor<out T : ChartValuesType> {
    fun getMeanValue(em: EntityManager, request: DashboardCountryPeriodMeasureTypeRequest): Double

    fun getChartValues(em: EntityManager, request: DashboardCountryPeriodMeasureTypeRequest): List<T>
}

abstract class DeveloperMeasureDescriptorBase<out T : ChartValuesType>(
        open protected val propertyName: String
) : DeveloperMeasureDescriptor<T> {

    override fun getMeanValue(em: EntityManager, request: DashboardCountryPeriodMeasureTypeRequest): Double {
        val propertyExpression = getEntityPropertyExpression("d")
        val query = em.createQuery("select avg($propertyExpression) from DeveloperFactEntity d where d.country.code = :code and d.actualDate >= :startDate and d.actualDate < :endDate")
        query.setParameter("code", request.countryCode)
        query.setParameter("startDate", request.startDate)
        query.setParameter("endDate", request.endDate)
        return query.singleResult as Double
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
    private val groupWidth: Int = ConversionUtil.parseInt(env.getProperty("app.measure.group.width.$propertyName"), defaultGroupWidth)

    override fun getChartValues(em: EntityManager, request: DashboardCountryPeriodMeasureTypeRequest): List<ChartBin> {
        val discriminatorExpression = getDiscriminatorExpression("d")
        val query = em.createQuery("select $discriminatorExpression, count(d.uuid) from DeveloperFactEntity d where d.country.code = :code and d.actualDate >= :startDate and d.actualDate < :endDate group by $discriminatorExpression order by $discriminatorExpression")
        query.setParameter("code", request.countryCode)
        query.setParameter("startDate", request.startDate)
        query.setParameter("endDate", request.endDate)

        @Suppress("UNCHECKED_CAST")
        return query.resultList.map { row -> mapResultRow(row as Array<Any>) }
    }

    private fun getDiscriminatorExpression(entityAlias: String): String {
        return "$entityAlias.$propertyName/$groupWidth"
    }

    private fun mapResultRow(cells: Array<Any>): ChartBin {
        val ageGroupBase = cells[0] as Int
        val x0 = ageGroupBase * groupWidth
        val x1 = (ageGroupBase + 1) * groupWidth
        val height = cells[1] as Long
        return ChartBin(x0, x1, height)

    }
}

abstract class ChartPointDeveloperMeasureDescriptorBase(
        final override val propertyName: String
) : DeveloperMeasureDescriptorBase<ChartPoint>(propertyName) {

    override fun getChartValues(em: EntityManager, request: DashboardCountryPeriodMeasureTypeRequest): List<ChartPoint> {
        val propertyExpression = getEntityPropertyExpression("d")
        val query = em.createQuery("select $propertyExpression from DeveloperFactEntity d where d.country.code = :code and d.actualDate >= :startDate and d.actualDate < :endDate")
        query.setParameter("code", request.countryCode)
        query.setParameter("startDate", request.startDate)
        query.setParameter("endDate", request.endDate)

        @Suppress("UNCHECKED_CAST")
        val values = query.resultList.map { row -> (row as Number).toDouble() }
        return when {
            values.isEmpty() -> listOf()
            values.size == 1 -> listOf(ChartPoint(values[0], 1.0))
            else -> {
                val minVal = values[0]
                val maxVal = values[values.size - 1]
                KernelDensityEstimator.calculateDensityPoints(values, DensityEstimationParameters(minVal, maxVal, 10, 7.0))
            }
        }
    }
}

class AgeDeveloperMeasureDescriptor(
        env: Environment
) : ChartBinDeveloperMeasureDescriptorBase(env, DeveloperFactEntity::age.name, 5)

class SalaryDeveloperMeasureDescriptor :
        ChartPointDeveloperMeasureDescriptorBase(DeveloperFactEntity::salary.name)

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
            Pair(DeveloperMeasureType.salary, SalaryDeveloperMeasureDescriptor()),
            Pair(DeveloperMeasureType.experience, ExperienceDeveloperMeasureDescriptor(env)),
            Pair(DeveloperMeasureType.companySize, CompanySizeDeveloperMeasureDescriptor(env))
    )

    @Suppress("UNCHECKED_CAST")
    fun <T : ChartValuesType> getDescriptor(measureType: DeveloperMeasureType): DeveloperMeasureDescriptor<T>? {
        return measureTypeToDescriptor[measureType] as DeveloperMeasureDescriptor<T>?
    }
}