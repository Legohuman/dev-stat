package ru.legohuman.devstat.controller

import org.junit.Before
import org.junit.Test
import org.mockito.Mockito.`when`
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.*
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import org.springframework.web.context.WebApplicationContext
import ru.legohuman.devstat.repository.DeveloperFactRepository
import ru.legohuman.devstat.util.ConversionUtil


class DashboardControllerGetDevMeanSummaryTest : ControllerTests() {

    @Autowired
    private val webApplicationContext: WebApplicationContext? = null

    private var mockMvc: MockMvc? = null

    @MockBean
    private val developerFactRepository: DeveloperFactRepository? = null

    @Before
    fun setup() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext!!).build()
    }

    @Test
    fun testGetMeanDevCorrectParameters() {
        val startDate = "01.01.2018"
        val endDate = "01.01.2019"
        val countryCode = "RUS"
        `when`(developerFactRepository!!.getSummary(countryCode, ConversionUtil.parseDate(startDate)!!, ConversionUtil.parseDate(endDate)!!)).thenReturn(listOf(arrayOf<Any?>(29.9, 2000.5, 5.1, 300.0)))
        mockMvc!!.perform(get("/dashboard/countries/$countryCode/meanDev")
                .param("startDate", startDate)
                .param("endDate", endDate))

                .andExpect(status().isOk)
                .andExpect(content().contentType(jsonContentType))
                .andExpect(jsonPath("$.age").value(30))
                .andExpect(jsonPath("$.salary").value(2001))
                .andExpect(jsonPath("$.experience").value(5))
                .andExpect(jsonPath("$.companySize").value(300))
    }

    @Test
    fun testGetMeanDevNoData() {
        val startDate = "01.01.2019"
        val endDate = "01.01.2020"
        val countryCode = "RUS"
        `when`(developerFactRepository!!.getSummary(countryCode, ConversionUtil.parseDate(startDate)!!, ConversionUtil.parseDate(endDate)!!)).thenReturn(listOf())
        mockMvc!!.perform(get("/dashboard/countries/$countryCode/meanDev")
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
        mockMvc!!.perform(get("/dashboard/countries/ /meanDev")
                .param("startDate", startDate)
                .param("endDate", endDate))

                .andExpect(status().isBadRequest)
                .andExpect(content().contentType(jsonContentType))
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0]").value("Invalid empty country code. Expected country code contains 3 letters."))
    }

}