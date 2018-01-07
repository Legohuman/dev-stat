package ru.legohuman.devstat.repository

import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import ru.legohuman.devstat.domain.DeveloperFactEntity
import java.time.LocalDate
import java.util.*

@Repository
interface DeveloperFactRepository : CrudRepository<DeveloperFactEntity, UUID> {
    @Modifying
    @Query("delete from DeveloperFactEntity d where d.country.code = :countryCode and d.actualDate >= :startDate and d.actualDate < :endDate")
    fun deleteByCodeAndDates(@Param("countryCode") countryCode: String, @Param("startDate") startDate: LocalDate, @Param("endDate") endDate: LocalDate)

    @Query("select avg(d.age), avg(d.salary), avg(d.experience), avg(d.companySize) from DeveloperFactEntity d where d.country.code = :countryCode and d.actualDate >= :startDate and d.actualDate < :endDate")
    fun getSummary(@Param("countryCode") countryCode: String, @Param("startDate") startDate: LocalDate, @Param("endDate") endDate: LocalDate): List<Array<Any>>
}