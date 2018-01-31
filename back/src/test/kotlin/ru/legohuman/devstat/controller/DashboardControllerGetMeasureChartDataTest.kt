package ru.legohuman.devstat.controller

import org.junit.Test
import org.mockito.Mockito.`when`
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.context.TestPropertySource
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.content
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import ru.legohuman.devstat.dao.ChartDataDao
import ru.legohuman.devstat.dto.ChartBin
import ru.legohuman.devstat.dto.ChartDataSet
import ru.legohuman.devstat.dto.ChartPoint
import ru.legohuman.devstat.util.ConversionUtil

@TestPropertySource(properties = [
    "app.measure.bins.group.width.age=5",
    "app.measure.density.points.count.salary=5",
    "app.measure.bins.group.width.experience=5",
    "app.measure.bins.group.width.companySize=5"
])
class DashboardControllerGetMeasureChartDataTest : ControllerTests() {

    @MockBean
    private lateinit var chartDataDao: ChartDataDao

    @Test
    fun testGetAgeChartDataCorrectParameters() {
        testAndAssertGetBinsChartData("age")
    }

    @Test
    fun testGetExperienceChartDataCorrectParameters() {
        testAndAssertGetBinsChartData("experience")
    }

    @Test
    fun testGetCompanySizeChartDataCorrectParameters() {
        testAndAssertGetBinsChartData("companySize")
    }

    @Test
    fun testGetSalaryChartDataCorrectParameters() {
        testAndAssertGetPointsChartData("salary", 11.0,
                listOf(10, 10.1, 10.2, 10.3, 10.5, 10.5, 10.6, 10.6, 11, 11.1, 11.2, 11.5, 11.7, 11.9, 12, 12),
                listOf(ChartPoint(9.0, 0.09782798833819244), ChartPoint(10.0, 0.10416909620991253), ChartPoint(11.0, 0.10613702623906705), ChartPoint(12.0, 0.103731778425656), ChartPoint(13.0, 0.0969533527696793)))
    }

    @Test
    fun testGetSalaryChartDataEmptySourceValues() {
        testAndAssertGetPointsChartData("salary", 11.0, listOf(), listOf())
    }

    private fun testAndAssertGetBinsChartData(measureType: String) {
        val startDate = "01.01.2018"
        val endDate = "01.01.2019"
        val countryCode = "RUS"

        val startLocalDate = ConversionUtil.parseDate(startDate)!!
        val endLocalDate = ConversionUtil.parseDate(endDate)!!
        `when`(chartDataDao.getMeanValue("d.$measureType", "RUS", startLocalDate, endLocalDate))
                .thenReturn(29.7)
        `when`(chartDataDao.getChartGroupedValues("d.$measureType/5", "RUS", startLocalDate, endLocalDate))
                .then({ listOf(arrayOf<Any>(4, 100L), arrayOf<Any>(5, 80L)) })
        val expectedContent = mapper.writeValueAsString(ChartDataSet(
                listOf(ChartBin(20, 25, 100), ChartBin(25, 30, 80)),
                29.7))

        mockMvc.perform(get("/dashboard/countries/$countryCode/charts/$measureType")
                .param("startDate", startDate)
                .param("endDate", endDate))

                .andExpect(status().isOk)
                .andExpect(content().contentType(jsonContentType))
                .andExpect(content().json(expectedContent))
    }

    private fun testAndAssertGetPointsChartData(measureType: String, meanValue: Double, sourceValues: List<Any>, expectedPoints: List<ChartPoint>) {
        val startDate = "01.01.2018"
        val endDate = "01.01.2019"
        val countryCode = "RUS"

        val startLocalDate = ConversionUtil.parseDate(startDate)!!
        val endLocalDate = ConversionUtil.parseDate(endDate)!!
        `when`(chartDataDao.getMeanValue("d.$measureType", "RUS", startLocalDate, endLocalDate))
                .thenReturn(meanValue)
        `when`(chartDataDao.getChartSortedValues("d.$measureType", "RUS", startLocalDate, endLocalDate))
                .then({ sourceValues })
        val expectedContent = mapper.writeValueAsString(ChartDataSet(expectedPoints, meanValue))

        mockMvc.perform(get("/dashboard/countries/$countryCode/charts/$measureType")
                .param("startDate", startDate)
                .param("endDate", endDate))
                .andDo({ result ->
                    println(result)
                })
                .andExpect(status().isOk)
                .andExpect(content().contentType(jsonContentType))
                .andExpect(content().json(expectedContent))
    }

    @Test
    fun testGetChartDataInvalidMeasureType() {
        val startDate = "01.01.2019"
        val endDate = "01.01.2020"
        mockMvc.perform(get("/dashboard/countries/RUS/charts/unknown")
                .param("startDate", startDate)
                .param("endDate", endDate))

                .andExpect(status().isBadRequest)
                .andExpect(content().contentType(jsonContentType))
                .andExpect(content().json(mapper.writeValueAsString(listOf("Request parameters can not be parsed: [Field error in object 'dashboardCountryPeriodMeasureTypeRequest' on field 'measureType': rejected value [unknown]; codes [typeMismatch.dashboardCountryPeriodMeasureTypeRequest.measureType,typeMismatch.measureType,typeMismatch.ru.legohuman.devstat.dto.DeveloperMeasureType,typeMismatch]; arguments [org.springframework.context.support.DefaultMessageSourceResolvable: codes [dashboardCountryPeriodMeasureTypeRequest.measureType,measureType]; arguments []; default message [measureType]]; default message [Failed to convert property value of type 'java.lang.String' to required type 'ru.legohuman.devstat.dto.DeveloperMeasureType' for property 'measureType'; nested exception is org.springframework.core.convert.ConversionFailedException: Failed to convert from type [java.lang.String] to type [ru.legohuman.devstat.dto.DeveloperMeasureType] for value 'unknown'; nested exception is java.lang.IllegalArgumentException: No enum constant ru.legohuman.devstat.dto.DeveloperMeasureType.unknown]]"))))
    }
}