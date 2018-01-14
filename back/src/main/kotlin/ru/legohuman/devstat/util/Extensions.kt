package ru.legohuman.devstat.util

fun <T> MutableList<T>.addIfNotNull(item: T?) {
    if (item != null) {
        this.add(item)
    }
}