package ru.legohuman.devstat.dto

import ru.legohuman.devstat.util.RequestParametersObject
import ru.legohuman.devstat.util.Validators
import ru.legohuman.devstat.util.addIfNotNull
import java.time.LocalDate

@RequestParametersObject
data class DashboardPeriodRequest(
        var startDate: LocalDate?,
        var endDate: LocalDate?
) : BaseRequest {

    override fun validate(): List<String> {
        val errors = mutableListOf<String>()
        errors.addIfNotNull(Validators.saneDate(startDate, "start date"))
        errors.addIfNotNull(Validators.saneDate(endDate, "end date"))
        errors.addIfNotNull(Validators.datesInOrder(startDate, endDate, "date range"))
        return errors
    }
}

@RequestParametersObject
data class DashboardCountryPeriodRequest(
        var countryCode: String?,
        var startDate: LocalDate?,
        var endDate: LocalDate?
) : BaseRequest {

    override fun validate(): List<String> {
        val errors = mutableListOf<String>()
        errors.addAll(DashboardPeriodRequest(startDate, endDate).validate())
        errors.addIfNotNull(Validators.countryCode(countryCode))
        return errors
    }
}

@RequestParametersObject
data class DashboardCountryPeriodMeasureTypeRequest(
        var countryCode: String?,
        var startDate: LocalDate?,
        var endDate: LocalDate?,
        var measureType: DeveloperMeasureType?
) : BaseRequest {

    override fun validate(): List<String> {
        val errors = mutableListOf<String>()
        errors.addAll(DashboardCountryPeriodRequest(countryCode, startDate, endDate).validate())
        errors.addIfNotNull(Validators.oneOf(measureType, DeveloperMeasureType.values(), "measure type"))
        return errors
    }
}