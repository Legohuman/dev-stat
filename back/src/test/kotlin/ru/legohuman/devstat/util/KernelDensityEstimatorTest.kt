package ru.legohuman.devstat.util

import org.junit.Test
import ru.legohuman.devstat.dto.ChartPoint
import kotlin.test.assertEquals

class KernelDensityEstimatorTest {

    private val sampleData = listOf(79.0, 54.0, 74.0, 62.0, 85.0, 55.0, 88.0, 85.0, 51.0, 85.0, 54.0, 84.0, 78.0, 47.0,
            83.0, 52.0, 62.0, 84.0, 52.0, 79.0, 51.0, 47.0, 78.0, 69.0, 74.0, 83.0, 55.0, 76.0, 78.0, 79.0, 73.0, 77.0,
            66.0, 80.0, 74.0, 52.0, 48.0, 80.0, 59.0, 90.0, 80.0, 58.0, 84.0, 58.0, 73.0, 83.0, 64.0, 53.0, 82.0, 59.0,
            75.0, 90.0, 54.0, 80.0, 54.0, 83.0, 71.0, 64.0, 77.0, 81.0, 59.0, 84.0, 48.0, 82.0, 60.0, 92.0, 78.0, 78.0,
            65.0, 73.0, 82.0, 56.0, 79.0, 71.0, 62.0, 76.0, 60.0, 78.0, 76.0, 83.0, 75.0, 82.0, 70.0, 65.0, 73.0, 88.0,
            76.0, 80.0, 48.0, 86.0, 60.0, 90.0, 50.0, 78.0, 63.0, 72.0, 84.0, 75.0, 51.0, 82.0, 62.0, 88.0, 49.0, 83.0,
            81.0, 47.0, 84.0, 52.0, 86.0, 81.0, 75.0, 59.0, 89.0, 79.0, 59.0, 81.0, 50.0, 85.0, 59.0, 87.0, 53.0, 69.0,
            77.0, 56.0, 88.0, 81.0, 45.0, 82.0, 55.0, 90.0, 45.0, 83.0, 56.0, 89.0, 46.0, 82.0, 51.0, 86.0, 53.0, 79.0,
            81.0, 60.0, 82.0, 77.0, 76.0, 59.0, 80.0, 49.0, 96.0, 53.0, 77.0, 77.0, 65.0, 81.0, 71.0, 70.0, 81.0, 93.0,
            53.0, 89.0, 45.0, 86.0, 58.0, 78.0, 66.0, 76.0, 63.0, 88.0, 52.0, 93.0, 49.0, 57.0, 77.0, 68.0, 81.0, 81.0,
            73.0, 50.0, 85.0, 74.0, 55.0, 77.0, 83.0, 83.0, 51.0, 78.0, 84.0, 46.0, 83.0, 55.0, 81.0, 57.0, 76.0, 84.0,
            77.0, 81.0, 87.0, 77.0, 51.0, 78.0, 60.0, 82.0, 91.0, 53.0, 78.0, 46.0, 77.0, 84.0, 49.0, 83.0, 71.0, 80.0,
            49.0, 75.0, 64.0, 76.0, 53.0, 94.0, 55.0, 76.0, 50.0, 82.0, 54.0, 75.0, 78.0, 79.0, 78.0, 78.0, 70.0, 79.0,
            70.0, 54.0, 86.0, 50.0, 90.0, 54.0, 54.0, 77.0, 79.0, 64.0, 75.0, 47.0, 86.0, 63.0, 85.0, 82.0, 57.0, 82.0,
            67.0, 74.0, 54.0, 83.0, 73.0, 73.0, 88.0, 80.0, 71.0, 83.0, 56.0, 79.0, 78.0, 84.0, 58.0, 83.0, 43.0, 60.0,
            75.0, 81.0, 46.0, 90.0, 46.0, 74.0)

    val parameters = DensityEstimationParameters(30.0, 110.0, 9, 7.0)

    @Test
    fun testCalculatePointsSampleData() {
        val points = KernelDensityEstimator.calculateDensityPoints(sampleData, parameters)
        assertPoint(points, 0, 30.0, 0.0)
        assertPoint(points, 1, 40.0, 0.001422890584805351)
        assertPoint(points, 2, 50.0, 0.01851365546218488)
        assertPoint(points, 3, 60.0, 0.014896137026239072)
        assertPoint(points, 4, 70.0, 0.013175806036700398)
        assertPoint(points, 5, 80.0, 0.039149588406791294)
        assertPoint(points, 6, 90.0, 0.011889577259475223)
        assertPoint(points, 7, 100.0, 0.00036979077345223807)
        assertPoint(points, 8, 110.0, 0.0)
        assertEquals(9, points.size)
    }

    @Test
    fun testCalculatePointsEmptyData() {
        val points = KernelDensityEstimator.calculateDensityPoints(listOf(), parameters)
        assertEquals(0, points.size)
    }

    @Test
    fun testCalculatePointsSingleItem() {
        val points = KernelDensityEstimator.calculateDensityPoints(listOf(40.0), parameters)
        assertPoint(points, 0, 30.0, 0.0)
        assertPoint(points, 1, 40.0, 0.10714285714285714)
        assertPoint(points, 2, 50.0, 0.0)
        assertPoint(points, 3, 60.0, 0.0)
        assertPoint(points, 4, 70.0, 0.0)
        assertPoint(points, 5, 80.0, 0.0)
        assertPoint(points, 6, 90.0, 0.0)
        assertPoint(points, 7, 100.0, 0.0)
        assertPoint(points, 8, 110.0, 0.0)
        assertEquals(9, points.size)
    }

    private fun assertPoint(points: List<ChartPoint>, index: Int, x: Double, y: Double) {
        assertEquals(x, points[index].x)
        assertEquals(y, points[index].y)
    }
}