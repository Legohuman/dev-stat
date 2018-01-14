/*
 * (C) Copyright ${YEAR} Legohuman (https://github.com/Legohuman).
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package ru.legohuman.devstat.controller.aop

import org.hibernate.exception.ConstraintViolationException
import org.postgresql.util.PSQLException
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.http.converter.HttpMessageNotReadableException
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler
import ru.legohuman.devstat.controller.BaseController
import java.time.format.DateTimeParseException
import javax.servlet.http.HttpServletRequest

@Suppress("unused")
@ControllerAdvice(basePackageClasses = [BaseController::class])
class GlobalExceptionHandler : ResponseEntityExceptionHandler() {

    private val log: Logger = LoggerFactory.getLogger(GlobalExceptionHandler::class.java)

    @ExceptionHandler(Exception::class)
    @ResponseBody
    internal fun handleControllerException(request: HttpServletRequest, ex: Throwable): ResponseEntity<*> {
        val cause = ex.cause
        if (cause is ConstraintViolationException) {
            val sqlException = cause.sqlException as PSQLException
            if (sqlException.sqlState == "23503") {
                return ResponseEntity(listOf("Object can not be removed until other objects reference it."), HttpStatus.CONFLICT)
            }
        }
        if (ex is DateTimeParseException || ex is HttpMessageNotReadableException || ex is NumberFormatException || ex is IllegalArgumentException) {
            return ResponseEntity(listOf("Request can not be parsed: ${ex.message}"), HttpStatus.BAD_REQUEST)
        }

        log.error("Handled unspecified exception in global handler", ex)
        return ResponseEntity("Internal server error: ${ex.message}", HttpStatus.INTERNAL_SERVER_ERROR)
    }
}
