package ru.legohuman.devstat.service

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import ru.legohuman.devstat.dto.*
import ru.legohuman.devstat.repository.DeveloperFactRepository
import ru.legohuman.devstat.util.ConversionUtil.implicitDoubleToRoundInt
import ru.legohuman.devstat.util.DeveloperMeasureDescriptorRegistry
import java.lang.RuntimeException
import java.time.LocalDate
import javax.persistence.EntityManager

interface DeveloperStatService {
    fun getMeanDevSummary(request: DashboardCountryPeriodRequest): MeanDevSummary?

    fun getDevMeasureChartData(request: DashboardCountryPeriodMeasureTypeRequest): ChartDataSet<ChartValuesType>
}

@Service
open class DeveloperStatServiceImpl @Autowired constructor(
        private val developerFactRepository: DeveloperFactRepository,
        private val em: EntityManager,
        private val descriptorRegistry: DeveloperMeasureDescriptorRegistry
) : DeveloperStatService {

    override fun getMeanDevSummary(request: DashboardCountryPeriodRequest): MeanDevSummary? {
        val rows = developerFactRepository.getSummary(request.countryCode, request.startDate ?: LocalDate.MIN, request.endDate ?: LocalDate.MAX)
        if (rows.isNotEmpty() && rows[0][0] != null) {
            val row = rows[0]
            val age = implicitDoubleToRoundInt(row[0]!!)
            val salary = implicitDoubleToRoundInt(row[1]!!)
            val experience = implicitDoubleToRoundInt(row[2]!!)
            val companySize = implicitDoubleToRoundInt(row[3]!!)
            return MeanDevSummary(age, salary, experience, companySize)
        }
        return null
    }

    override fun getDevMeasureChartData(request: DashboardCountryPeriodMeasureTypeRequest): ChartDataSet<ChartValuesType> {
        val descriptor = descriptorRegistry.getDescriptor<ChartBin>(request.measureType!!)
        if (descriptor != null) {
            return ChartDataSet(descriptor.getChartValues(em, request), descriptor.getMeanValue(em, request))
        }
        throw RuntimeException("Unable to find developer measure descriptor for ${request.measureType} type")
    }
}