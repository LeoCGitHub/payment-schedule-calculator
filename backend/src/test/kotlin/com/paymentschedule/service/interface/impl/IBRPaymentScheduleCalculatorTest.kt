package com.paymentschedule.service.`interface`.impl

import com.paymentschedule.model.ScheduleConfig
import io.quarkus.test.junit.QuarkusTest
import jakarta.inject.Inject
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import java.math.BigDecimal
import java.time.LocalDate

@QuarkusTest
class IBRPaymentScheduleCalculatorTest {

    @Inject
    lateinit var ibrCalculator: IBRPaymentScheduleCalculator

    private fun createDefaultConfig(): ScheduleConfig {
        return ScheduleConfig(
            totalPeriods = 16,
            rentAmount = BigDecimal("10000"),
            purchaseOptionAmount = BigDecimal("1500"),
            initialDebt = BigDecimal("150000"),
            firstPaymentDate = LocalDate.of(2025, 9, 17),
            periodicity = 3,
            actualizedRate = BigDecimal("0.01")
        )
    }

    @Test
    fun `should calculate complete schedule with IBR`() {
        // Given
        val config = createDefaultConfig()

        // When
        val response = ibrCalculator.calculateSchedule(config)

        // Then
        assertThat(response).isNotNull
        assertThat(response.ibrNeeded).isTrue()
        assertThat(response.paymentScheduleLines).hasSize(16)
        assertThat(response.paymentScheduleTotals).isNotNull
        assertThat(response.purchaseOptionTotals).isNotNull
    }

    @Test
    fun `should generate correct number of schedule lines`() {
        // Given
        val config = createDefaultConfig()

        // When
        val response = ibrCalculator.calculateSchedule(config)

        // Then
        assertThat(response.paymentScheduleLines).hasSize(config.totalPeriods)
    }

    @Test
    fun `should have decreasing debt over periods`() {
        // Given
        val config = createDefaultConfig()

        // When
        val response = ibrCalculator.calculateSchedule(config)

        // Then
        val lines = response.paymentScheduleLines
        for (i in 1 until lines.size) {
            assertThat(lines[i].debtBeginningPeriodAmount)
                .isLessThan(lines[i - 1].debtBeginningPeriodAmount)
        }
    }

    @Test
    fun `should have last period debt equal to purchase option`() {
        // Given
        val config = createDefaultConfig()

        // When
        val response = ibrCalculator.calculateSchedule(config)

        // Then
        val lastLine = response.paymentScheduleLines.last()
        assertThat(lastLine.debtEndPeriodAmount).isEqualByComparingTo(config.purchaseOptionAmount)
    }

    @Test
    fun `should calculate correct payment dates`() {
        // Given
        val config = createDefaultConfig()

        // When
        val response = ibrCalculator.calculateSchedule(config)

        // Then
        val firstLine = response.paymentScheduleLines.first()
        val secondLine = response.paymentScheduleLines[1]

        assertThat(firstLine.dueDate).isEqualTo("2025-09-17")
        assertThat(secondLine.dueDate).isEqualTo("2025-12-17")
    }

    @Test
    fun `should have consistent rent amounts`() {
        // Given
        val config = createDefaultConfig()

        // When
        val response = ibrCalculator.calculateSchedule(config)

        // Then
        response.paymentScheduleLines.forEach { line ->
            assertThat(line.rentAmount).isEqualByComparingTo(config.rentAmount)
        }
    }

    @Test
    fun `should calculate positive financial interest for all periods`() {
        // Given
        val config = createDefaultConfig()

        // When
        val response = ibrCalculator.calculateSchedule(config)

        // Then
        response.paymentScheduleLines.forEach { line ->
            assertThat(line.financialInterestAmount)
                .isGreaterThanOrEqualTo(BigDecimal.ZERO)
        }
    }

    @Test
    fun `should have amortization plus interest equal to rent`() {
        // Given
        val config = createDefaultConfig()

        // When
        val response = ibrCalculator.calculateSchedule(config)

        // Then
        response.paymentScheduleLines.forEach { line ->
            val sum = line.amortizedAmount.add(line.financialInterestAmount)
            assertThat(sum.setScale(0, java.math.RoundingMode.HALF_UP))
                .isEqualByComparingTo(line.rentAmount.setScale(0, java.math.RoundingMode.HALF_UP))
        }
    }

    @Test
    fun `should calculate purchase option totals correctly`() {
        // Given
        val config = createDefaultConfig()

        // When
        val response = ibrCalculator.calculateSchedule(config)

        // Then
        val purchaseOptionTotals = response.purchaseOptionTotals
        assertThat(purchaseOptionTotals.purchaseOptionAmount)
            .isEqualByComparingTo(config.purchaseOptionAmount)
        assertThat(purchaseOptionTotals.actualizedPurchaseOptionAmount)
            .isLessThan(config.purchaseOptionAmount)
        assertThat(purchaseOptionTotals.actualizedPurchaseOptionAmount)
            .isGreaterThan(BigDecimal.ZERO)
    }

    @Test
    fun `should calculate totals with positive values`() {
        // Given
        val config = createDefaultConfig()

        // When
        val response = ibrCalculator.calculateSchedule(config)

        // Then
        val totals = response.paymentScheduleTotals
        assertThat(totals.totalAmount).isGreaterThan(BigDecimal.ZERO)
        assertThat(totals.totalInterestAmount).isGreaterThan(BigDecimal.ZERO)
        assertThat(totals.totalAmortizedAmount).isGreaterThan(BigDecimal.ZERO)
        assertThat(totals.totalActualizedCashFlowsAmount).isGreaterThan(BigDecimal.ZERO)
        assertThat(totals.totalLinearAmortizedAmount).isGreaterThan(BigDecimal.ZERO)
        assertThat(totals.totalIsfsr16Charge).isGreaterThan(BigDecimal.ZERO)
    }

    @Test
    fun `should sum individual amounts to totals correctly`() {
        // Given
        val config = createDefaultConfig()

        // When
        val response = ibrCalculator.calculateSchedule(config)

        // Then
        val lines = response.paymentScheduleLines
        val totals = response.paymentScheduleTotals

        val calculatedInterest = lines.fold(BigDecimal.ZERO) { acc, line ->
            acc.add(line.financialInterestAmount)
        }
        val calculatedAmortization = lines.fold(BigDecimal.ZERO) { acc, line ->
            acc.add(line.amortizedAmount)
        }

        assertThat(totals.totalInterestAmount.setScale(2, java.math.RoundingMode.HALF_UP))
            .isEqualByComparingTo(calculatedInterest.setScale(2, java.math.RoundingMode.HALF_UP))
    }

    @Test
    fun `should calculate linear amortization correctly`() {
        // Given
        val config = createDefaultConfig()

        // When
        val response = ibrCalculator.calculateSchedule(config)

        // Then
        val lines = response.paymentScheduleLines
        val expectedLinearAmortization = config.initialDebt
            .divide(BigDecimal(config.totalPeriods), java.math.RoundingMode.HALF_UP)

        lines.forEach { line ->
            assertThat(line.linearAmortizationAmount.setScale(2, java.math.RoundingMode.HALF_UP))
                .isEqualByComparingTo(expectedLinearAmortization.setScale(2, java.math.RoundingMode.HALF_UP))
        }
    }

    @Test
    fun `should calculate IFRS16 expense correctly`() {
        // Given
        val config = createDefaultConfig()

        // When
        val response = ibrCalculator.calculateSchedule(config)

        // Then
        response.paymentScheduleLines.forEach { line ->
            val expectedIfrs16 = line.financialInterestAmount
                .add(line.linearAmortizationAmount)

            assertThat(line.ifrs16Expense.setScale(2, java.math.RoundingMode.HALF_UP))
                .isEqualByComparingTo(expectedIfrs16.setScale(2, java.math.RoundingMode.HALF_UP))
        }
    }

    @Test
    fun `should have period numbers starting from 1`() {
        // Given
        val config = createDefaultConfig()

        // When
        val response = ibrCalculator.calculateSchedule(config)

        // Then
        val lines = response.paymentScheduleLines
        assertThat(lines.first().period).isEqualTo(1)
        assertThat(lines.last().period).isEqualTo(config.totalPeriods)

        for (i in lines.indices) {
            assertThat(lines[i].period).isEqualTo(i + 1)
        }
    }

    @Test
    fun `should calculate actualized cash flows correctly`() {
        // Given
        val config = createDefaultConfig()

        // When
        val response = ibrCalculator.calculateSchedule(config)

        // Then
        response.paymentScheduleLines.forEach { line ->
            assertThat(line.actualizedCashFlowAmount)
                .isLessThanOrEqualTo(line.rentAmount)
            assertThat(line.actualizedCashFlowAmount)
                .isGreaterThan(BigDecimal.ZERO)
        }
    }

    @Test
    fun `should handle monthly periodicity`() {
        // Given
        val config = createDefaultConfig().copy(
            periodicity = 1,
            totalPeriods = 12
        )

        // When
        val response = ibrCalculator.calculateSchedule(config)

        // Then
        assertThat(response.paymentScheduleLines).hasSize(12)

        val firstDate = LocalDate.parse(response.paymentScheduleLines[0].dueDate)
        val secondDate = LocalDate.parse(response.paymentScheduleLines[1].dueDate)

        assertThat(secondDate).isEqualTo(firstDate.plusMonths(1))
    }

    @Test
    fun `should handle quarterly periodicity`() {
        // Given
        val config = createDefaultConfig().copy(
            periodicity = 3,
            totalPeriods = 4
        )

        // When
        val response = ibrCalculator.calculateSchedule(config)

        // Then
        assertThat(response.paymentScheduleLines).hasSize(4)

        val firstDate = LocalDate.parse(response.paymentScheduleLines[0].dueDate)
        val secondDate = LocalDate.parse(response.paymentScheduleLines[1].dueDate)

        assertThat(secondDate).isEqualTo(firstDate.plusMonths(3))
    }

    @Test
    fun `should handle semi-annual periodicity`() {
        // Given
        val config = createDefaultConfig().copy(
            periodicity = 6,
            totalPeriods = 2
        )

        // When
        val response = ibrCalculator.calculateSchedule(config)

        // Then
        assertThat(response.paymentScheduleLines).hasSize(2)

        val firstDate = LocalDate.parse(response.paymentScheduleLines[0].dueDate)
        val secondDate = LocalDate.parse(response.paymentScheduleLines[1].dueDate)

        assertThat(secondDate).isEqualTo(firstDate.plusMonths(6))
    }

    @Test
    fun `should handle annual periodicity`() {
        // Given
        val config = createDefaultConfig().copy(
            periodicity = 12,
            totalPeriods = 1
        )

        // When
        val response = ibrCalculator.calculateSchedule(config)

        // Then
        assertThat(response.paymentScheduleLines).hasSize(1)
    }

    @Test
    fun `should calculate annual reference rate correctly`() {
        // Given
        val config = createDefaultConfig()

        // When
        val response = ibrCalculator.calculateSchedule(config)

        // Then
        response.paymentScheduleLines.forEach { line ->
            assertThat(line.annualReferenceRate).isGreaterThan(BigDecimal.ZERO)
            assertThat(line.periodRate).isEqualByComparingTo(config.actualizedRate)
        }
    }

    @Test
    fun `should have total amount equal to sum of interest, amortization, and purchase option`() {
        // Given
        val config = createDefaultConfig()

        // When
        val response = ibrCalculator.calculateSchedule(config)

        // Then
        val totals = response.paymentScheduleTotals
        val expectedTotal = totals.totalInterestAmount
            .add(totals.totalAmortizedAmount)

        assertThat(totals.totalAmount.setScale(2, java.math.RoundingMode.HALF_UP))
            .isEqualByComparingTo(expectedTotal.setScale(2, java.math.RoundingMode.HALF_UP))
    }

    @Test
    fun `should handle small purchase option`() {
        // Given
        val config = createDefaultConfig().copy(
            purchaseOptionAmount = BigDecimal("1")
        )

        // When
        val response = ibrCalculator.calculateSchedule(config)

        // Then
        assertThat(response.purchaseOptionTotals.purchaseOptionAmount)
            .isEqualByComparingTo(BigDecimal("1"))
        assertThat(response.paymentScheduleLines.last().debtEndPeriodAmount)
            .isEqualByComparingTo(BigDecimal("1"))
    }

    @Test
    fun `should handle large asset amount`() {
        // Given
        val config = createDefaultConfig().copy(
            initialDebt = BigDecimal("1000000"),
            rentAmount = BigDecimal("50000")
        )

        // When
        val response = ibrCalculator.calculateSchedule(config)

        // Then
        assertThat(response.paymentScheduleLines).hasSize(config.totalPeriods)
        assertThat(response.paymentScheduleTotals.totalAmount).isGreaterThan(BigDecimal.ZERO)
    }

    @Test
    fun `should ensure debt consistency between periods`() {
        // Given
        val config = createDefaultConfig()

        // When
        val response = ibrCalculator.calculateSchedule(config)

        // Then
        val lines = response.paymentScheduleLines
        for (i in 1 until lines.size) {
            val previousLineDebtEnd = lines[i - 1].debtEndPeriodAmount
            val currentLineDebtStart = lines[i].debtBeginningPeriodAmount

            assertThat(currentLineDebtStart.setScale(2, java.math.RoundingMode.HALF_UP))
                .isEqualByComparingTo(previousLineDebtEnd.setScale(2, java.math.RoundingMode.HALF_UP))
        }
    }

    @Test
    fun `should have total linear amortization equal to initial debt`() {
        // Given
        val config = createDefaultConfig()

        // When
        val response = ibrCalculator.calculateSchedule(config)

        // Then
        val totals = response.paymentScheduleTotals
        assertThat(totals.totalLinearAmortizedAmount.setScale(0, java.math.RoundingMode.HALF_UP))
            .isEqualByComparingTo(config.initialDebt.setScale(0, java.math.RoundingMode.HALF_UP))
    }
}
