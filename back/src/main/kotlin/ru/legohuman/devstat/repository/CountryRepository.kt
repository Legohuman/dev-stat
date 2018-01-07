package ru.legohuman.devstat.repository

import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository
import ru.legohuman.devstat.domain.CountryEntity

@Repository
interface CountryRepository : CrudRepository<CountryEntity, String>