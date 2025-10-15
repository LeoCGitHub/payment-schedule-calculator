package com.paymentschedule.model

import io.quarkus.test.junit.QuarkusTest
import jakarta.inject.Inject
import jakarta.validation.ConstraintViolation
import jakarta.validation.Validator
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import java.math.BigDecimal
import java.time.LocalDate

@QuarkusTest
class PaymentScheduleRequestValidationTest {

    @Inject
    lateinit var validator: Validator

    private fun createValidRequest() = PaymentScheduleRequest(
        periodicity = 3,
        contractDuration = 48,
        assetAmount = BigDecimal("150000"),
        purchaseOptionAmount = BigDecimal("1500"),
        firstPaymentDate = LocalDate.now().plusDays(1),
        rentAmount = BigDecimal("10000"),
        marginalDebtRate = null
    )

    private fun <T> assertViolation(
        violations: Set<ConstraintViolation<T>>,
        propertyPath: String,
        expectedMessage: String
    ) {
        val violation = violations.find { it.propertyPath.toString() == propertyPath }
        assertNotNull(violation, "Expected violation for property: $propertyPath")
        assertTrue(
            violation!!.message.contains(expectedMessage, ignoreCase = true),
            "Expected message to contain '$expectedMessage', but was: ${violation.message}"
        )
    }

    // ========== Periodicity Validation Tests ==========

    @Test
    fun `should pass validation with valid periodicity values`() {
        val validPeriodicities = listOf(1, 3, 6, 12)

        validPeriodicities.forEach { periodicity ->
            val request = createValidRequest().copy(
                periodicity = periodicity,
                contractDuration = periodicity * 4 // Ensure divisibility
            )
            val violations = validator.validate(request)
            assertTrue(
                violations.isEmpty(),
                "Periodicity $periodicity should be valid, but got violations: ${violations.map { it.message }}"
            )
        }
    }

    @Test
    fun `should fail validation when periodicity is zero`() {
        val request = createValidRequest().copy(periodicity = 0)
        val violations = validator.validate(request)

        assertFalse(violations.isEmpty())
        assertViolation(violations, "periodicity", "must be at least 1")
    }

    @Test
    fun `should fail validation when periodicity is negative`() {
        val request = createValidRequest().copy(periodicity = -3)
        val violations = validator.validate(request)

        assertFalse(violations.isEmpty())
        assertViolation(violations, "periodicity", "must be at least 1")
    }

    @Test
    fun `should fail validation when periodicity exceeds maximum`() {
        val request = createValidRequest().copy(periodicity = 24, contractDuration = 48)
        val violations = validator.validate(request)

        assertFalse(violations.isEmpty())
        assertViolation(violations, "periodicity", "must be at most 12")
    }

    @Test
    fun `should throw IllegalArgumentException for invalid periodicity value`() {
        val exception = assertThrows(IllegalArgumentException::class.java) {
            val request = createValidRequest().copy(periodicity = 5, contractDuration = 60)
            request.validateBusinessRules()
        }
        assertTrue(exception.message!!.contains("Periodicity must be 1 (monthly), 3 (quarterly), 6 (semi-annual), or 12 (annual)"))
    }

    // ========== Contract Duration Validation Tests ==========

    @Test
    fun `should pass validation with valid contract durations`() {
        val validDurations = listOf(12, 24, 36, 48, 60)

        validDurations.forEach { duration ->
            val request = createValidRequest().copy(
                periodicity = 3,
                contractDuration = duration
            )
            val violations = validator.validate(request)
            assertTrue(
                violations.isEmpty(),
                "Duration $duration should be valid, but got violations: ${violations.map { it.message }}"
            )
        }
    }

    @Test
    fun `should fail validation when contract duration is zero`() {
        val request = createValidRequest().copy(contractDuration = 0)
        val violations = validator.validate(request)

        assertFalse(violations.isEmpty())
        assertViolation(violations, "contractDuration", "must be at least 1 month")
    }

    @Test
    fun `should fail validation when contract duration is negative`() {
        val request = createValidRequest().copy(contractDuration = -12)
        val violations = validator.validate(request)

        assertFalse(violations.isEmpty())
        assertViolation(violations, "contractDuration", "must be at least 1 month")
    }

    @Test
    fun `should throw IllegalArgumentException when duration not divisible by periodicity`() {
        val exception = assertThrows(IllegalArgumentException::class.java) {
            val request = createValidRequest().copy(periodicity = 3, contractDuration = 47)
            request.validateBusinessRules()
        }
        assertTrue(exception.message!!.contains("Contract duration (47 months) must be divisible by periodicity (3 months)"))
    }

    // ========== Asset Amount Validation Tests ==========

    @Test
    fun `should pass validation with valid asset amounts`() {
        val validAmounts = listOf(
            BigDecimal("0.01"),
            BigDecimal("1000"),
            BigDecimal("150000"),
            BigDecimal("999999.99")
        )

        validAmounts.forEach { amount ->
            val request = createValidRequest().copy(
                assetAmount = amount,
                rentAmount = amount.multiply(BigDecimal("0.05")) // 5% of asset
            )
            val violations = validator.validate(request)
            System.out.println(request.toString())
            assertTrue(
                violations.isEmpty(),
                "Asset amount $amount should be valid, but got violations: ${violations.map { it.message }}"
            )
        }
    }

    @Test
    fun `should fail validation when asset amount is zero`() {
        val request = createValidRequest().copy(assetAmount = BigDecimal.ZERO)
        val violations = validator.validate(request)

        assertFalse(violations.isEmpty())
        assertViolation(violations, "assetAmount", "must be greater than 0")
    }

    @Test
    fun `should fail validation when asset amount is negative`() {
        val request = createValidRequest().copy(assetAmount = BigDecimal("-150000"))
        val violations = validator.validate(request)

        assertFalse(violations.isEmpty())
        assertViolation(violations, "assetAmount", "must be greater than 0")
    }

    @Test
    fun `should fail validation when asset amount is too small`() {
        val request = createValidRequest().copy(assetAmount = BigDecimal("0.001"))
        val violations = validator.validate(request)

        assertFalse(violations.isEmpty())
        assertViolation(violations, "assetAmount", "must be greater than 0")
    }

    // ========== Purchase Option Amount Validation Tests ==========

    @Test
    fun `should pass validation with valid purchase option amounts`() {
        val validAmounts = listOf(
            BigDecimal.ZERO,
            BigDecimal("0.01"),
            BigDecimal("1500"),
            BigDecimal("10000")
        )

        validAmounts.forEach { amount ->
            val request = createValidRequest().copy(purchaseOptionAmount = amount)
            val violations = validator.validate(request)
            assertTrue(
                violations.isEmpty(),
                "Purchase option $amount should be valid, but got violations: ${violations.map { it.message }}"
            )
        }
    }

    @Test
    fun `should fail validation when purchase option is negative`() {
        val request = createValidRequest().copy(purchaseOptionAmount = BigDecimal("-1500"))
        val violations = validator.validate(request)

        assertFalse(violations.isEmpty())
        assertViolation(violations, "purchaseOptionAmount", "Purchase option amount must be greater than or equal to 0")
    }

    @Test
    fun `should throw IllegalArgumentException when purchase option exceeds asset amount`() {
        val exception = assertThrows(IllegalArgumentException::class.java) {
            val request = createValidRequest().copy(
                assetAmount = BigDecimal("100000"),
                purchaseOptionAmount = BigDecimal("150000"),
                rentAmount = BigDecimal("8000")
            )
            request.validateBusinessRules()
        }
        assertTrue(exception.message!!.contains("Purchase option amount"))
        assertTrue(exception.message!!.contains("must not exceed asset amount"))
    }

    // ========== Rent Amount Validation Tests ==========

    @Test
    fun `should pass validation with valid rent amounts`() {
        val validAmounts = listOf(
            BigDecimal("0.01"),
            BigDecimal("1000"),
            BigDecimal("10000"),
            BigDecimal("50000")
        )

        validAmounts.forEach { amount ->
            val request = createValidRequest().copy(
                assetAmount = BigDecimal("150000"),
                rentAmount = amount
            )
            val violations = validator.validate(request)
            assertTrue(
                violations.isEmpty(),
                "Rent amount $amount should be valid, but got violations: ${violations.map { it.message }}"
            )
        }
    }

    @Test
    fun `should fail validation when rent amount is zero`() {
        val request = createValidRequest().copy(rentAmount = BigDecimal.ZERO)
        val violations = validator.validate(request)

        assertFalse(violations.isEmpty())
        assertViolation(violations, "rentAmount", "must be greater than 0")
    }

    @Test
    fun `should fail validation when rent amount is negative`() {
        val request = createValidRequest().copy(rentAmount = BigDecimal("-10000"))
        val violations = validator.validate(request)

        assertFalse(violations.isEmpty())
        assertViolation(violations, "rentAmount", "must be greater than 0")
    }

    @Test
    fun `should throw IllegalArgumentException when rent exceeds asset amount`() {
        val exception = assertThrows(IllegalArgumentException::class.java) {
            val request = createValidRequest().copy(
                assetAmount = BigDecimal("100000"),
                rentAmount = BigDecimal("150000")
            )
            request.validateBusinessRules()
        }
        assertTrue(exception.message!!.contains("Rent amount"))
        assertTrue(exception.message!!.contains("must be less than asset amount"))
    }

    // ========== First Payment Date Validation Tests ==========

    @Test
    fun `should pass validation with today's date`() {
        val request = createValidRequest().copy(firstPaymentDate = LocalDate.now())
        val violations = validator.validate(request)

        assertTrue(violations.isEmpty())
    }

    @Test
    fun `should pass validation with future dates`() {
        val futureDates = listOf(
            LocalDate.now().plusDays(1),
            LocalDate.now().plusMonths(1),
            LocalDate.now().plusYears(1)
        )

        futureDates.forEach { date ->
            val request = createValidRequest().copy(firstPaymentDate = date)
            val violations = validator.validate(request)
            assertTrue(
                violations.isEmpty(),
                "Date $date should be valid, but got violations: ${violations.map { it.message }}"
            )
        }
    }

    // ========== Combined Validation Tests ==========

    @Test
    fun `should fail with multiple validation errors`() {
        val request = PaymentScheduleRequest(
            periodicity = 1,
            contractDuration = 1,
            assetAmount = BigDecimal("-150000"),
            purchaseOptionAmount = BigDecimal("-1500"),
            firstPaymentDate = LocalDate.now().minusYears(1),
            rentAmount = BigDecimal("-10000"),
            marginalDebtRate = null
        )

        val violations = validator.validate(request)

        assertFalse(violations.isEmpty())
        assertTrue(violations.size >= 3, "Expected at least 3 violations, but got ${violations.size}")
    }

    @Test
    fun `should pass validation with minimum valid values`() {
        val request = PaymentScheduleRequest(
            periodicity = 1,
            contractDuration = 1,
            assetAmount = BigDecimal("0.01"),
            purchaseOptionAmount = BigDecimal.ZERO,
            firstPaymentDate = LocalDate.now(),
            rentAmount = BigDecimal("0.01"),
            marginalDebtRate = null
        )

        val violations = validator.validate(request)
        assertTrue(violations.isEmpty())
    }

    @Test
    fun `should validate realistic lease scenario`() {
        val request = PaymentScheduleRequest(
            periodicity = 3,
            contractDuration = 48,
            assetAmount = BigDecimal("250000"),
            purchaseOptionAmount = BigDecimal("2500"),
            firstPaymentDate = LocalDate.of(2025, 9, 17),
            rentAmount = BigDecimal("15000"),
            marginalDebtRate = null
        )

        val violations = validator.validate(request)
        assertTrue(violations.isEmpty(), "Realistic scenario should be valid")
    }

    @Test
    fun `should validate edge case with purchase option equal to 1 percent of asset`() {
        val assetAmount = BigDecimal("100000")
        val request = createValidRequest().copy(
            assetAmount = assetAmount,
            purchaseOptionAmount = assetAmount.multiply(BigDecimal("0.01")), // 1% of asset
            rentAmount = BigDecimal("8000")
        )

        val violations = validator.validate(request)
        assertTrue(violations.isEmpty())
    }

    @Test
    fun `should validate edge case with rent amount just below asset amount`() {
        val assetAmount = BigDecimal("100000")
        val request = createValidRequest().copy(
            assetAmount = assetAmount,
            rentAmount = assetAmount.subtract(BigDecimal("0.01"))
        )

        val violations = validator.validate(request)
        assertTrue(violations.isEmpty())
    }
}
