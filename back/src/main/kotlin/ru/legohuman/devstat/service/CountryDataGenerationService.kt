package ru.legohuman.devstat.service

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import ru.legohuman.devstat.domain.CountryFactEntity
import ru.legohuman.devstat.dto.CountryGenerationRequest
import ru.legohuman.devstat.dto.DataRequestIdentity
import ru.legohuman.devstat.repository.CountryFactRepository
import ru.legohuman.devstat.repository.CountryRepository
import ru.legohuman.devstat.util.CountryGenerationIterator
import javax.persistence.EntityManager
import javax.transaction.Transactional

interface CountryDataGenerationService : DataGenerationService<CountryGenerationRequest> {

    override fun generateData(generationRequest: CountryGenerationRequest)

    override fun removeData(identity: DataRequestIdentity)
}

@Service
@Transactional
open class CountryDataGenerationServiceImpl @Autowired constructor(
        em: EntityManager,
        countryRepository: CountryRepository,
        private val countryFactRepository: CountryFactRepository
) :
        BaseDataGenerationService<CountryGenerationRequest, CountryFactEntity>(em, countryRepository),
        CountryDataGenerationService {

    /**
     * Overriding superclass method to make it transactional
     */
    override fun generateData(generationRequest: CountryGenerationRequest) {
        super.generateData(generationRequest)
    }

    override fun createGenerationIterator(generationRequest: CountryGenerationRequest): Iterator<CountryFactEntity> {
        val country = getOrSaveCountry(generationRequest.identity.countryCode)
        return CountryGenerationIterator(generationRequest, country)
    }

    override fun removeData(identity: DataRequestIdentity) {
        countryFactRepository.deleteByCodeAndDates(identity.countryCode, identity.startDate, identity.endDate)
    }
}