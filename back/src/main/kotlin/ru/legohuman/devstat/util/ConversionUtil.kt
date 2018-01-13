package ru.legohuman.devstat.util

import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.time.format.DateTimeParseException

object ConversionUtil {
    val datePattern = "dd.MM.yyyy"
    val timePattern = "HH:mm"
    val dateTimePattern = "dd.MM.yyyy-HHmm"
    private val defaultDateFormatter = DateTimeFormatter.ofPattern(datePattern)

    fun parseDate(value: String?): LocalDate? {
        try {
            if (value != null && !value.isEmpty()) {
                return LocalDate.parse(value, defaultDateFormatter)
            }
        } catch (e: DateTimeParseException) {
            return null
        }

        return null
    }

    fun parseInt(value: String?, defaultValue: Int): Int {
        return value?.toIntOrNull() ?: defaultValue
    }

    fun implicitDoubleToRoundInt(value: Any): Int {
        return Math.round(value as Double).toInt()
    }
}