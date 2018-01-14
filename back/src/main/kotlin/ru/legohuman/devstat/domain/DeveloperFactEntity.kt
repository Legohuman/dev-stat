package ru.legohuman.devstat.domain

import org.hibernate.annotations.GenericGenerator
import java.time.LocalDate
import java.util.*
import javax.persistence.*

@Entity
@Table(name = "developer_fact")
data class DeveloperFactEntity(
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

        @Column(name = "age", nullable = false)
        val age: Int,
        @Column(name = "salary", nullable = false)
        val salary: Int,
        @Column(name = "experience", nullable = false)
        val experience: Int,
        @Column(name = "company_size", nullable = false)
        val companySize: Int
) : FactEntity