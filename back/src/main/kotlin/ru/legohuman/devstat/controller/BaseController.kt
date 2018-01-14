package ru.legohuman.devstat.controller

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import ru.legohuman.devstat.dto.BaseRequest

abstract class BaseController {

    fun handleRequestIfValid(request: BaseRequest, successCallback: () -> ResponseEntity<Any>): ResponseEntity<Any> {
        val errors = request.validate()

        return if (errors.isNotEmpty())
            ResponseEntity(errors, HttpStatus.BAD_REQUEST)
        else
            successCallback()
    }
}