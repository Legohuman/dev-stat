package ru.legohuman.devstat.controller.aop

import org.hibernate.exception.ConstraintViolationException
import org.postgresql.util.PSQLException
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.http.converter.HttpMessageNotReadableException
import org.springframework.validation.BeanPropertyBindingResult
import org.springframework.validation.BindException
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.context.request.WebRequest
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler
import ru.legohuman.devstat.controller.BaseController
import java.time.format.DateTimeParseException

@Suppress("unused")
@ControllerAdvice(basePackageClasses = [BaseController::class])
class GlobalExceptionHandler : ResponseEntityExceptionHandler() {

    private val log: Logger = LoggerFactory.getLogger(GlobalExceptionHandler::class.java)

    override fun handleExceptionInternal(ex: java.lang.Exception, body: Any?, headers: HttpHeaders, status: HttpStatus, request: WebRequest): ResponseEntity<Any> {
        val cause = ex.cause
        if (cause is ConstraintViolationException) {
            val sqlException = cause.sqlException as PSQLException
            if (sqlException.sqlState == "23503") {
                return ResponseEntity(listOf("Object can not be removed until other objects reference it."), HttpStatus.CONFLICT)
            }
        }
        if (ex is BindException) {
            val errorsMessage = (ex.bindingResult as BeanPropertyBindingResult).allErrors
            return ResponseEntity(listOf("Request parameters can not be parsed: $errorsMessage"), HttpStatus.BAD_REQUEST)
        }
        if (ex is DateTimeParseException || ex is HttpMessageNotReadableException || ex is NumberFormatException || ex is IllegalArgumentException) {
            return ResponseEntity(listOf("Request can not be parsed: ${ex.message}"), HttpStatus.BAD_REQUEST)
        }

        log.error("Handled unspecified exception in global handler", ex)
        return ResponseEntity(listOf("Internal server error: ${ex.message}"), HttpStatus.INTERNAL_SERVER_ERROR)
    }
}
