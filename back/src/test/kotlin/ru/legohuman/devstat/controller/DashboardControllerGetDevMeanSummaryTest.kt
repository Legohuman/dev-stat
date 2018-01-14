package ru.legohuman.devstat.controller

import org.junit.Test
import org.mockito.Mockito.`when`
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.content
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import ru.legohuman.devstat.dto.MeanDevSummary
import ru.legohuman.devstat.repository.DeveloperFactRepository
import ru.legohuman.devstat.util.ConversionUtil


class DashboardControllerGetDevMeanSummaryTest : ControllerTests() {

    @MockBean
    private lateinit var developerFactRepository: DeveloperFactRepository

    @Test
    fun testGetMeanDevCorrectParameters() {
        val startDate = "01.01.2018"
        val endDate = "01.01.2019"
        val countryCode = "RUS"
        `when`(developerFactRepository.getSummary(countryCode, ConversionUtil.parseDate(startDate)!!, ConversionUtil.parseDate(endDate)!!)).thenReturn(listOf(arrayOf<Any?>(29.9, 2000.5, 5.1, 300.0)))
        mockMvc.perform(get("/dashboard/countries/$countryCode/meanDev")
                .param("startDate", startDate)
                .param("endDate", endDate))

                .andExpect(status().isOk)
                .andExpect(content().contentType(jsonContentType))
                .andExpect(content().json(mapper.writeValueAsString(MeanDevSummary(30, 2001, 5, 300))))
    }

    @Test
    fun testGetMeanDevNoData() {
        val startDate = "01.01.2019"
        val endDate = "01.01.2020"
        val countryCode = "RUS"
        `when`(developerFactRepository.getSummary(countryCode, ConversionUtil.parseDate(startDate)!!, ConversionUtil.parseDate(endDate)!!)).thenReturn(listOf())
        mockMvc.perform(get("/dashboard/countries/$countryCode/meanDev")
                .param("startDate", startDate)
                .param("endDate", endDate))

                .andExpect(status().isOk)
                .andExpect(content().contentType(jsonContentType))
                .andExpect(content().string("null"))
    }

    @Test
    fun testGetMeanDevBlankCountryCode() {
        val startDate = "01.01.2019"
        val endDate = "01.01.2020"
        mockMvc.perform(get("/dashboard/countries/ /meanDev")
                .param("startDate", startDate)
                .param("endDate", endDate))

                .andExpect(status().isBadRequest)
                .andExpect(content().contentType(jsonContentType))
                .andExpect(content().json(mapper.writeValueAsString(listOf("Invalid country code  . Expected value should contain 3 uppercase letters."))))
    }
}