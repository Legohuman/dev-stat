package ru.legohuman.devstat.controller

import org.junit.Test
import org.mockito.ArgumentMatchers
import org.mockito.Mockito.times
import org.mockito.Mockito.verify
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.content
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import ru.legohuman.devstat.dao.ChartDataDao
import ru.legohuman.devstat.domain.CountryEntity
import ru.legohuman.devstat.domain.CountryFactEntity
import ru.legohuman.devstat.dto.CountryGenerationRequest
import ru.legohuman.devstat.dto.CountryMeasureType
import ru.legohuman.devstat.dto.DataRequestIdentity
import ru.legohuman.devstat.dto.ValuesGenerationRequest
import ru.legohuman.devstat.repository.CountryFactRepository
import ru.legohuman.devstat.util.ConversionUtil
import java.time.LocalDate


class GeneratorControllerCountryTest : ControllerTests() {

    private val devCountGenerationPair = Pair(CountryMeasureType.devCount, ValuesGenerationRequest(100, 200, 10))
    private val vacancyCountGenerationPair = Pair(CountryMeasureType.vacancyCount, ValuesGenerationRequest(50, 100, 5))
    private val economyLevelGenerationPair = Pair(CountryMeasureType.economyLevel, ValuesGenerationRequest(3, 5, 1))
    private val measureToValuesGenerationRequest = mapOf(devCountGenerationPair, vacancyCountGenerationPair, economyLevelGenerationPair)
    private val requestIdentity = DataRequestIdentity("RUS", ConversionUtil.parseDate("01.01.2018")!!, ConversionUtil.parseDate("10.01.2018")!!)

    @MockBean
    private lateinit var countryFactRepository: CountryFactRepository
    @MockBean
    private lateinit var chartDataDao: ChartDataDao

    @Test
    fun testGenerateCountryData() {
        val countryGenerationRequest = CountryGenerationRequest(requestIdentity, measureToValuesGenerationRequest)

        mockMvc.perform(put("/generators/countries")
                .contentType(jsonContentType)
                .content(mapper.writeValueAsString(countryGenerationRequest)))

                .andExpect(status().isOk)
                .andExpect(content().contentType(jsonContentType))
                .andExpect(content().string("null"))

        verify(countryFactRepository, times(1)).deleteByCodeAndDates("RUS", requestIdentity.startDate, requestIdentity.endDate)
        verify(chartDataDao, times(10)).persist(
                ArgumentMatchers.argThat<CountryFactEntity>({ country ->
                    !country.actualDate.isBefore(requestIdentity.startDate) && !country.actualDate.isAfter(requestIdentity.endDate) &&
                            country.devCount >= 90 && country.devCount <= 210 &&
                            country.vacancyCount >= 45 && country.vacancyCount <= 105 &&
                            country.economyLevel >= 2 && country.economyLevel <= 6
                }) ?: CountryFactEntity(null, CountryEntity("RUS"), LocalDate.now(), 0, 0, 0))
    }

    @Test
    fun testRemoveCountryData() {
        mockMvc.perform(delete("/generators/countries")
                .contentType(jsonContentType)
                .content(mapper.writeValueAsString(requestIdentity)))

                .andExpect(status().isOk)
                .andExpect(content().contentType(jsonContentType))
                .andExpect(content().string("null"))

        verify(countryFactRepository, times(1)).deleteByCodeAndDates("RUS", requestIdentity.startDate, requestIdentity.endDate)
    }

    @Test
    fun testGenerateCountryDataInvalidDateRange() {
        val startDate = ConversionUtil.parseDate("01.01.2019")!!
        val endDate = ConversionUtil.parseDate("01.01.2018")!!
        testAndAssertGenerateCountryDataInvalidParameters(CountryGenerationRequest(DataRequestIdentity("RUS", startDate, endDate), measureToValuesGenerationRequest),
                listOf("Invalid date range 01.01.2019, 01.01.2018. Start date should not be later than end date."))
    }

    @Test
    fun testGenerateCountryDataInvalidMinOverlappingTimeRange() {
        val startDate = ConversionUtil.parseDate("01.01.2019")!!
        val endDate = ConversionUtil.parseDate("31.12.2018")!!
        testAndAssertGenerateCountryDataInvalidParameters(CountryGenerationRequest(DataRequestIdentity("RUS", startDate, endDate), measureToValuesGenerationRequest),
                listOf("Invalid date range 01.01.2019, 31.12.2018. Start date should not be later than end date."))
    }

    @Test
    fun testGenerateCountryDataInvalidStartDate() {
        val startDate = ConversionUtil.parseDate("01.01.1018")!!
        val endDate = ConversionUtil.parseDate("01.01.2019")!!
        testAndAssertGenerateCountryDataInvalidParameters(CountryGenerationRequest(DataRequestIdentity("RUS", startDate, endDate), measureToValuesGenerationRequest),
                listOf("Invalid start date 01.01.1018. Value should not be earlier than 01.01.1900."))
    }

    @Test
    fun testGenerateCountryDataInvalidEndDate() {
        val startDate = ConversionUtil.parseDate("01.01.2018")!!
        val endDate = ConversionUtil.parseDate("01.01.3019")!!
        testAndAssertGenerateCountryDataInvalidParameters(CountryGenerationRequest(DataRequestIdentity("RUS", startDate, endDate), measureToValuesGenerationRequest),
                listOf("Invalid end date 01.01.3019. Value should not be later than 31.12.2099."))
    }

    @Test
    fun testGenerateCountryDataInvalidMissedMeasureTypeDate() {
        testAndAssertGenerateCountryDataInvalidParameters(CountryGenerationRequest(requestIdentity, mapOf(devCountGenerationPair, vacancyCountGenerationPair)),
                listOf("Invalid request. Object should contain key for economyLevel values generation parameters."))
    }

    @Test
    fun testGenerateCountryDataInvalidStartValueMinusDeviation() {
        val generationRequest = CountryGenerationRequest(requestIdentity,
                mapOf(devCountGenerationPair, economyLevelGenerationPair, Pair(CountryMeasureType.vacancyCount, ValuesGenerationRequest(0, 100, 10))))
        testAndAssertGenerateCountryDataInvalidParameters(generationRequest,
                listOf("Invalid start value in vacancyCount values generation parameters (value: 0, deviation: 10). Value minus deviation should not be less than 0."))
    }

    @Test
    fun testGenerateCountryDataInvalidEndValuePlusDeviation() {
        val generationRequest = CountryGenerationRequest(requestIdentity,
                mapOf(devCountGenerationPair, economyLevelGenerationPair, Pair(CountryMeasureType.vacancyCount, ValuesGenerationRequest(900000, 1_000_000_000, 10))))
        testAndAssertGenerateCountryDataInvalidParameters(generationRequest,
                listOf("Invalid end value in vacancyCount values generation parameters (value: 1000000000, deviation: 10). Value plus deviation should not be bigger than 1000000000."))
    }

    @Test
    fun testGenerateCountryDataInvalidNegativeDeviation() {
        val generationRequest = CountryGenerationRequest(requestIdentity,
                mapOf(devCountGenerationPair, economyLevelGenerationPair, Pair(CountryMeasureType.vacancyCount, ValuesGenerationRequest(1000, 2000, -10))))
        testAndAssertGenerateCountryDataInvalidParameters(generationRequest,
                listOf("Invalid deviation in vacancyCount values generation parameters -10. Value should not be negative."))
    }

    private fun testAndAssertGenerateCountryDataInvalidParameters(generationRequest: CountryGenerationRequest, errors: List<String>) {
        mockMvc.perform(MockMvcRequestBuilders.put("/generators/countries")
                .contentType(jsonContentType)
                .content(mapper.writeValueAsString(generationRequest)))
                .andDo({ result ->
                    println("Actual response was: ${result.response.contentAsString}")
                })

                .andExpect(status().isBadRequest)
                .andExpect(content().contentType(jsonContentType))
                .andExpect(content().json(mapper.writeValueAsString(errors)))
    }
}