package ru.legohuman.devstat.util

import ru.legohuman.devstat.dto.ChartPoint

data class DensityEstimationParameters(
        val minX: Double,
        val maxX: Double,
        val pointsCount: Int,
        val bandwidth: Double
)

object KernelDensityEstimator {
    fun calculateDensityPoints(values: Collection<Double>, parameters: DensityEstimationParameters): List<ChartPoint> {
        if (values.isNotEmpty()) {
            val kernelFunction: KernelFunction = EpanechnikovKernelFunction(parameters.bandwidth)
            val xValues = getXValues(parameters)
            return xValues.map { x ->
                ChartPoint(x, values.map { v ->
                    kernelFunction.apply(x - v)
                }.average())
            }
        }
        return listOf()
    }

    private fun getXValues(parameters: DensityEstimationParameters): List<Double> {
        val points: MutableList<Double> = mutableListOf(parameters.minX)
        val step = (parameters.maxX - parameters.minX) / (parameters.pointsCount - 1)
        var curX = parameters.minX
        var curPointsCount = 1
        while (curPointsCount < parameters.pointsCount) {
            curX += step
            points.add(curX)
            curPointsCount++
        }
        return points.toList()
    }
}

interface KernelFunction {
    fun apply(value: Double): Double
}

class EpanechnikovKernelFunction(
        private val bandwidth: Double
) : KernelFunction {

    override fun apply(value: Double): Double {
        val smoothVal = value / bandwidth
        return if (Math.abs(smoothVal) <= 1) 0.75 * (1 - smoothVal * smoothVal) / bandwidth else 0.0
    }
}
