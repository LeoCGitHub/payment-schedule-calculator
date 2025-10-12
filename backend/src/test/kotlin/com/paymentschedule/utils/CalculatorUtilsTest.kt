package com.paymentschedule.utils

import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import java.math.BigDecimal

class CalculatorUtilsTest {

    @Test
    fun testFindActualizedRateWithMethod1() {
        val rate = CalculatorUtils.calculateInternalRateOfReturn(
            rentAmount = BigDecimal("10000.0"),
            purchaseOptionAmount = BigDecimal("1500.0"),
            assetValue = BigDecimal("150000.0"),
            contractDuration = 16
        )
        println("Method 1 - Discount rate found: $rate")

        // Verify that the rate is close to 0.00875 (with tolerance)
        val expected = BigDecimal("0.00875")
        val tolerance = BigDecimal("0.00001")
        val diff = (rate - expected).abs()

        assertTrue(diff < tolerance, "Rate should be close to 0.00875, but was $rate")
    }

    @Test
    @Suppress("DEPRECATION")  // Intentional usage for validation
    fun testFindActualizedRateWithMethod2() {
        val rate = CalculatorUtils.calculateImplicitRateBasedOnResidualDebt(
            rentAmount = BigDecimal("10000.0"),
            purchaseOptionAmount = BigDecimal("1500.0"),
            assetValue = BigDecimal("150000.0"),
            period = 16
        )
        println("Method 2 - Discount rate found: $rate")

        // Verify that the rate is close to 0.00875 (with tolerance)
        val expected = BigDecimal("0.00875")
        val tolerance = BigDecimal("0.00001")
        val diff = (rate - expected).abs()

        assertTrue(diff < tolerance, "Rate should be close to 0.00875, but was $rate")
    }

    @Test
    @Suppress("DEPRECATION")  // Intentional usage for cross-validation of methods
    fun testBothMethodsGiveSameResult() {
        val rentAmount = BigDecimal("10000.0")
        val purchaseOptionAmount = BigDecimal("1500.0")
        val assetValue = BigDecimal("150000.0")
        val periods = 16

        // Method 1: Closed-form formula (sum of discounted cash flows)
        val rate1 = CalculatorUtils.calculateInternalRateOfReturn(
            rentAmount, purchaseOptionAmount, assetValue, periods
        )

        // Method 2: Residual debt (deprecated but used for validation)
        val rate2 = CalculatorUtils.calculateImplicitRateBasedOnResidualDebt(
            rentAmount, purchaseOptionAmount, assetValue, periods
        )

        println("Method 1 (discounted cash flows): $rate1")
        println("Method 2 (residual debt)       : $rate2")

        // Both methods must give the same result (within epsilon)
        val tolerance = BigDecimal("0.00001")
        val diff = (rate1 - rate2).abs()

        assertTrue(diff < tolerance,
            "Both methods should give the same result. Method 1: $rate1, Method 2: $rate2, Difference: $diff")
    }

    @Test
    fun testBigDecimalPow() {
        val base = BigDecimal("1.1")

        // Test positive exponent
        val resultPositive = CalculatorUtils.bigDecimalPow(base, 3)
        println("1.1^3 = $resultPositive")

        // Test negative exponent
        val resultNegative = CalculatorUtils.bigDecimalPow(base, -2)
        println("1.1^-2 = $resultNegative")

        assertTrue(resultPositive > BigDecimal.ONE)
        assertTrue(resultNegative < BigDecimal.ONE)
    }

    @Test
    fun testCalculatePresentValue() {
        val futureCashFlow = BigDecimal("10000")
        val discountRate = BigDecimal("0.01")
        val periods = 5

        val presentValue = CalculatorUtils.calculatePresentValue(futureCashFlow, discountRate, periods)
        println("Present value of $futureCashFlow in $periods periods at rate $discountRate: $presentValue")

        // Present value must be lower than future value (with positive discount rate)
        assertTrue(presentValue < futureCashFlow)
    }

    @Test
    fun testResidualDebtCalculation() {
        val rentAmount = BigDecimal("10000.0")
        val assetValue = BigDecimal("150000.0")
        val rate = BigDecimal("0.00875") // Known rate
        val periods = 16

        // Simulate amortization with known rate
        var debt = assetValue
        for (t in 1..periods) {
            val interest = debt.multiply(rate)
            val principal = rentAmount.subtract(interest)
            debt = debt.subtract(principal)
        }

        println("Residual debt after $periods periods with rate $rate: $debt")

        // Final debt should be close to purchase option (1500)
        val expected = BigDecimal("1500.0")
        val tolerance = BigDecimal("10.0")
        val diff = (debt - expected).abs()

        assertTrue(diff < tolerance,
            "Residual debt should be close to 1500, but was $debt")
    }
}
