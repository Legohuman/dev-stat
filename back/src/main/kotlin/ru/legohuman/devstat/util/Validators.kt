package ru.legohuman.devstat.util

import java.time.LocalDate
import java.util.regex.Pattern

object Validators {
    private val countryCodePattern = Pattern.compile("[A-Z]{3}")!!
    val minDate = LocalDate.of(1900, 1, 1)!!
    val maxDate = LocalDate.of(2099, 12, 31)!!

    fun countryCode(code: String?): String? {
        return if (code == null || !countryCodePattern.matcher(code).matches())
            "Invalid country code $code. Expected value should contain 3 uppercase letters."
        else null
    }

    fun saneDate(date: LocalDate?, fieldName: String): String? {
        if (date != null) {
            if (date.isBefore(minDate)) {
                return "Invalid $fieldName ${ConversionUtil.formatLocalDate(date)}. Value should not be earlier than ${ConversionUtil.formatLocalDate(minDate)}."
            }
            if (date.isAfter(maxDate)) {
                return "Invalid $fieldName ${ConversionUtil.formatLocalDate(date)}. Value should not be later than ${ConversionUtil.formatLocalDate(maxDate)}."
            }
        }
        return null
    }

    fun datesInOrder(startDate: LocalDate?, endDate: LocalDate?, fieldNames: String): String? {
        return if (startDate != null && endDate != null && startDate.isAfter(endDate))
            return "Invalid $fieldNames ${ConversionUtil.formatLocalDate(startDate)}, ${ConversionUtil.formatLocalDate(endDate)}. Start date should not be later than end date."
        else null
    }

    fun notNegative(value: Int, fieldName: String): String? {
        return if (value < 0)
            "Invalid $fieldName $value. Value should not be negative."
        else null
    }

    fun <T> oneOf(value: T?, options: Array<T>, fieldName: String): String? {
        if (!options.contains(value)) {
            return "Invalid $fieldName. Value should be one of options: ${options.joinToString()}."
        }
        return null
    }

    fun valueWithDeviationInRange(value: Int, deviation: Int, minValue: Int, maxValue: Int, fieldName: String): String? {
        if (value - deviation < minValue) {
            return "Invalid $fieldName (value: $value, deviation: $deviation). Value minus deviation should not be less than $minValue."
        }
        if (value + deviation > maxValue) {
            return "Invalid $fieldName (value: $value, deviation: $deviation). Value plus deviation should not be bigger than $maxValue."
        }
        return null
    }

}