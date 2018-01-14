package ru.legohuman.devstat.domain

import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.Table

@Entity
@Table(name = "country")
class CountryEntity : BaseEntity {
    @Id
    @Column(name = "code", updatable = false, nullable = false)
    var code: String? = null
}