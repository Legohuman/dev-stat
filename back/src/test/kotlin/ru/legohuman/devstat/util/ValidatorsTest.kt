package ru.legohuman.devstat.util

import org.junit.Test
import ru.legohuman.devstat.util.Validators.maxDate
import ru.legohuman.devstat.util.Validators.minDate
import java.time.LocalDate
import kotlin.test.assertEquals
import kotlin.test.assertNull

class ValidatorsTest {

    @Test
    fun testCountryCodeValid() {
        assertNull(Validators.countryCode("ABC"))
    }

    @Test
    fun testCountryCodeInvalidLength() {
        doAssertCountryCodeInvalid("AB")
    }

    @Test
    fun testCountryCodeInvalidCase() {
        doAssertCountryCodeInvalid("abc")
    }

    @Test
    fun testCountryCodeInvalidChars() {
        doAssertCountryCodeInvalid("AB1")
    }

    @Test
    fun testNullCountryCode() {
        doAssertCountryCodeInvalid(null)
    }

    @Test
    fun testSaneDateValid() {
        assertNull(Validators.saneDate(LocalDate.of(2017, 1, 1), "date"))
    }

    @Test
    fun testSaneDateMinValid() {
        assertNull(Validators.saneDate(minDate, "date"))
    }

    @Test
    fun testSaneDateMaxValid() {
        assertNull(Validators.saneDate(maxDate, "date"))
    }

    @Test
    fun testSaneDateInvalidUnderflow() {
        val date = minDate.minusDays(1)
        assertEquals("Invalid date ${ConversionUtil.formatLocalDate(date)}. Value should not be earlier than ${ConversionUtil.formatLocalDate(Validators.minDate)}.", Validators.saneDate(date, "date"))
    }

    @Test
    fun testSaneDateInvalidOverflow() {
        val date = maxDate.plusDays(1)
        assertEquals("Invalid date ${ConversionUtil.formatLocalDate(date)}. Value should not be later than ${ConversionUtil.formatLocalDate(Validators.maxDate)}.", Validators.saneDate(date, "date"))
    }

    @Test
    fun testDatesInOrderValidDefined() {
        assertNull(Validators.datesInOrder(LocalDate.of(2017, 1, 2), LocalDate.of(2017, 1, 3), "dates"))
    }

    @Test
    fun testDatesInOrderValidEqualDates() {
        val date = LocalDate.of(2017, 1, 2)
        assertNull(Validators.datesInOrder(date, date, "dates"))
    }

    @Test
    fun testDatesInOrderValidNullStartDate() {
        val date = LocalDate.of(2017, 1, 2)
        assertNull(Validators.datesInOrder(null, date, "dates"))
    }

    @Test
    fun testDatesInOrderValidNullEndDate() {
        val date = LocalDate.of(2017, 1, 2)
        assertNull(Validators.datesInOrder(date, null, "dates"))
    }

    @Test
    fun testDatesInOrderInvalid() {
        val date1 = LocalDate.of(2017, 1, 2)
        val date2 = LocalDate.of(2017, 1, 3)
        assertEquals("Invalid dates ${ConversionUtil.formatLocalDate(date2)}, ${ConversionUtil.formatLocalDate(date1)}. Start date should not be later than end date.", Validators.datesInOrder(date2, date1, "dates"))
    }

    @Test
    fun testNotNegativeValidPositive() {
        assertNull(Validators.notNegative(1, "number"))
    }

    @Test
    fun testNotNegativeValidZero() {
        assertNull(Validators.notNegative(0, "number"))
    }

    @Test
    fun testNotNegativeInvalid() {
        assertEquals("Invalid number -1. Value should not be negative.", Validators.notNegative(-1, "number"))
    }

    @Test
    fun testOneOfValid() {
        assertNull(Validators.oneOf(1, arrayOf(1, 2, 3), "option") )
    }

    @Test
    fun testOneOfInvalidNullOption() {
        assertEquals("Invalid option. Value should be one of options: 1, 2, 3.", Validators.oneOf(null, arrayOf(1, 2, 3), "option"))
    }

    @Test
    fun testOneOfInvalidNoSuchOption() {
        assertEquals("Invalid option. Value should be one of options: 1, 2, 3.", Validators.oneOf(4, arrayOf(1, 2, 3), "option"))
    }

    @Test
    fun testValueWithDeviationInRangeValid() {
        assertNull(Validators.valueWithDeviationInRange(4, 1, 2, 6, "val"))
    }

    @Test
    fun testValueWithDeviationInRangeValidUpperBound() {
        assertNull(Validators.valueWithDeviationInRange(4, 1, 2, 5, "val"))
    }

    @Test
    fun testValueWithDeviationInRangeValidLowerBound() {
        assertNull(Validators.valueWithDeviationInRange(4, 1, 3, 6, "val"))
    }

    @Test
    fun testValueWithDeviationInRangeInvalidOverflow() {
        assertEquals("Invalid val (value: 4, deviation: 2). Value plus deviation should not be bigger than 5.",
                Validators.valueWithDeviationInRange(4, 2, 2, 5, "val"))
    }

    @Test
    fun testValueWithDeviationInRangeInvalidUnderflow() {
        assertEquals("Invalid val (value: 4, deviation: 2). Value minus deviation should not be less than 3.",
                Validators.valueWithDeviationInRange(4, 2, 3, 6, "val"))
    }

    private fun doAssertCountryCodeInvalid(code: String?) {
        assertEquals("Invalid country code $code. Expected value should contain 3 uppercase letters.", Validators.countryCode(code))
    }
}