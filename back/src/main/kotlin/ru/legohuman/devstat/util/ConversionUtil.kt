package ru.legohuman.devstat.util

import java.time.LocalDate
import java.time.format.DateTimeFormatter

object ConversionUtil {
    const val datePattern = "dd.MM.yyyy"
    const val timePattern = "HH:mm"
    const val dateTimePattern = "dd.MM.yyyy-HHmm"
    private val defaultDateFormatter = DateTimeFormatter.ofPattern(datePattern)

    fun parseDate(value: String?): LocalDate? {
        if (value != null && !value.isEmpty()) {
            return LocalDate.parse(value, defaultDateFormatter)
        }
        return null
    }

    fun formatLocalDate(value: LocalDate?): String? {
        return value?.format(defaultDateFormatter)
    }

    fun parseInt(value: String?, defaultValue: Int): Int {
        return value?.toIntOrNull() ?: defaultValue
    }

    fun implicitDoubleToRoundInt(value: Any): Int {
        return Math.round(value as Double).toInt()
    }
}