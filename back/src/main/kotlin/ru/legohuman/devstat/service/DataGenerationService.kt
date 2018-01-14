package ru.legohuman.devstat.service

import ru.legohuman.devstat.dto.DataGenerationRequest
import ru.legohuman.devstat.dto.DataRequestIdentity

interface DataGenerationService<in T : DataGenerationRequest<MT>, MT> {

    fun generateData(generationRequest: T): List<String>

    fun removeData(identity: DataRequestIdentity)
}
