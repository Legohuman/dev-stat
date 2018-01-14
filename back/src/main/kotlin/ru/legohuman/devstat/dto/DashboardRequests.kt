package ru.legohuman.devstat.dto

import ru.legohuman.devstat.util.Validators
import ru.legohuman.devstat.util.addIfNotNull
import java.time.LocalDate

data class DashboardPeriodRequest(
        val startDate: LocalDate?,
        val endDate: LocalDate?
) : BaseRequest {

    override fun validate(): List<String> {
        val errors = mutableListOf<String>()
        errors.addIfNotNull(Validators.saneDate(startDate, "start date"))
        errors.addIfNotNull(Validators.saneDate(endDate, "end date"))
        errors.addIfNotNull(Validators.datesInOrder(startDate, endDate, "date range"))
        return errors
    }
}

data class DashboardCountryPeriodRequest(
        val countryCode: String?,
        val startDate: LocalDate?,
        val endDate: LocalDate?
) : BaseRequest {

    override fun validate(): List<String> {
        val errors = mutableListOf<String>()
        errors.addAll(DashboardPeriodRequest(startDate, endDate).validate())
        errors.addIfNotNull(Validators.countryCode(countryCode))
        return errors
    }
}

data class DashboardCountryPeriodMeasureTypeRequest(
        val countryCode: String?,
        val startDate: LocalDate?,
        val endDate: LocalDate?,
        val measureType: DeveloperMeasureType?
) : BaseRequest {

    override fun validate(): List<String> {
        val errors = mutableListOf<String>()
        errors.addAll(DashboardCountryPeriodRequest(countryCode, startDate, endDate).validate())
        errors.addIfNotNull(Validators.oneOf(measureType, DeveloperMeasureType.values(), "measure type"))
        return errors
    }
}