package ru.legohuman.devstat.dto

import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonProperty
import java.time.LocalDate

interface DataGenerationRequest {
    val identity: DataRequestIdentity
}

data class CountryGenerationRequest @JsonCreator constructor(
        @JsonProperty("identity") override val identity: DataRequestIdentity,
        @JsonProperty("measureToValuesGenerationRequest") val measureToValuesGenerationRequest: Map<CountryMeasureType, ValuesGenerationRequest<Int, Int>>
) : DataGenerationRequest

data class DeveloperGenerationRequest @JsonCreator constructor(
        @JsonProperty("identity") override val identity: DataRequestIdentity,
        @JsonProperty("measureToValuesGenerationRequest") val measureToValuesGenerationRequest: Map<DeveloperMeasureType, ValuesGenerationRequest<Int, Int>>,
        @JsonProperty("itemsCount") val itemsCount: Int
) : DataGenerationRequest

data class DataRequestIdentity @JsonCreator constructor(
        @JsonProperty("countryCode") val countryCode: String,
        @JsonProperty("startDate") val startDate: LocalDate,
        @JsonProperty("endDate") val endDate: LocalDate
)

data class ValuesGenerationRequest<out T, out D> @JsonCreator constructor(
        @JsonProperty("startValue") val startValue: T,
        @JsonProperty("endValue") val endValue: T,
        @JsonProperty("deviation") val deviation: D
)