package com.paymentschedule.service

import com.paymentschedule.model.PaymentScheduleRequest
import io.quarkus.test.junit.QuarkusTest
import jakarta.inject.Inject
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import java.math.BigDecimal
import java.time.LocalDate

@QuarkusTest
class PaymentScheduleServiceTest {

    @Inject
    lateinit var paymentScheduleService: PaymentScheduleService

    @Test
    fun `should calculate schedule with valid request`() {
        val request = PaymentScheduleRequest(
            periodicity = 3,
            contractDuration = 48,
            assetAmount = BigDecimal("150000"),
            purchaseOptionAmount = BigDecimal("1500"),
            firstPaymentDate = LocalDate.of(2025, 9, 17),
            rentAmount = BigDecimal("10000"),
            marginalDebtRate = null
        )

        val response = paymentScheduleService.calculateSchedule(request)

        assertNotNull(response)
        assertEquals(16, response.paymentScheduleLines.size, "Should have 16 periods (48/3)")
        assertNotNull(response.paymentScheduleTotals)
        assertNotNull(response.purchaseOptionTotals)
    }

    @Test
    fun `should generate correct number of periods`() {
        // Given - Monthly periodicity
        val request = PaymentScheduleRequest(
            periodicity = 1,
            contractDuration = 12,
            assetAmount = BigDecimal("50000"),
            purchaseOptionAmount = BigDecimal("500"),
            firstPaymentDate = LocalDate.of(2025, 1, 1),
            rentAmount = BigDecimal("4500"),
            marginalDebtRate = null
        )

        val response = paymentScheduleService.calculateSchedule(request)

        assertEquals(12, response.paymentScheduleLines.size, "Should have 12 monthly periods")
    }

    @Test
    fun `should calculate correct totals`() {
        val request = PaymentScheduleRequest(
            periodicity = 3,
            contractDuration = 48,
            assetAmount = BigDecimal("150000"),
            purchaseOptionAmount = BigDecimal("1500"),
            firstPaymentDate = LocalDate.of(2025, 9, 17),
            rentAmount = BigDecimal("10000"),
            marginalDebtRate = null
        )

        val response = paymentScheduleService.calculateSchedule(request)

        val totals = response.paymentScheduleTotals
        assertTrue(totals.totalInterestAmount > BigDecimal.ZERO, "Total interest should be positive")
        assertTrue(totals.totalAmortizedAmount > BigDecimal.ZERO, "Total repayment should be positive")
        assertTrue(totals.totalActualizedCashFlowsAmount > BigDecimal.ZERO, "Total actualized amount should be positive")
    }

    @Test
    fun `should have decreasing debt over periods`() {
        val request = PaymentScheduleRequest(
            periodicity = 3,
            contractDuration = 48,
            assetAmount = BigDecimal("150000"),
            purchaseOptionAmount = BigDecimal("1500"),
            firstPaymentDate = LocalDate.of(2025, 9, 17),
            rentAmount = BigDecimal("10000"),
            marginalDebtRate = null
        )

        val response = paymentScheduleService.calculateSchedule(request)

        val lines = response.paymentScheduleLines
        for (i in 1 until lines.size) {
            assertTrue(
                lines[i].debtBeginningPeriodAmount < lines[i - 1].debtBeginningPeriodAmount,
                "Debt should decrease over periods"
            )
        }
    }

    @Test
    fun `should have first period debt equal to asset amount`() {
        val assetAmount = BigDecimal("150000")
        val request = PaymentScheduleRequest(
            periodicity = 3,
            contractDuration = 48,
            assetAmount = assetAmount,
            purchaseOptionAmount = BigDecimal("1500"),
            firstPaymentDate = LocalDate.of(2025, 9, 17),
            rentAmount = BigDecimal("10000"),
            marginalDebtRate = null
        )

        val response = paymentScheduleService.calculateSchedule(request)

        val firstLine = response.paymentScheduleLines.first()
        assertEquals(
            assetAmount,
            firstLine.debtBeginningPeriodAmount,
            "First period debt should equal asset amount"
        )
    }

    @Test
    fun `should have last period debt close to purchase option`() {
        val purchaseOption = BigDecimal("1500")
        val request = PaymentScheduleRequest(
            periodicity = 3,
            contractDuration = 48,
            assetAmount = BigDecimal("150000"),
            purchaseOptionAmount = purchaseOption,
            firstPaymentDate = LocalDate.of(2025, 9, 17),
            rentAmount = BigDecimal("10000"),
            marginalDebtRate = null
        )

        val response = paymentScheduleService.calculateSchedule(request)

        val lastLine = response.paymentScheduleLines.last()
        val tolerance = BigDecimal("10") // 10€ tolerance
        val diff = (lastLine.debtEndPeriodAmount - purchaseOption).abs()
        assertTrue(
            diff < tolerance,
            "Last period debt should be close to purchase option. Difference: $diff"
        )
    }

    @Test
    fun `should calculate increasing payment dates`() {
        val firstDate = LocalDate.of(2025, 9, 17)
        val request = PaymentScheduleRequest(
            periodicity = 3,
            contractDuration = 12,
            assetAmount = BigDecimal("50000"),
            purchaseOptionAmount = BigDecimal("500"),
            firstPaymentDate = firstDate,
            rentAmount = BigDecimal("12000"),
            marginalDebtRate = null
        )

        val response = paymentScheduleService.calculateSchedule(request)

        val lines = response.paymentScheduleLines
        assertEquals(firstDate.toString(), lines[0].dueDate, "First payment date should match")
        assertEquals(firstDate.plusMonths(3).toString(), lines[1].dueDate, "Second payment should be 3 months later")
        assertEquals(firstDate.plusMonths(6).toString(), lines[2].dueDate, "Third payment should be 6 months later")
    }

    @Test
    fun `should have consistent rent amount across periods`() {
        val rentAmount = BigDecimal("10000")
        val request = PaymentScheduleRequest(
            periodicity = 3,
            contractDuration = 48,
            assetAmount = BigDecimal("150000"),
            purchaseOptionAmount = BigDecimal("1500"),
            firstPaymentDate = LocalDate.of(2025, 9, 17),
            rentAmount = rentAmount,
            marginalDebtRate = null
        )

        val response = paymentScheduleService.calculateSchedule(request)

        response.paymentScheduleLines.forEach { line ->
            assertEquals(
                rentAmount,
                line.rentAmount,
                "Rent amount should be consistent across all periods"
            )
        }
    }

    @Test
    fun `should have repayment plus interest equal to rent`() {
        val request = PaymentScheduleRequest(
            periodicity = 3,
            contractDuration = 48,
            assetAmount = BigDecimal("150000"),
            purchaseOptionAmount = BigDecimal("1500"),
            firstPaymentDate = LocalDate.of(2025, 9, 17),
            rentAmount = BigDecimal("10000"),
            marginalDebtRate = null
        )

        val response = paymentScheduleService.calculateSchedule(request)

        response.paymentScheduleLines.forEach { line ->
            val sum = line.amortizedAmount.add(line.financialInterestAmount)
            assertEquals(
                line.rentAmount,
                sum.setScale(0),
                "Repayment + Interest should equal Rent for period ${line.period}"
            )
        }
    }

    @Test
    fun `should calculate positive interest rates`() {
        val request = PaymentScheduleRequest(
            periodicity = 3,
            contractDuration = 48,
            assetAmount = BigDecimal("150000"),
            purchaseOptionAmount = BigDecimal("1500"),
            firstPaymentDate = LocalDate.of(2025, 9, 17),
            rentAmount = BigDecimal("10000"),
            marginalDebtRate = null
        )

        val response = paymentScheduleService.calculateSchedule(request)

        response.paymentScheduleLines.forEach { line ->
            assertTrue(line.periodRate > BigDecimal.ZERO, "Period rate should be positive")
            assertTrue(line.annualReferenceRate > BigDecimal.ZERO, "Annual rate should be positive")
        }
    }

    @Test
    fun `should handle different periodicities correctly`() {
        val baseRequest = PaymentScheduleRequest(
            periodicity = 1,
            contractDuration = 12,
            assetAmount = BigDecimal("50000"),
            purchaseOptionAmount = BigDecimal("500"),
            firstPaymentDate = LocalDate.of(2025, 1, 1),
            rentAmount = BigDecimal("4500"),
            marginalDebtRate = null
        )

        // Test monthly (1)
        val monthlyResponse = paymentScheduleService.calculateSchedule(baseRequest)
        assertEquals(12, monthlyResponse.paymentScheduleLines.size)

        // Test quarterly (3)
        val quarterlyRequest = baseRequest.copy(periodicity = 3, rentAmount = BigDecimal("13500"))
        val quarterlyResponse = paymentScheduleService.calculateSchedule(quarterlyRequest)
        assertEquals(4, quarterlyResponse.paymentScheduleLines.size)

        // Test semi-annual (6)
        val semiAnnualRequest = baseRequest.copy(periodicity = 6, rentAmount = BigDecimal("27000"))
        val semiAnnualResponse = paymentScheduleService.calculateSchedule(semiAnnualRequest)
        assertEquals(2, semiAnnualResponse.paymentScheduleLines.size)

        // Test annual (12)
        val annualRequest = baseRequest.copy(periodicity = 12, rentAmount = BigDecimal("54000"))
        val annualResponse = paymentScheduleService.calculateSchedule(annualRequest)
        assertEquals(1, annualResponse.paymentScheduleLines.size)
    }

    @Test
    fun `should calculate purchase option actualized value`() {
        val purchaseOption = BigDecimal("1500")
        val request = PaymentScheduleRequest(
            periodicity = 3,
            contractDuration = 48,
            assetAmount = BigDecimal("150000"),
            purchaseOptionAmount = purchaseOption,
            firstPaymentDate = LocalDate.of(2025, 9, 17),
            rentAmount = BigDecimal("10000"),
            marginalDebtRate = null
        )

        val response = paymentScheduleService.calculateSchedule(request)

        val purchaseOptionTotals = response.purchaseOptionTotals
        assertEquals(purchaseOption, purchaseOptionTotals.purchaseOptionAmount)
        assertTrue(
            purchaseOptionTotals.actualizedPurchaseOptionAmount < purchaseOption,
            "Actualized purchase option should be less than nominal value due to discounting"
        )
    }
}
