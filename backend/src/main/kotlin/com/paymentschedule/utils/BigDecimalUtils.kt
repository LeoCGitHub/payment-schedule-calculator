package com.paymentschedule.utils

import java.math.BigDecimal
import java.math.MathContext

/**
 * BigDecimal utility functions for financial calculations
 *
 * Provides consistent rounding and mathematical operations
 * optimized for financial lease calculations
 */
object BigDecimalUtils {
    /**
     * High-precision math context for intermediate calculations
     * Uses DECIMAL128 (34 decimal digits) to minimize rounding errors
     */
    val MATH_CONTEXT: MathContext = MathContext.DECIMAL128

    /**
     * Calculate power of BigDecimal (supports negative exponents)
     *
     * For positive exponents: base^exponent
     * For negative exponents: 1 / base^(-exponent)
     *
     * @param base The base value
     * @param exponent The exponent (can be negative)
     * @param mc Math context for precision
     * @return base raised to the power of exponent
     */
    fun bigDecimalPow(
        base: BigDecimal,
        exponent: Int,
        mc: MathContext = MATH_CONTEXT
    ): BigDecimal = if (exponent >= 0) {
        base.pow(exponent, mc)
    } else {
        BigDecimal.ONE.divide(base.pow(-exponent, mc), mc)
    }
}