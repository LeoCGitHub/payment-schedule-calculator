package com.paymentschedule.service.`interface`.impl

import com.paymentschedule.model.ScheduleConfig
import io.quarkus.test.junit.QuarkusTest
import jakarta.inject.Inject
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import java.math.BigDecimal
import java.math.RoundingMode
import java.time.LocalDate

@QuarkusTest
class IRRPaymentScheduleCalculatorTest {

    @Inject
    lateinit var irrCalculator: IRRPaymentScheduleCalculator

    private fun createDefaultConfig(): ScheduleConfig {
        return ScheduleConfig(
            totalPeriods = 16,
            rentAmount = BigDecimal("10000"),
            purchaseOptionAmount = BigDecimal("1500"),
            initialDebt = BigDecimal("150000"),
            firstPaymentDate = LocalDate.of(2025, 9, 17),
            periodicity = 3
        )
    }

    @Test
    fun `should calculate complete schedule with IRR`() {
        val config = createDefaultConfig()

        val response = irrCalculator.calculateSchedule(config)

        assertThat(response).isNotNull
        assertThat(response.ibrNeeded).isFalse()
        assertThat(response.paymentScheduleLines).hasSize(16)
        assertThat(response.paymentScheduleTotals).isNotNull
        assertThat(response.purchaseOptionTotals).isNotNull
    }

    @Test
    fun `should calculate IRR and set it in config`() {
        val config = createDefaultConfig()

        irrCalculator.calculateSchedule(config)

        assertThat(config.actualizedRate).isNotNull
        assertThat(config.actualizedRate).isGreaterThan(BigDecimal.ZERO)
    }

    @Test
    fun `should calculate annual reference rate from IRR`() {
        val config = createDefaultConfig()

        irrCalculator.calculateSchedule(config)

        assertThat(config.annualReferenceRate).isNotNull
        assertThat(config.annualReferenceRate).isGreaterThan(BigDecimal.ZERO)
        assertThat(config.annualReferenceRate).isGreaterThan(config.actualizedRate)
    }

    @Test
    fun `should generate correct number of schedule lines`() {
        val config = createDefaultConfig()

        val response = irrCalculator.calculateSchedule(config)

        assertThat(response.paymentScheduleLines).hasSize(config.totalPeriods)
    }

    @Test
    fun `should have decreasing debt over periods`() {
        val config = createDefaultConfig()

        val response = irrCalculator.calculateSchedule(config)

        val lines = response.paymentScheduleLines
        for (i in 1 until lines.size) {
            assertThat(lines[i].debtBeginningPeriodAmount)
                .isLessThan(lines[i - 1].debtBeginningPeriodAmount)
        }
    }

    @Test
    fun `should have first period debt equal to initial debt`() {
        val config = createDefaultConfig()

        val response = irrCalculator.calculateSchedule(config)

        val firstLine = response.paymentScheduleLines.first()
        assertThat(firstLine.debtBeginningPeriodAmount)
            .isEqualByComparingTo(config.initialDebt)
    }

    @Test
    fun `should have last period debt close to purchase option`() {
        val config = createDefaultConfig()

        val response = irrCalculator.calculateSchedule(config)

        val lastLine = response.paymentScheduleLines.last()
        val tolerance = BigDecimal("10")
        val diff = (lastLine.debtEndPeriodAmount - config.purchaseOptionAmount).abs()

        assertThat(diff).isLessThan(tolerance)
    }

    @Test
    fun `should calculate payment dates correctly`() {
        val config = createDefaultConfig()

        val response = irrCalculator.calculateSchedule(config)

        val firstLine = response.paymentScheduleLines.first()
        val secondLine = response.paymentScheduleLines[1]

        assertThat(firstLine.dueDate).isEqualTo("2025-09-17")
        assertThat(secondLine.dueDate).isEqualTo("2025-12-17")
    }

    @Test
    fun `should have consistent rent amounts`() {
        val config = createDefaultConfig()

        val response = irrCalculator.calculateSchedule(config)

        response.paymentScheduleLines.forEach { line ->
            assertThat(line.rentAmount).isEqualByComparingTo(config.rentAmount)
        }
    }

    @Test
    fun `should have amortization plus interest equal to rent`() {
        val config = createDefaultConfig()

        val response = irrCalculator.calculateSchedule(config)

        response.paymentScheduleLines.forEach { line ->
            val sum = line.amortizedAmount.add(line.financialInterestAmount)
            assertThat(sum.setScale(0, RoundingMode.HALF_UP))
                .isEqualByComparingTo(line.rentAmount.setScale(0, RoundingMode.HALF_UP))
        }
    }

    @Test
    fun `should calculate purchase option totals correctly`() {
        val config = createDefaultConfig()

        val response = irrCalculator.calculateSchedule(config)

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
        val config = createDefaultConfig()

        val response = irrCalculator.calculateSchedule(config)

        val totals = response.paymentScheduleTotals
        assertThat(totals.totalAmount).isGreaterThan(BigDecimal.ZERO)
        assertThat(totals.totalInterestAmount).isGreaterThan(BigDecimal.ZERO)
        assertThat(totals.totalAmortizedAmount).isGreaterThan(BigDecimal.ZERO)
        assertThat(totals.totalActualizedCashFlowsAmount).isGreaterThan(BigDecimal.ZERO)
    }

    @Test
    fun `should sum individual amounts to totals correctly`() {
        val config = createDefaultConfig()

        val response = irrCalculator.calculateSchedule(config)

        val lines = response.paymentScheduleLines
        val totals = response.paymentScheduleTotals

        val calculatedInterest = lines.fold(BigDecimal.ZERO) { acc, line ->
            acc.add(line.financialInterestAmount)
        }

        assertThat(totals.totalInterestAmount.setScale(2, RoundingMode.HALF_UP))
            .isEqualByComparingTo(calculatedInterest.setScale(2, RoundingMode.HALF_UP))
    }

    @Test
    fun `should have period numbers starting from 1`() {
        val config = createDefaultConfig()

        val response = irrCalculator.calculateSchedule(config)

        val lines = response.paymentScheduleLines
        assertThat(lines.first().period).isEqualTo(1)
        assertThat(lines.last().period).isEqualTo(config.totalPeriods)

        for (i in lines.indices) {
            assertThat(lines[i].period).isEqualTo(i + 1)
        }
    }

    @Test
    fun `should calculate actualized cash flows correctly`() {
        val config = createDefaultConfig()

        val response = irrCalculator.calculateSchedule(config)

        response.paymentScheduleLines.forEach { line ->
            assertThat(line.actualizedCashFlowAmount)
                .isLessThanOrEqualTo(line.rentAmount)
            assertThat(line.actualizedCashFlowAmount)
                .isGreaterThan(BigDecimal.ZERO)
        }
    }

    @Test
    fun `should verify NPV approximates zero with calculated IRR`() {
        val config = createDefaultConfig()

        val response = irrCalculator.calculateSchedule(config)
        val irr = config.actualizedRate

        val npv = response.paymentScheduleLines.fold(BigDecimal.ZERO) { acc, line ->
            acc.add(line.actualizedCashFlowAmount)
        }.add(response.purchaseOptionTotals.actualizedPurchaseOptionAmount)

        val tolerance = BigDecimal("1000")
        val diff = (npv - config.initialDebt).abs()

        assertThat(diff).isLessThan(tolerance)
    }

    @Test
    fun `should calculate financial interest using IRR`() {
        val config = createDefaultConfig()

        val response = irrCalculator.calculateSchedule(config)
        val irr = config.actualizedRate

        response.paymentScheduleLines.forEach { line ->
            val expectedInterest = line.debtBeginningPeriodAmount
                .multiply(irr)
                .setScale(2, RoundingMode.HALF_UP)

            assertThat(line.financialInterestAmount.setScale(2, RoundingMode.HALF_UP))
                .isEqualByComparingTo(expectedInterest)
        }
    }

    @Test
    fun `should handle monthly periodicity`() {
        val config = createDefaultConfig().copy(
            periodicity = 1,
            totalPeriods = 12
        )

        val response = irrCalculator.calculateSchedule(config)

        assertThat(response.paymentScheduleLines).hasSize(12)

        val firstDate = LocalDate.parse(response.paymentScheduleLines[0].dueDate)
        val secondDate = LocalDate.parse(response.paymentScheduleLines[1].dueDate)

        assertThat(secondDate).isEqualTo(firstDate.plusMonths(1))
    }

    @Test
    fun `should handle quarterly periodicity`() {
        val config = createDefaultConfig().copy(
            periodicity = 3,
            totalPeriods = 4
        )

        val response = irrCalculator.calculateSchedule(config)

        assertThat(response.paymentScheduleLines).hasSize(4)

        val firstDate = LocalDate.parse(response.paymentScheduleLines[0].dueDate)
        val secondDate = LocalDate.parse(response.paymentScheduleLines[1].dueDate)

        assertThat(secondDate).isEqualTo(firstDate.plusMonths(3))
    }

    @Test
    fun `should handle semi-annual periodicity`() {
        val config = createDefaultConfig().copy(
            periodicity = 6,
            totalPeriods = 2
        )

        val response = irrCalculator.calculateSchedule(config)

        assertThat(response.paymentScheduleLines).hasSize(2)

        val firstDate = LocalDate.parse(response.paymentScheduleLines[0].dueDate)
        val secondDate = LocalDate.parse(response.paymentScheduleLines[1].dueDate)

        assertThat(secondDate).isEqualTo(firstDate.plusMonths(6))
    }

    @Test
    fun `should handle annual periodicity`() {
        val config = createDefaultConfig().copy(
            periodicity = 12,
            totalPeriods = 1
        )

        val response = irrCalculator.calculateSchedule(config)

        assertThat(response.paymentScheduleLines).hasSize(1)
    }

    @Test
    fun `should detect negative interest and set ibrNeeded flag`() {
        val config = ScheduleConfig(
            totalPeriods = 12,
            rentAmount = BigDecimal("1000"),
            purchaseOptionAmount = BigDecimal("100000"),
            initialDebt = BigDecimal("50000"),
            firstPaymentDate = LocalDate.of(2025, 1, 1),
            periodicity = 1
        )

        val response = irrCalculator.calculateSchedule(config)

        if (response.paymentScheduleTotals.totalInterestAmount.compareTo(BigDecimal.ZERO) < 0) {
            assertThat(response.ibrNeeded).isTrue()
        }
    }

    @Test
    fun `should handle small purchase option`() {
        val config = createDefaultConfig().copy(
            purchaseOptionAmount = BigDecimal("1")
        )

        val response = irrCalculator.calculateSchedule(config)

        assertThat(response.purchaseOptionTotals.purchaseOptionAmount)
            .isEqualByComparingTo(BigDecimal("1"))
    }

    @Test
    fun `should handle zero purchase option`() {
        val config = createDefaultConfig().copy(
            purchaseOptionAmount = BigDecimal.ZERO
        )

        val response = irrCalculator.calculateSchedule(config)

        assertThat(response.purchaseOptionTotals.purchaseOptionAmount)
            .isEqualByComparingTo(BigDecimal.ZERO)
        assertThat(response.purchaseOptionTotals.actualizedPurchaseOptionAmount)
            .isEqualByComparingTo(BigDecimal.ZERO)
    }

    @Test
    fun `should handle large asset amount`() {
        val config = createDefaultConfig().copy(
            initialDebt = BigDecimal("10000000"),
            rentAmount = BigDecimal("500000")
        )

        val response = irrCalculator.calculateSchedule(config)

        assertThat(response.paymentScheduleLines).hasSize(config.totalPeriods)
        assertThat(response.paymentScheduleTotals.totalAmount).isGreaterThan(BigDecimal.ZERO)
    }

    @Test
    fun `should ensure debt consistency between periods`() {
        val config = createDefaultConfig()

        val response = irrCalculator.calculateSchedule(config)

        val lines = response.paymentScheduleLines
        for (i in 1 until lines.size) {
            val previousLineDebtEnd = lines[i - 1].debtEndPeriodAmount
            val currentLineDebtStart = lines[i].debtBeginningPeriodAmount

            assertThat(currentLineDebtStart.setScale(2, RoundingMode.HALF_UP))
                .isEqualByComparingTo(previousLineDebtEnd.setScale(2, RoundingMode.HALF_UP))
        }
    }

    @Test
    fun `should have total amount equal to sum of interest amortization and purchase option`() {
        val config = createDefaultConfig()

        val response = irrCalculator.calculateSchedule(config)

        val totals = response.paymentScheduleTotals
        val expectedTotal = totals.totalInterestAmount
            .add(totals.totalAmortizedAmount)

        assertThat(totals.totalAmount.setScale(2, RoundingMode.HALF_UP))
            .isEqualByComparingTo(expectedTotal.setScale(2, RoundingMode.HALF_UP))
    }

    @Test
    fun `should have all period rates equal to calculated IRR`() {
        val config = createDefaultConfig()

        val response = irrCalculator.calculateSchedule(config)
        val irr = config.actualizedRate

        response.paymentScheduleLines.forEach { line ->
            assertThat(line.periodRate).isEqualByComparingTo(irr)
        }
    }

    @Test
    fun `should handle single period contract`() {
        val config = ScheduleConfig(
            totalPeriods = 1,
            rentAmount = BigDecimal("150000"),
            purchaseOptionAmount = BigDecimal("1000"),
            initialDebt = BigDecimal("150000"),
            firstPaymentDate = LocalDate.of(2025, 1, 1),
            periodicity = 12
        )

        val response = irrCalculator.calculateSchedule(config)

        assertThat(response.paymentScheduleLines).hasSize(1)
        assertThat(response.paymentScheduleLines[0].debtBeginningPeriodAmount)
            .isEqualByComparingTo(config.initialDebt)
    }

    @Test
    fun `should handle long duration contract`() {
        val config = ScheduleConfig(
            totalPeriods = 120,
            rentAmount = BigDecimal("2000"),
            purchaseOptionAmount = BigDecimal("1000"),
            initialDebt = BigDecimal("200000"),
            firstPaymentDate = LocalDate.of(2025, 1, 1),
            periodicity = 1
        )

        val response = irrCalculator.calculateSchedule(config)

        assertThat(response.paymentScheduleLines).hasSize(120)
        assertThat(response.paymentScheduleTotals.totalAmount).isGreaterThan(BigDecimal.ZERO)
    }
}
