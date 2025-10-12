package com.paymentschedule.utils

import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import java.math.BigDecimal

class BigDecimalUtilsTest {

    @Test
    fun testBigDecimalPow() {
        val base = BigDecimal("1.1")

        val resultPositive = BigDecimalUtils.bigDecimalPow(base, 3)
        println("1.1^3 = $resultPositive")

        val resultNegative = BigDecimalUtils.bigDecimalPow(base, -2)
        println("1.1^-2 = $resultNegative")

        assertTrue(resultPositive > BigDecimal.ONE)
        assertTrue(resultNegative < BigDecimal.ONE)
    }
}
