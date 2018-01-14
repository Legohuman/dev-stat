package ru.legohuman.devstat.dao

import org.springframework.stereotype.Service
import ru.legohuman.devstat.domain.BaseEntity
import javax.persistence.EntityManager
import javax.transaction.Transactional

interface BaseDao {
    fun persist(entity: BaseEntity)

    fun flushAndClear()
}

@Service
@Transactional
abstract class BaseDaoImpl(
        protected val em: EntityManager
) : BaseDao {
    override fun persist(entity: BaseEntity) {
        em.persist(entity)
    }

    override fun flushAndClear() {
        em.flush()
        em.clear()
    }
}