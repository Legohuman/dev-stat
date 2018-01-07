package ru.legohuman.devstat.util

object EnumUtil {
    fun <T : Enum<T>> nullableValueOf(value: String?, options: Array<T>): T? {
        if (value != null) {
            return options.find { it.name == value }
        }
        return null
    }
}