package ru.legohuman.devstat.controller.aop

import org.springframework.format.Formatter
import org.springframework.web.bind.WebDataBinder
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.InitBinder
import ru.legohuman.devstat.controller.BaseController
import ru.legohuman.devstat.util.ConversionUtil
import java.time.LocalDate
import java.util.*


@Suppress("unused")
@ControllerAdvice(basePackageClasses = [BaseController::class])
class LocalDateControllerAdvice {

    @InitBinder
    fun initBinder(binder: WebDataBinder) {
        binder.addCustomFormatter(LocalDateFormatter())
    }
}

class LocalDateFormatter : Formatter<LocalDate> {
    override fun parse(text: String?, locale: Locale?): LocalDate? {
        return if (text == null) null else ConversionUtil.parseDate(text)
    }

    override fun print(`object`: LocalDate?, locale: Locale?): String? {
        return if (`object` == null) null else ConversionUtil.formatLocalDate(`object`)
    }
}