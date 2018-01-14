package ru.legohuman.devstat.controller

import com.fasterxml.jackson.databind.node.NullNode
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import ru.legohuman.devstat.dto.DashboardCountryPeriodMeasureTypeRequest
import ru.legohuman.devstat.dto.DashboardCountryPeriodRequest
import ru.legohuman.devstat.dto.DashboardPeriodRequest
import ru.legohuman.devstat.dto.DeveloperMeasureType
import ru.legohuman.devstat.repository.CountryFactRepository
import ru.legohuman.devstat.service.CountryStatService
import ru.legohuman.devstat.service.DeveloperStatService
import ru.legohuman.devstat.util.ConversionUtil
import ru.legohuman.devstat.util.EnumUtil

@Suppress("unused")
@RestController
@RequestMapping("dashboard")
class DashboardController(
        private val countryStatService: CountryStatService,
        private val developerStatService: DeveloperStatService,
        private val countryFactRepository: CountryFactRepository
) : BaseController() {

    @RequestMapping(path = ["/countries/summary"], method = [(RequestMethod.GET)])
    fun getCountriesSummary(@RequestParam("startDate", required = false) startDate: String?,
                            @RequestParam("endDate", required = false) endDate: String?): ResponseEntity<Any> {
        val request = DashboardPeriodRequest(ConversionUtil.parseDate(startDate), ConversionUtil.parseDate(endDate))
        return handleRequestIfValid(request, {
            ResponseEntity(countryStatService.getSummary(request), HttpStatus.OK)
        })
    }

    @RequestMapping(path = ["/countries/{countryCode}/meanDev"], method = [(RequestMethod.GET)])
    fun getMeanDev(@PathVariable("countryCode", required = false) countryCode: String?,
                   @RequestParam("startDate", required = false) startDate: String?,
                   @RequestParam("endDate", required = false) endDate: String?): ResponseEntity<Any> {
        val request = DashboardCountryPeriodRequest(countryCode, ConversionUtil.parseDate(startDate), ConversionUtil.parseDate(endDate))
        return handleRequestIfValid(request, {
            ResponseEntity(developerStatService.getMeanDevSummary(request) ?: NullNode.instance, HttpStatus.OK)
        })
    }

    @RequestMapping(path = ["/countries/{countryCode}/charts/{measureType}"], method = [(RequestMethod.GET)])
    fun getMeasureChartData(@PathVariable("countryCode", required = false) countryCode: String?,
                            @PathVariable("measureType", required = false) measureType: String?,
                            @RequestParam("startDate", required = false) startDate: String?,
                            @RequestParam("endDate", required = false) endDate: String?): ResponseEntity<Any> {
        val request = DashboardCountryPeriodMeasureTypeRequest(countryCode,
                ConversionUtil.parseDate(startDate), ConversionUtil.parseDate(endDate),
                EnumUtil.nullableValueOf(measureType, DeveloperMeasureType.values()))

        return handleRequestIfValid(request, {
            ResponseEntity(developerStatService.getDevMeasureChartData(request), HttpStatus.OK)
        })
    }
}