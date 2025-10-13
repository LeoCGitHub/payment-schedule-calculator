package com.paymentschedule.utils

import java.math.BigDecimal
import java.math.MathContext
import java.math.RoundingMode

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
     * Standard scale for financial amounts (euros, dollars, etc.)
     * 2 decimal places with HALF_UP rounding (standard for currency)
     */
    const val FINANCIAL_SCALE = 2

    /**
     * Standard scale for rates and percentages
     * 5 decimal places for precision in interest rate calculations
     */
    const val RATE_SCALE = 5

    /**
     * Round to financial scale (2 decimal places)
     *
     * Used for monetary amounts (rent, asset value, etc.)
     * Example: 1234.567 -> 1234.57
     *
     * @return BigDecimal rounded to 2 decimal places
     */
    fun BigDecimal.roundFinancial(): BigDecimal =
        setScale(FINANCIAL_SCALE, RoundingMode.HALF_UP)

    /**
     * Round to rate scale (5 decimal places)
     *
     * Used for interest rates and percentages
     * Example: 0.0087512 -> 0.00875
     *
     * @return BigDecimal rounded to 5 decimal places
     */
    fun BigDecimal.roundRate(): BigDecimal =
        setScale(RATE_SCALE, RoundingMode.HALF_UP)

    /**
     * Generic rounding function
     *
     * @param scale Number of decimal places (default: FINANCIAL_SCALE)
     * @param roundingMode Rounding mode (default: HALF_UP)
     * @return Rounded BigDecimal
     */
    fun BigDecimal.round(
        scale: Int = FINANCIAL_SCALE,
        roundingMode: RoundingMode = RoundingMode.HALF_UP
    ): BigDecimal = setScale(scale, roundingMode)

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