package ru.legohuman.devstat.domain

import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.Table

@Entity
@Table(name = "country")
data class CountryEntity(
        @Id
        @Column(name = "code", updatable = false, nullable = false)
        val code: String
) : BaseEntity