package ru.legohuman.devstat.dao

import org.springframework.stereotype.Service
import java.time.LocalDate
import javax.persistence.EntityManager
import javax.transaction.Transactional

interface ChartDataDao : BaseDao {
    fun getMeanValue(propertyExpression: String, countryCode: String, startDate: LocalDate, endDate: LocalDate): Double?

    fun getChartSortedValues(propertyExpression: String, countryCode: String, startDate: LocalDate, endDate: LocalDate): List<Number>

    fun getChartGroupedValues(discriminatorExpression: String, countryCode: String, startDate: LocalDate, endDate: LocalDate): List<Array<out Any>>
}

@Suppress("UNCHECKED_CAST")
@Service
@Transactional
class ChartDataDaoImpl(
        em: EntityManager
) : BaseDaoImpl(em), ChartDataDao {

    override fun getMeanValue(propertyExpression: String, countryCode: String, startDate: LocalDate, endDate: LocalDate): Double? {
        val query = em.createQuery("select avg($propertyExpression) from DeveloperFactEntity d where d.country.code = :code and d.actualDate >= :startDate and d.actualDate <= :endDate")
        query.setParameter("code", countryCode)
        query.setParameter("startDate", startDate)
        query.setParameter("endDate", endDate)
        return query.singleResult as Double?
    }

    override fun getChartSortedValues(propertyExpression: String, countryCode: String, startDate: LocalDate, endDate: LocalDate): List<Number> {
        val query = em.createQuery("select $propertyExpression from DeveloperFactEntity d where d.country.code = :code and d.actualDate >= :startDate and d.actualDate <= :endDate order by $propertyExpression")
        query.setParameter("code", countryCode)
        query.setParameter("startDate", startDate)
        query.setParameter("endDate", endDate)

        return query.resultList as List<Number>
    }

    override fun getChartGroupedValues(discriminatorExpression: String, countryCode: String, startDate: LocalDate, endDate: LocalDate): List<Array<out Any>> {
        val query = em.createQuery("select $discriminatorExpression, count(d.uuid) from DeveloperFactEntity d where d.country.code = :code and d.actualDate >= :startDate and d.actualDate <= :endDate group by $discriminatorExpression order by $discriminatorExpression")
        query.setParameter("code", countryCode)
        query.setParameter("startDate", startDate)
        query.setParameter("endDate", endDate)

        return query.resultList as List<Array<Any>>
    }
}