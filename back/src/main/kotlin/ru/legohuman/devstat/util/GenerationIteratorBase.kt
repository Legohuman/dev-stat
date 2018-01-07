package ru.legohuman.devstat.util

import ru.legohuman.devstat.domain.FactEntity
import ru.legohuman.devstat.dto.DataRequestIdentity
import ru.legohuman.devstat.dto.ValuesGenerationRequest
import java.time.LocalDate

abstract class GenerationIteratorBase<out T : FactEntity> : Iterator<T> {

    protected fun getValueForDate(request: ValuesGenerationRequest<Int, Int>, identity: DataRequestIdentity, currentDate: LocalDate): Int {
        val y1 = request.endValue
        val y0 = request.startValue
        val x1 = identity.endDate.toEpochDay()
        val x0 = identity.startDate.toEpochDay()
        val x = currentDate.toEpochDay()
        val interpolatedValue = ((y1 - y0) * (x - x0) / (x1 - x0) + y0)
        val maxDeviation = request.deviation
        val deviation = -maxDeviation + Math.random() * 2 * maxDeviation
        return (interpolatedValue + deviation).toInt()
    }


    protected fun getConstantValueGenerateRequest(value: Int): ValuesGenerationRequest<Int, Int> {
        return ValuesGenerationRequest(value, value, 0)
    }
}