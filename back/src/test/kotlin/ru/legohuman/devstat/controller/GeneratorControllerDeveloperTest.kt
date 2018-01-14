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
import ru.legohuman.devstat.domain.DeveloperFactEntity
import ru.legohuman.devstat.dto.DataRequestIdentity
import ru.legohuman.devstat.dto.DeveloperGenerationRequest
import ru.legohuman.devstat.dto.DeveloperMeasureType
import ru.legohuman.devstat.dto.ValuesGenerationRequest
import ru.legohuman.devstat.repository.DeveloperFactRepository
import ru.legohuman.devstat.util.ConversionUtil


class GeneratorControllerDeveloperTest : ControllerTests() {

    private val ageGenerationPair = Pair(DeveloperMeasureType.age, ValuesGenerationRequest(23, 27, 3))
    private val salaryCountGenerationPair = Pair(DeveloperMeasureType.salary, ValuesGenerationRequest(2500, 2600, 500))
    private val experienceGenerationPair = Pair(DeveloperMeasureType.experience, ValuesGenerationRequest(6, 8, 3))
    private val companySizeGenerationPair = Pair(DeveloperMeasureType.companySize, ValuesGenerationRequest(100, 120, 50))
    private val measureToValuesGenerationRequest = mapOf(ageGenerationPair, salaryCountGenerationPair, experienceGenerationPair, companySizeGenerationPair)
    private val requestIdentity = DataRequestIdentity("RUS", ConversionUtil.parseDate("01.01.2018")!!, ConversionUtil.parseDate("10.01.2018")!!)

    @MockBean
    private lateinit var developerFactRepository: DeveloperFactRepository
    @MockBean
    private lateinit var chartDataDao: ChartDataDao

    @Test
    fun testGenerateDeveloperData() {
        val countryGenerationRequest = DeveloperGenerationRequest(requestIdentity, measureToValuesGenerationRequest, 200)

        mockMvc.perform(put("/generators/developers")
                .contentType(jsonContentType)
                .content(mapper.writeValueAsString(countryGenerationRequest)))

                .andExpect(status().isOk)
                .andExpect(content().contentType(jsonContentType))
                .andExpect(content().string("null"))

        verify(developerFactRepository, times(1)).deleteByCodeAndDates("RUS", requestIdentity.startDate, requestIdentity.endDate)
        verify(chartDataDao, times(200)).persist(
                ArgumentMatchers.argThat<DeveloperFactEntity>({ dev ->
                    !dev.actualDate!!.isBefore(requestIdentity.startDate) && !dev.actualDate!!.isAfter(requestIdentity.endDate) &&
                            dev.age!! >= 20 && dev.age!! <= 30 &&
                            dev.salary!! >= 2000 && dev.salary!! <= 3100 &&
                            dev.experience!! >= 3 && dev.experience!! <= 11 &&
                            dev.companySize!! >= 50 && dev.companySize!! <= 170
                }) ?: DeveloperFactEntity())
    }

    @Test
    fun testRemoveDeveloperData() {
        mockMvc.perform(delete("/generators/developers")
                .contentType(jsonContentType)
                .content(mapper.writeValueAsString(requestIdentity)))

                .andExpect(status().isOk)
                .andExpect(content().contentType(jsonContentType))
                .andExpect(content().string("null"))

        verify(developerFactRepository, times(1)).deleteByCodeAndDates("RUS", requestIdentity.startDate, requestIdentity.endDate)
    }

    @Test
    fun testGenerateDeveloperDataInvalidDateRange() {
        val startDate = ConversionUtil.parseDate("01.01.2019")!!
        val endDate = ConversionUtil.parseDate("01.01.2018")!!
        testAndAssertGenerateDeveloperDataInvalidParameters(DeveloperGenerationRequest(DataRequestIdentity("RUS", startDate, endDate), measureToValuesGenerationRequest, 10),
                listOf("Invalid date range 01.01.2019, 01.01.2018. Start date should not be later than end date."))
    }

    @Test
    fun testGenerateDeveloperDataInvalidMinOverlappingTimeRange() {
        val startDate = ConversionUtil.parseDate("01.01.2019")!!
        val endDate = ConversionUtil.parseDate("31.12.2018")!!
        testAndAssertGenerateDeveloperDataInvalidParameters(DeveloperGenerationRequest(DataRequestIdentity("RUS", startDate, endDate), measureToValuesGenerationRequest, 10),
                listOf("Invalid date range 01.01.2019, 31.12.2018. Start date should not be later than end date."))
    }

    @Test
    fun testGenerateDeveloperDataInvalidStartDate() {
        val startDate = ConversionUtil.parseDate("01.01.1018")!!
        val endDate = ConversionUtil.parseDate("01.01.2019")!!
        testAndAssertGenerateDeveloperDataInvalidParameters(DeveloperGenerationRequest(DataRequestIdentity("RUS", startDate, endDate), measureToValuesGenerationRequest, 10),
                listOf("Invalid start date 01.01.1018. Value should not be earlier than 01.01.1900."))
    }

    @Test
    fun testGenerateDeveloperDataInvalidEndDate() {
        val startDate = ConversionUtil.parseDate("01.01.2018")!!
        val endDate = ConversionUtil.parseDate("01.01.3019")!!
        testAndAssertGenerateDeveloperDataInvalidParameters(DeveloperGenerationRequest(DataRequestIdentity("RUS", startDate, endDate), measureToValuesGenerationRequest, 10),
                listOf("Invalid end date 01.01.3019. Value should not be later than 31.12.2099."))
    }

    @Test
    fun testGenerateDeveloperDataInvalidMissedMeasureTypeDate() {
        testAndAssertGenerateDeveloperDataInvalidParameters(DeveloperGenerationRequest(requestIdentity, mapOf(ageGenerationPair, salaryCountGenerationPair, experienceGenerationPair), 10),
                listOf("Invalid request. Object should contain key for companySize values generation parameters."))
    }

    @Test
    fun testGenerateDeveloperDataInvalidStartValueMinusDeviation() {
        val generationRequest = DeveloperGenerationRequest(requestIdentity,
                mapOf(ageGenerationPair, salaryCountGenerationPair, experienceGenerationPair, Pair(DeveloperMeasureType.companySize, ValuesGenerationRequest(0, 100, 10))), 10)
        testAndAssertGenerateDeveloperDataInvalidParameters(generationRequest,
                listOf("Invalid start value in companySize values generation parameters (value: 0, deviation: 10). Value minus deviation should not be less than 1."))
    }

    @Test
    fun testGenerateDeveloperDataInvalidEndValuePlusDeviation() {
        val generationRequest = DeveloperGenerationRequest(requestIdentity,
                mapOf(ageGenerationPair, salaryCountGenerationPair, experienceGenerationPair, Pair(DeveloperMeasureType.companySize, ValuesGenerationRequest(900000, 1_000_000_000, 10))), 10)
        testAndAssertGenerateDeveloperDataInvalidParameters(generationRequest,
                listOf("Invalid end value in companySize values generation parameters (value: 1000000000, deviation: 10). Value plus deviation should not be bigger than 1000000."))
    }

    @Test
    fun testGenerateDeveloperDataInvalidNegativeDeviation() {
        val generationRequest = DeveloperGenerationRequest(requestIdentity,
                mapOf(ageGenerationPair, salaryCountGenerationPair, experienceGenerationPair, Pair(DeveloperMeasureType.companySize, ValuesGenerationRequest(1000, 2000, -10))), 10)
        testAndAssertGenerateDeveloperDataInvalidParameters(generationRequest,
                listOf("Invalid deviation in companySize values generation parameters -10. Value should not be negative."))
    }

    @Test
    fun testGenerateDeveloperDataInvalidNegativeItemsCount() {
        val generationRequest = DeveloperGenerationRequest(requestIdentity, measureToValuesGenerationRequest, -10)
        testAndAssertGenerateDeveloperDataInvalidParameters(generationRequest,
                listOf("Invalid items count -10. Value should not be negative."))
    }

    private fun testAndAssertGenerateDeveloperDataInvalidParameters(generationRequest: DeveloperGenerationRequest, errors: List<String>) {
        mockMvc.perform(MockMvcRequestBuilders.put("/generators/developers")
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