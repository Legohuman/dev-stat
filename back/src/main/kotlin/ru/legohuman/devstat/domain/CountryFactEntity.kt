package ru.legohuman.devstat.domain

import org.hibernate.annotations.GenericGenerator
import java.time.LocalDate
import java.util.*
import javax.persistence.*

@Entity
@Table(name = "country_fact")
class CountryFactEntity : FactEntity {
    @Suppress("unused")
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "uuid", updatable = false, nullable = false)
    var uuid: UUID? = null

    @ManyToOne
    @JoinColumn(name = "country_code", updatable = false, nullable = false)
    var country: CountryEntity? = null

    @Column(name = "actual_date", updatable = false, nullable = false)
    var actualDate: LocalDate? = null

    @Column(name = "dev_count", nullable = false)
    var devCount: Int? = null
    @Column(name = "vacancy_count", nullable = false)
    var vacancyCount: Int? = null
    @Column(name = "economy_level", nullable = false)
    var economyLevel: Int? = null
}