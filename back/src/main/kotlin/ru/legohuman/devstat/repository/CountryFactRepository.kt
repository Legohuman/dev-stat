package ru.legohuman.devstat.repository

import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import ru.legohuman.devstat.domain.CountryFactEntity
import java.time.LocalDate

@Repository
interface CountryFactRepository : CrudRepository<CountryFactEntity, String> {
    @Modifying
    @Query("delete from CountryFactEntity c where c.country.code = :code and c.actualDate >= :startDate and c.actualDate <= :endDate")
    fun deleteByCodeAndDates(@Param("code") code: String, @Param("startDate") startDate: LocalDate, @Param("endDate") endDate: LocalDate)

    @Query("select c.country.code, avg(c.devCount), avg(c.vacancyCount), avg(c.economyLevel) from CountryFactEntity c where c.actualDate >= :startDate and c.actualDate <= :endDate group by c.country.code")
    fun getSummary(@Param("startDate") startDate: LocalDate, @Param("endDate") endDate: LocalDate): List<Array<Any>>
}