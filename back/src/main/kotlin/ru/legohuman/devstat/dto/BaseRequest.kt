package ru.legohuman.devstat.dto

interface BaseRequest {
    fun validate(): List<String>
}