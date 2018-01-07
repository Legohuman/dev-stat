package ru.legohuman.devstat.service

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import ru.legohuman.devstat.domain.DeveloperFactEntity
import ru.legohuman.devstat.dto.DataRequestIdentity
import ru.legohuman.devstat.dto.DeveloperGenerationRequest
import ru.legohuman.devstat.repository.CountryRepository
import ru.legohuman.devstat.repository.DeveloperFactRepository
import ru.legohuman.devstat.util.DeveloperGenerationIterator
import javax.persistence.EntityManager
import javax.transaction.Transactional

interface DeveloperDataGenerationService : DataGenerationService<DeveloperGenerationRequest> {

    override fun generateData(generationRequest: DeveloperGenerationRequest)

    override fun removeData(identity: DataRequestIdentity)
}

@Service
@Transactional
open class DeveloperDataGenerationServiceImpl @Autowired constructor(
        em: EntityManager,
        countryRepository: CountryRepository,
        private val developerFactRepository: DeveloperFactRepository
) :
        BaseDataGenerationService<DeveloperGenerationRequest, DeveloperFactEntity>(em, countryRepository),
        DeveloperDataGenerationService {

    /**
     * Overriding superclass method to make it transactional
     */
    override fun generateData(generationRequest: DeveloperGenerationRequest) {
        super.generateData(generationRequest)
    }

    override fun createGenerationIterator(generationRequest: DeveloperGenerationRequest): Iterator<DeveloperFactEntity> {
        val country = getOrSaveCountry(generationRequest.identity.countryCode)
        return DeveloperGenerationIterator(generationRequest, country)
    }

    override fun removeData(identity: DataRequestIdentity) {
        developerFactRepository.deleteByCodeAndDates(identity.countryCode, identity.startDate, identity.endDate)
    }
}