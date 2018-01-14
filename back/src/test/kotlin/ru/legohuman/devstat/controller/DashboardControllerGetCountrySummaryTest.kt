package ru.legohuman.devstat.controller

import org.junit.Test
import org.mockito.Mockito.`when`
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.*
import ru.legohuman.devstat.dto.CountrySummary
import ru.legohuman.devstat.repository.CountryFactRepository
import ru.legohuman.devstat.util.ConversionUtil
import ru.legohuman.devstat.util.Validators


class DashboardControllerGetCountrySummaryTest : ControllerTests() {

    @MockBean
    private val countryFactRepository: CountryFactRepository? = null

    @Test
    fun testGetCountrySummaryCorrectDates() {
        testAndAssertCorrectResults("01.01.2018", "01.01.2019")
    }

    @Test
    fun testGetCountrySummaryMinDateRange() {
        testAndAssertCorrectResults("01.01.2018", "01.01.2018")
    }

    @Test
    fun testGetCountrySummaryNoStartDate() {
        testAndAssertCorrectResults(null, "01.01.2019")
    }

    @Test
    fun testGetCountrySummaryNoEndDate() {
        testAndAssertCorrectResults("01.01.2018", null)
    }

    @Test
    fun testGetCountrySummaryWholeDateRange() {
        testAndAssertCorrectResults(null, null)
    }

    private fun testAndAssertCorrectResults(startDate: String?, endDate: String?) {
        `when`(countryFactRepository!!.getSummary(ConversionUtil.parseDate(startDate) ?: Validators.minDate, ConversionUtil.parseDate(endDate) ?: Validators.maxDate)).thenReturn(listOf(arrayOf("RUS", 900_000.4, 12_000.5, 3.0)))

        val summaryRequest = get("/dashboard/countries/summary")
        if (startDate != null) {
            summaryRequest.param("startDate", startDate)
        }
        if (endDate != null) {
            summaryRequest.param("endDate", endDate)
        }

        mockMvc.perform(summaryRequest)
                .andExpect(status().isOk)
                .andExpect(content().contentType(jsonContentType))
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$.RUS.developersCount").value(900_000))
                .andExpect(jsonPath("$.RUS.vacancyCount").value(12_001))
                .andExpect(jsonPath("$.RUS.economyLevel").value(3))
    }

    @Test
    fun testGetCountrySummaryInvalidDateRange() {
        testAndAssertInvalidDateRange("01.01.2019", "01.01.2018")
    }

    @Test
    fun testGetCountrySummaryInvalidMinOverlappingTimeRange() {
        testAndAssertInvalidDateRange("01.01.2019", "31.12.2018")
    }

    private fun testAndAssertInvalidDateRange(startDate: String, endDate: String) {
        mockMvc.perform(get("/dashboard/countries/summary")
                .param("startDate", startDate)
                .param("endDate", endDate))

                .andExpect(status().isBadRequest)
                .andExpect(content().contentType(jsonContentType))
                .andExpect(content().json(mapper.writeValueAsString(listOf("Invalid date range $startDate, $endDate. Start date should not be later than end date."))))
    }

    @Test
    fun testGetCountrySummaryInvalidStartDate() {
        val startDate = "01.01.1018"
        val endDate = "01.01.2019"
        mockMvc.perform(get("/dashboard/countries/summary")
                .param("startDate", startDate)
                .param("endDate", endDate))

                .andExpect(status().isBadRequest)
                .andExpect(content().contentType(jsonContentType))
                .andExpect(content().json(mapper.writeValueAsString(listOf("Invalid start date $startDate. Value should not be earlier than ${ConversionUtil.formatLocalDate(Validators.minDate)}."))))
    }

    @Test
    fun testGetCountrySummaryInvalidEndDate() {
        val startDate = "01.01.2018"
        val endDate = "01.01.3019"
        mockMvc.perform(get("/dashboard/countries/summary")
                .param("startDate", startDate)
                .param("endDate", endDate))

                .andExpect(status().isBadRequest)
                .andExpect(content().contentType(jsonContentType))
                .andExpect(content().json(mapper.writeValueAsString(listOf("Invalid end date $endDate. Value should not be later than ${ConversionUtil.formatLocalDate(Validators.maxDate)}."))))
    }

    @Test
    fun testGetCountrySummaryNoData() {
        val startDate = "01.01.2019"
        val endDate = "01.01.2020"
        `when`(countryFactRepository!!.getSummary(ConversionUtil.parseDate(startDate)!!, ConversionUtil.parseDate(endDate)!!)).thenReturn(listOf())
        mockMvc.perform(get("/dashboard/countries/summary")
                .param("startDate", startDate)
                .param("endDate", endDate))

                .andExpect(status().isOk)
                .andExpect(content().contentType(jsonContentType))
                .andExpect(content().json(mapper.writeValueAsString(mapOf<String, CountrySummary>())))
    }
}