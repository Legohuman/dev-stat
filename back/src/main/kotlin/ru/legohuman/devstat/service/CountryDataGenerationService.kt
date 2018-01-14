package ru.legohuman.devstat.service

import org.springframework.stereotype.Service
import ru.legohuman.devstat.dao.ChartDataDao
import ru.legohuman.devstat.domain.CountryFactEntity
import ru.legohuman.devstat.dto.CountryGenerationRequest
import ru.legohuman.devstat.dto.CountryMeasureType
import ru.legohuman.devstat.dto.DataRequestIdentity
import ru.legohuman.devstat.repository.CountryFactRepository
import ru.legohuman.devstat.repository.CountryRepository
import ru.legohuman.devstat.util.CountryGenerationIterator
import javax.transaction.Transactional

interface CountryDataGenerationService : DataGenerationService<CountryGenerationRequest, CountryMeasureType> {

    override fun generateData(generationRequest: CountryGenerationRequest): List<String>

    override fun removeData(identity: DataRequestIdentity)
}

@Service
@Transactional
class CountryDataGenerationServiceImpl(
        chartDataDao: ChartDataDao,
        countryRepository: CountryRepository,
        private val countryFactRepository: CountryFactRepository
) :
        BaseDataGenerationService<CountryGenerationRequest, CountryFactEntity, CountryMeasureType>(chartDataDao, countryRepository),
        CountryDataGenerationService {

    /**
     * Overriding superclass method to make it transactional
     */
    override fun generateData(generationRequest: CountryGenerationRequest): List<String> {
        return super.generateData(generationRequest)
    }

    override fun createGenerationIterator(generationRequest: CountryGenerationRequest): Iterator<CountryFactEntity> {
        val country = getOrSaveCountry(generationRequest.identity.countryCode)
        return CountryGenerationIterator(generationRequest, country)
    }

    override fun removeData(identity: DataRequestIdentity) {
        countryFactRepository.deleteByCodeAndDates(identity.countryCode, identity.startDate, identity.endDate)
    }
}