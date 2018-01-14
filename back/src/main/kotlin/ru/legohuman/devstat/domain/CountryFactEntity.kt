package ru.legohuman.devstat.domain

import org.hibernate.annotations.GenericGenerator
import java.time.LocalDate
import java.util.*
import javax.persistence.*

@Entity
@Table(name = "country_fact")
data class CountryFactEntity(
        @Suppress("unused")
        @Id
        @GeneratedValue(generator = "UUID")
        @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
        @Column(name = "uuid", updatable = false, nullable = false)
        val uuid: UUID? = null,

        @ManyToOne
        @JoinColumn(name = "country_code", updatable = false, nullable = false)
        val country: CountryEntity,

        @Column(name = "actual_date", updatable = false, nullable = false)
        val actualDate: LocalDate,

        @Column(name = "dev_count", nullable = false)
        val devCount: Int,
        @Column(name = "vacancy_count", nullable = false)
        val vacancyCount: Int,
        @Column(name = "economy_level", nullable = false)
        val economyLevel: Int
) : FactEntity