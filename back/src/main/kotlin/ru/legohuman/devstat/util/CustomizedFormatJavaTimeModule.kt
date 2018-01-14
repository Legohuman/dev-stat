package ru.legohuman.devstat.util

import com.fasterxml.jackson.databind.module.SimpleModule
import com.fasterxml.jackson.datatype.jsr310.PackageVersion
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer
import com.fasterxml.jackson.datatype.jsr310.deser.LocalTimeDeserializer
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer
import com.fasterxml.jackson.datatype.jsr310.ser.LocalTimeSerializer
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime
import java.time.format.DateTimeFormatter

class CustomizedFormatJavaTimeModule : SimpleModule(PackageVersion.VERSION) {
    init {
        val dateFormatter = DateTimeFormatter.ofPattern(ConversionUtil.datePattern)
        val timeFormatter = DateTimeFormatter.ofPattern(ConversionUtil.timePattern)
        val dateTimeFormatter = DateTimeFormatter.ofPattern(ConversionUtil.dateTimePattern)

        //deserializers:
        addDeserializer(LocalDate::class.java, LocalDateDeserializer(dateFormatter))
        addDeserializer(LocalTime::class.java, LocalTimeDeserializer(timeFormatter))
        addDeserializer(LocalDateTime::class.java, LocalDateTimeDeserializer(dateTimeFormatter))

        //serializers:
        addSerializer(LocalDate::class.java, LocalDateSerializer(dateFormatter))
        addSerializer(LocalTime::class.java, LocalTimeSerializer(timeFormatter))
        addSerializer(LocalDateTime::class.java, LocalDateTimeSerializer(dateTimeFormatter))
    }

    companion object {
        private val serialVersionUID = 1L
    }
}