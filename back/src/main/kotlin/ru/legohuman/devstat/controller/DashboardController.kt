package ru.legohuman.devstat.controller

import com.fasterxml.jackson.databind.node.NullNode
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.bind.annotation.RestController
import ru.legohuman.devstat.dto.DashboardCountryPeriodMeasureTypeRequest
import ru.legohuman.devstat.dto.DashboardCountryPeriodRequest
import ru.legohuman.devstat.dto.DashboardPeriodRequest
import ru.legohuman.devstat.repository.CountryFactRepository
import ru.legohuman.devstat.service.CountryStatService
import ru.legohuman.devstat.service.DeveloperStatService

@Suppress("unused")
@RestController
@RequestMapping("dashboard")
class DashboardController(
        private val countryStatService: CountryStatService,
        private val developerStatService: DeveloperStatService,
        private val countryFactRepository: CountryFactRepository
) : BaseController() {

    @RequestMapping(path = ["/countries/summary"], method = [(RequestMethod.GET)])
    fun getCountriesSummary(request: DashboardPeriodRequest): ResponseEntity<Any> {
        return handleRequestIfValid(request, {
            ResponseEntity(countryStatService.getSummary(request), HttpStatus.OK)
        })
    }

    @RequestMapping(path = ["/countries/{countryCode}/meanDev"], method = [(RequestMethod.GET)])
    fun getMeanDev(request: DashboardCountryPeriodRequest): ResponseEntity<Any> {
        return handleRequestIfValid(request, {
            ResponseEntity(developerStatService.getMeanDevSummary(request) ?: NullNode.instance, HttpStatus.OK)
        })
    }

    @RequestMapping(path = ["/countries/{countryCode}/charts/{measureType}"], method = [(RequestMethod.GET)])
    fun getMeasureChartData(request: DashboardCountryPeriodMeasureTypeRequest): ResponseEntity<Any> {
        return handleRequestIfValid(request, {
            ResponseEntity(developerStatService.getDevMeasureChartData(request), HttpStatus.OK)
        })
    }
}