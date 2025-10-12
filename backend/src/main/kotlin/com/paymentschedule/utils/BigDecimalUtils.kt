package com.paymentschedule.utils

import java.math.BigDecimal
import java.math.MathContext
import java.math.RoundingMode

object BigDecimalUtils {
    val MATH_CONTEXT: MathContext = MathContext.DECIMAL128

    fun roundingHalfUpTwoScale(number: BigDecimal): BigDecimal {
        return roundingHalfUp(number, 2)
    }

    fun roundingHalfUpFiveScale(number: BigDecimal): BigDecimal {
        return roundingHalfUp(number, 5)
    }

    fun roundingHalfUp(number: BigDecimal, scale: Int): BigDecimal {
        return number.setScale(scale, RoundingMode.HALF_UP)
    }

    /**
     * Calculate base^exponent for BigDecimal values
     * Handles both negative and positive exponents
     */
    fun bigDecimalPow(base: BigDecimal, exponent: Int, mc: MathContext = MATH_CONTEXT): BigDecimal {
        return if (exponent >= 0) {
            base.pow(exponent, mc)
        } else {
            BigDecimal.ONE.divide(base.pow(-exponent, mc), mc)
        }
    }
}