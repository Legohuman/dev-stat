package ru.legohuman.devstat.dto

interface ChartValuesType

data class ChartBin(
        val x0: Int,
        val x1: Int,
        val height: Long
) : ChartValuesType

data class ChartPoint(
        val x: Double,
        val y: Double
) : ChartValuesType

data class ChartDataSet<out T : ChartValuesType>(
        val values: List<T>,
        val meanValue: Double?
)