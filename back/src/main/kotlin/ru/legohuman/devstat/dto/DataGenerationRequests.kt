package ru.legohuman.devstat.dto

import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonProperty
import ru.legohuman.devstat.util.Validators
import ru.legohuman.devstat.util.addIfNotNull
import java.time.LocalDate

interface DataGenerationRequest<T> : BaseRequest {
    val identity: DataRequestIdentity
    val measureToValuesGenerationRequest: Map<T, ValuesGenerationRequest<Int, Int>>
}

abstract class BaseDataGenerationRequest<T> : DataGenerationRequest<T> {

    protected fun validateValuesGenerationRequest(measureType: T, minValue: Int, maxValue: Int): List<String> {
        val valuesRequest = measureToValuesGenerationRequest[measureType]
        val errors = mutableListOf<String>()

        if (valuesRequest == null) {
            errors.add("Invalid request. Object should contain key for $measureType values generation parameters.")
        } else {
            errors.addIfNotNull(Validators.valueWithDeviationInRange(valuesRequest.startValue, valuesRequest.deviation, minValue, maxValue, "start value in $measureType values generation parameters"))
            errors.addIfNotNull(Validators.valueWithDeviationInRange(valuesRequest.endValue, valuesRequest.deviation, minValue, maxValue, "end value in $measureType values generation parameters"))
            errors.addIfNotNull(Validators.notNegative(valuesRequest.deviation, "deviation in $measureType values generation parameters"))
        }
        return errors
    }
}

data class CountryGenerationRequest @JsonCreator constructor(
        @JsonProperty("identity") override val identity: DataRequestIdentity,
        @JsonProperty("measureToValuesGenerationRequest") override val measureToValuesGenerationRequest: Map<CountryMeasureType, ValuesGenerationRequest<Int, Int>>
) : BaseDataGenerationRequest<CountryMeasureType>() {

    override fun validate(): List<String> {
        val errors = mutableListOf<String>()
        errors.addAll(identity.validate())
        errors.addAll(validateValuesGenerationRequest(CountryMeasureType.devCount, 0, 1e9.toInt()))
        errors.addAll(validateValuesGenerationRequest(CountryMeasureType.vacancyCount, 0, 1e9.toInt()))
        errors.addAll(validateValuesGenerationRequest(CountryMeasureType.economyLevel, 1, 7))

        return errors
    }
}

data class DeveloperGenerationRequest @JsonCreator constructor(
        @JsonProperty("identity") override val identity: DataRequestIdentity,
        @JsonProperty("measureToValuesGenerationRequest") override val measureToValuesGenerationRequest: Map<DeveloperMeasureType, ValuesGenerationRequest<Int, Int>>,
        @JsonProperty("itemsCount") val itemsCount: Int
) : BaseDataGenerationRequest<DeveloperMeasureType>() {

    override fun validate(): List<String> {
        val errors = mutableListOf<String>()
        errors.addAll(identity.validate())
        errors.addIfNotNull(Validators.notNegative(itemsCount, "items count"))
        errors.addAll(validateValuesGenerationRequest(DeveloperMeasureType.age, 15, 80))
        errors.addAll(validateValuesGenerationRequest(DeveloperMeasureType.salary, 0, 50000))
        errors.addAll(validateValuesGenerationRequest(DeveloperMeasureType.experience, 0, 65))
        errors.addAll(validateValuesGenerationRequest(DeveloperMeasureType.companySize, 1, 1000000))

        return errors
    }
}

data class DataRequestIdentity @JsonCreator constructor(
        @JsonProperty("countryCode") val countryCode: String,
        @JsonProperty("startDate") val startDate: LocalDate,
        @JsonProperty("endDate") val endDate: LocalDate
) : BaseRequest {

    override fun validate(): List<String> {
        val errors = mutableListOf<String>()

        errors.addIfNotNull(Validators.saneDate(startDate, "start date"))
        errors.addIfNotNull(Validators.saneDate(endDate, "end date"))
        errors.addIfNotNull(Validators.datesInOrder(startDate, endDate, "date range"))
        errors.addIfNotNull(Validators.countryCode(countryCode))

        return errors
    }
}

data class ValuesGenerationRequest<out T, out D> @JsonCreator constructor(
        @JsonProperty("startValue") val startValue: T,
        @JsonProperty("endValue") val endValue: T,
        @JsonProperty("deviation") val deviation: D
)