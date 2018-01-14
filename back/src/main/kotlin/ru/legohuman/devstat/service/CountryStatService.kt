package ru.legohuman.devstat.service

import org.springframework.stereotype.Service
import ru.legohuman.devstat.dto.CountrySummary
import ru.legohuman.devstat.dto.DashboardPeriodRequest
import ru.legohuman.devstat.repository.CountryFactRepository
import ru.legohuman.devstat.util.ConversionUtil.implicitDoubleToRoundInt
import ru.legohuman.devstat.util.Validators


interface CountryStatService {
    fun getSummary(request: DashboardPeriodRequest): Map<String, CountrySummary>
}

@Service
class CountryStatServiceImpl(
        private val countryFactRepository: CountryFactRepository
) : CountryStatService {

    override fun getSummary(request: DashboardPeriodRequest): Map<String, CountrySummary> {
        return countryFactRepository.getSummary(request.startDate ?: Validators.minDate, request.endDate ?: Validators.maxDate).map { row ->
            val countryCode = row[0] as String
            val devCont = implicitDoubleToRoundInt(row[1])
            val vacancyCount = implicitDoubleToRoundInt(row[2])
            val economyLevel = implicitDoubleToRoundInt(row[3])
            Pair(countryCode, CountrySummary(devCont, vacancyCount, economyLevel))
        }.toMap()
    }
}