package ru.legohuman.devstat.service

import org.springframework.beans.factory.annotation.Value
import ru.legohuman.devstat.domain.CountryEntity
import ru.legohuman.devstat.domain.FactEntity
import ru.legohuman.devstat.dto.DataGenerationRequest
import ru.legohuman.devstat.dto.DataRequestIdentity
import ru.legohuman.devstat.repository.CountryRepository
import javax.persistence.EntityManager

abstract class BaseDataGenerationService<in T : DataGenerationRequest, out E : FactEntity> constructor(
        open protected val em: EntityManager,
        open protected val countryRepository: CountryRepository
) : DataGenerationService<T> {
    @Value("\${spring.jpa.properties.hibernate.jdbc.batch_size}")
    private var jdbcBatchSize = 100

    override fun generateData(generationRequest: T) {
        removeData(generationRequest.identity)
        val iterator = createGenerationIterator(generationRequest)

        var generatedCount = 0
        while (iterator.hasNext()) {
            if (generatedCount > 0 && generatedCount % jdbcBatchSize == 0) {
                em.flush()
                em.clear()
            }

            val entity = iterator.next()
            generatedCount++
            em.persist(entity)
        }
    }

    abstract fun createGenerationIterator(generationRequest: T): Iterator<E>

    abstract override fun removeData(identity: DataRequestIdentity)

    protected fun getOrSaveCountry(code: String): CountryEntity {
        val country = countryRepository.findOne(code)
        return country ?: countryRepository.save(CountryEntity().apply { this.code = code })
    }
}