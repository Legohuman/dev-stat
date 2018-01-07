package ru.legohuman.devstat.dto

import ru.legohuman.devstat.util.ConversionUtil
import ru.legohuman.devstat.util.EnumUtil
import java.time.LocalDate

data class DashboardPeriodRequest(
        val startDate: LocalDate?,
        val endDate: LocalDate?,
        val errorMessages: List<String>
)

data class DashboardCountryPeriodRequest(
        val countryCode: String,
        val startDate: LocalDate?,
        val endDate: LocalDate?,
        val errorMessages: List<String>
)

data class DashboardCountryPeriodMeasureTypeRequest(
        val countryCode: String,
        val startDate: LocalDate?,
        val endDate: LocalDate?,
        val measureType: DeveloperMeasureType?,
        val errorMessages: List<String>
)

object DashboardRequestFactory {
    fun periodRequest(startDate: String?, endDate: String?): DashboardPeriodRequest {
        val startInstant = ConversionUtil.parseDateTime(startDate)
        val endInstant = ConversionUtil.parseDateTime(endDate)
        val errorMessages: MutableList<String> = mutableListOf()
        if (startInstant == null && startDate != null) {
            errorMessages.add("Invalid start date value $startDate. Expected date should have format ${ConversionUtil.datePattern}")
        }
        if (endInstant == null && endDate != null) {
            errorMessages.add("Invalid end date value $endDate. Expected date should have format ${ConversionUtil.datePattern}")
        }
        if (endInstant != null && startInstant != null && endInstant.isBefore(startInstant)) {
            errorMessages.add("Invalid start date value $startDate and end date value $endDate. End date should not be before start date.")
        }

        return DashboardPeriodRequest(startInstant, endInstant, errorMessages)
    }

    fun countryPeriodRequest(countryCode: String, startDate: String?, endDate: String?): DashboardCountryPeriodRequest {
        val periodRequest = periodRequest(startDate, endDate)
        val errorMessages = periodRequest.errorMessages.toMutableList()

        if (countryCode.isEmpty()) {
            errorMessages.add("Invalid empty country code. Expected country code contains 3 letters.")
        }

        return DashboardCountryPeriodRequest(countryCode, periodRequest.startDate, periodRequest.endDate, errorMessages)
    }

    fun countryPeriodMeasureTypeRequest(countryCode: String, measureType: String, startDate: String?, endDate: String?): DashboardCountryPeriodMeasureTypeRequest {
        val countryPeriodRequest = countryPeriodRequest(countryCode, startDate, endDate)
        val errorMessages = countryPeriodRequest.errorMessages.toMutableList()

        val measureTypeOption = EnumUtil.nullableValueOf<DeveloperMeasureType>(measureType, DeveloperMeasureType.values())
        if (measureTypeOption == null) {
            errorMessages.add("Invalid measure type $measureType. Expected one of types: ${DeveloperMeasureType.values().joinToString()}.")
        }

        return DashboardCountryPeriodMeasureTypeRequest(countryPeriodRequest.countryCode, countryPeriodRequest.startDate, countryPeriodRequest.endDate, measureTypeOption, errorMessages)
    }
}