package ru.legohuman.devstat.controller

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import ru.legohuman.devstat.dto.DashboardRequestFactory
import ru.legohuman.devstat.service.CountryStatService
import ru.legohuman.devstat.service.DeveloperStatService

@Suppress("unused")
@RestController
@RequestMapping("dashboard")
open class DashboardController @Autowired constructor(
        private val countryStatService: CountryStatService,
        private val developerStatService: DeveloperStatService
) {

    @RequestMapping(path = ["/countries/summary"], method = [(RequestMethod.GET)])
    fun getCountriesSummary(@RequestParam("startDate") startDate: String?,
                            @RequestParam("endDate") endDate: String?): ResponseEntity<Any> {
        val request = DashboardRequestFactory.periodRequest(startDate, endDate)

        return if (request.errorMessages.isNotEmpty())
            ResponseEntity(request.errorMessages, HttpStatus.BAD_REQUEST)
        else
            ResponseEntity(countryStatService.getSummary(request), HttpStatus.OK)
    }

    @RequestMapping(path = ["/countries/{countryCode}/meanDev"], method = [(RequestMethod.GET)])
    fun getMeanDev(@PathVariable("countryCode") countryCode: String,
                   @RequestParam("startDate") startDate: String?,
                   @RequestParam("endDate") endDate: String?): ResponseEntity<Any?> {
        val request = DashboardRequestFactory.countryPeriodRequest(countryCode, startDate, endDate)

        return if (request.errorMessages.isNotEmpty())
            ResponseEntity(request.errorMessages, HttpStatus.BAD_REQUEST)
        else
            ResponseEntity(developerStatService.getMeanDevSummary(request), HttpStatus.OK)
    }

    @RequestMapping(path = ["/countries/{countryCode}/charts/{measureType}"], method = [(RequestMethod.GET)])
    fun getAgeChartData(@PathVariable("countryCode") countryCode: String,
                        @PathVariable("measureType") measureType: String,
                        @RequestParam("startDate") startDate: String?,
                        @RequestParam("endDate") endDate: String?): ResponseEntity<Any> {
        val request = DashboardRequestFactory.countryPeriodMeasureTypeRequest(countryCode, measureType, startDate, endDate)

        return if (request.errorMessages.isNotEmpty())
            ResponseEntity(request.errorMessages, HttpStatus.BAD_REQUEST)
        else
            ResponseEntity(developerStatService.getDevMeasureChartData(request), HttpStatus.OK)
    }
}