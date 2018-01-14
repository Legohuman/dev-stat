package ru.legohuman.devstat.service

import org.springframework.beans.factory.annotation.Value
import ru.legohuman.devstat.dao.ChartDataDao
import ru.legohuman.devstat.domain.CountryEntity
import ru.legohuman.devstat.domain.FactEntity
import ru.legohuman.devstat.dto.DataGenerationRequest
import ru.legohuman.devstat.dto.DataRequestIdentity
import ru.legohuman.devstat.repository.CountryRepository

abstract class BaseDataGenerationService<in T : DataGenerationRequest<MT>, out E : FactEntity, MT> constructor(
        open protected val chartDataDao: ChartDataDao,
        open protected val countryRepository: CountryRepository
) : DataGenerationService<T, MT> {
    @Value("\${spring.jpa.properties.hibernate.jdbc.batch_size}")
    private var jdbcBatchSize = 100

    override fun generateData(generationRequest: T): List<String> {
        val errors = generationRequest.validate()

        if (errors.isEmpty()) {
            removeData(generationRequest.identity)
            val iterator = createGenerationIterator(generationRequest)

            var generatedCount = 0
            while (iterator.hasNext()) {
                if (generatedCount > 0 && generatedCount % jdbcBatchSize == 0) {
                    chartDataDao.flushAndClear()
                }

                val entity = iterator.next()
                generatedCount++
                chartDataDao.persist(entity)
            }
        }
        return errors
    }

    abstract fun createGenerationIterator(generationRequest: T): Iterator<E>

    abstract override fun removeData(identity: DataRequestIdentity)

    protected fun getOrSaveCountry(code: String): CountryEntity {
        val country = countryRepository.findOne(code)
        return country ?: countryRepository.save(CountryEntity(code))
    }
}