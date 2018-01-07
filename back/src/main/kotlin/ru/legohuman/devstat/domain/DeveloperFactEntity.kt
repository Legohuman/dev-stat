package ru.legohuman.devstat.domain

import org.hibernate.annotations.GenericGenerator
import java.time.LocalDate
import java.util.*
import javax.persistence.*

@Entity
@Table(name = "developer_fact")
class DeveloperFactEntity : FactEntity {
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

    @Column(name = "age", nullable = false)
    var age: Int? = null
    @Column(name = "salary", nullable = false)
    var salary: Int? = null
    @Column(name = "experience", nullable = false)
    var experience: Int? = null
    @Column(name = "company_size", nullable = false)
    var companySize: Int? = null
}