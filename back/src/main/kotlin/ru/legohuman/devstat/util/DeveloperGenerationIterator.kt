package ru.legohuman.devstat.util

import ru.legohuman.devstat.domain.CountryEntity
import ru.legohuman.devstat.domain.DeveloperFactEntity
import ru.legohuman.devstat.dto.DeveloperGenerationRequest
import ru.legohuman.devstat.dto.DeveloperMeasureType
import ru.legohuman.devstat.dto.ValuesGenerationRequest
import java.time.LocalDate

/**
 * Iterator to generate specified number of developer entities.
 * Implementation is not thread-safe. New instance should be created for every generation session.
 */
class DeveloperGenerationIterator(private val generationRequest: DeveloperGenerationRequest,
                                  private val country: CountryEntity) : GenerationIteratorBase<DeveloperFactEntity>() {
    private var generatedCount: Int = 0

    override fun hasNext(): Boolean {
        return generatedCount < generationRequest.itemsCount
    }

    override fun next(): DeveloperFactEntity {
        val date = getRandomDate()
        val developer = DeveloperFactEntity(null,
                this@DeveloperGenerationIterator.country, date,
                getValueForDate(getValuesGenerateRequest(DeveloperMeasureType.age), generationRequest.identity, date),
                getValueForDate(getValuesGenerateRequest(DeveloperMeasureType.salary), generationRequest.identity, date),
                getValueForDate(getValuesGenerateRequest(DeveloperMeasureType.experience), generationRequest.identity, date),
                getValueForDate(getValuesGenerateRequest(DeveloperMeasureType.companySize), generationRequest.identity, date))
        generatedCount++

        return developer
    }

    private fun getRandomDate(): LocalDate {
        val startDay = generationRequest.identity.startDate.toEpochDay()
        val endDay = generationRequest.identity.endDate.toEpochDay()
        return LocalDate.ofEpochDay((startDay + Math.random() * (endDay - startDay + 1)).toLong())
    }

    private fun getValuesGenerateRequest(measureType: DeveloperMeasureType): ValuesGenerationRequest<Int, Int> =
            generationRequest.measureToValuesGenerationRequest[measureType] ?: getConstantValueGenerateRequest(0)
}