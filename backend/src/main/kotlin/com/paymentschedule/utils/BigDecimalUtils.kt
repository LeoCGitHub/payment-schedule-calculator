package com.paymentschedule.utils

import java.math.BigDecimal
import java.math.MathContext
import java.math.RoundingMode

object BigDecimalUtils {
    val MATH_CONTEXT: MathContext = MathContext.DECIMAL128

    fun BigDecimal.roundingHalfUpFiveScale(scale: Int = 5, roundingMode: RoundingMode = RoundingMode.HALF_UP): BigDecimal {
        return this.setScale(scale, roundingMode)
    }

    fun BigDecimal.roundingHalfUpTwoScale(scale: Int = 2, roundingMode: RoundingMode = RoundingMode.HALF_UP): BigDecimal {
        return this.setScale(scale, roundingMode)
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