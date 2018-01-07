package ru.legohuman.devstat.util

import ru.legohuman.devstat.domain.CountryEntity
import ru.legohuman.devstat.domain.CountryFactEntity
import ru.legohuman.devstat.dto.CountryGenerationRequest
import ru.legohuman.devstat.dto.CountryMeasureType
import ru.legohuman.devstat.dto.ValuesGenerationRequest
import java.time.LocalDate
import java.time.temporal.ChronoUnit

/**
 * Iterator to generate country entities for specified date range.
 * Implementation is not thread-safe. New instance should be created for every generation session.
 */
class CountryGenerationIterator(private val generationRequest: CountryGenerationRequest,
                                private val country: CountryEntity) : GenerationIteratorBase<CountryFactEntity>() {
    var currentDate: LocalDate = generationRequest.identity.startDate

    override fun hasNext(): Boolean {
        return currentDate.isBefore(generationRequest.identity.endDate)
    }

    override fun next(): CountryFactEntity {
        val countryFact = CountryFactEntity().apply {
            country = this@CountryGenerationIterator.country
            actualDate = currentDate
            devCount = getValueForDate(getValuesGenerateRequest(CountryMeasureType.devCount), generationRequest.identity, currentDate)
            vacancyCount = getValueForDate(getValuesGenerateRequest(CountryMeasureType.vacancyCount), generationRequest.identity, currentDate)
            economyLevel = getValueForDate(getValuesGenerateRequest(CountryMeasureType.economyLevel), generationRequest.identity, currentDate)
        }
        currentDate = currentDate.plus(1, ChronoUnit.DAYS)

        return countryFact
    }

    private fun getValuesGenerateRequest(measureType: CountryMeasureType): ValuesGenerationRequest<Int, Int> =
            generationRequest.measureToValuesGenerationRequest[measureType] ?: getConstantValueGenerateRequest(0)
}