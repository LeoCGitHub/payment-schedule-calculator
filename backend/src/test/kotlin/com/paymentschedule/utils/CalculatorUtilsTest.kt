package com.paymentschedule.utils

import com.paymentschedule.utils.financial.CalculatorUtils
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import java.math.BigDecimal

class CalculatorUtilsTest {

    @Test
    fun testFindActualizedRateWithMethod1() {
        val rate = CalculatorUtils.calculateInternalRateOfReturn(
            rentAmount = BigDecimal("10000.0"),
            purchaseOptionAmount = BigDecimal("1500.0"),
            assetAmount = BigDecimal("150000.0"),
            totalPeriods = 16
        )
        println("Method 1 - Discount rate found: $rate")

        val expected = BigDecimal("0.00875")
        val tolerance = BigDecimal("0.00001")
        val diff = (rate - expected).abs()

        assertTrue(diff < tolerance, "Rate should be close to 0.00875, but was $rate")
    }

    @Test
    @Suppress("DEPRECATION")
    fun testFindActualizedRateWithMethod2() {
        val rate = CalculatorUtils.calculateImplicitRateBasedOnResidualDebt(
            rentAmount = BigDecimal("10000.0"),
            purchaseOptionAmount = BigDecimal("1500.0"),
            assetAmount = BigDecimal("150000.0"),
            totalPeriods = 16
        )
        println("Method 2 - Discount rate found: $rate")

        val expected = BigDecimal("0.00875")
        val tolerance = BigDecimal("0.00001")
        val diff = (rate - expected).abs()

        assertTrue(diff < tolerance, "Rate should be close to 0.00875, but was $rate")
    }

    @Test
    @Suppress("DEPRECATION")
    fun testBothMethodsGiveSameResult() {
        val rentAmount = BigDecimal("10000.0")
        val purchaseOptionAmount = BigDecimal("1500.0")
        val assetAmount = BigDecimal("150000.0")
        val periods = 16

        val rate1 = CalculatorUtils.calculateInternalRateOfReturn(
            rentAmount, purchaseOptionAmount, assetAmount, periods
        )

        val rate2 = CalculatorUtils.calculateImplicitRateBasedOnResidualDebt(
            rentAmount, purchaseOptionAmount, assetAmount, periods
        )

        println("Method 1 (discounted cash flows): $rate1")
        println("Method 2 (residual debt)       : $rate2")

        val tolerance = BigDecimal("0.00001")
        val diff = (rate1 - rate2).abs()

        assertTrue(diff < tolerance,
            "Both methods should give the same result. Method 1: $rate1, Method 2: $rate2, Difference: $diff")
    }

    @Test
    fun testCalculatePresentValue() {
        val futureCashFlow = BigDecimal("10000")
        val discountRate = BigDecimal("0.01")
        val periods = 5

        val presentValue = CalculatorUtils.calculatePresentValue(futureCashFlow, discountRate, periods)
        println("Present value of $futureCashFlow in $periods periods at rate $discountRate: $presentValue")

        assertTrue(presentValue < futureCashFlow)
    }

    @Test
    fun testResidualDebtCalculation() {
        val rentAmount = BigDecimal("10000.0")
        val assetAmount = BigDecimal("150000.0")
        val rate = BigDecimal("0.00875")
        val periods = 16

        var debt = assetAmount
        for (t in 1..periods) {
            val interest = debt.multiply(rate)
            val principal = rentAmount.subtract(interest)
            debt = debt.subtract(principal)
        }

        println("Residual debt after $periods periods with rate $rate: $debt")

        val expected = BigDecimal("1500.0")
        val tolerance = BigDecimal("10.0")
        val diff = (debt - expected).abs()

        assertTrue(diff < tolerance,
            "Residual debt should be close to 1500, but was $debt")
    }
}
