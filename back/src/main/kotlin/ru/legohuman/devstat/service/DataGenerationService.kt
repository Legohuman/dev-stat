package ru.legohuman.devstat.service

import ru.legohuman.devstat.dto.DataGenerationRequest
import ru.legohuman.devstat.dto.DataRequestIdentity

interface DataGenerationService<in T : DataGenerationRequest> {

    fun generateData(generationRequest: T)

    fun removeData(identity: DataRequestIdentity)
}
