package com.paymentschedule.utils.financial

import io.quarkus.test.junit.QuarkusTest
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.jupiter.api.Test
import java.math.BigDecimal
import java.math.MathContext

@QuarkusTest
class CalculatorUtilsEdgeCasesTest {

    @Test
    fun `should handle very large asset amounts`() {
        val largeAmount = BigDecimal("10000000")
        val rentAmount = BigDecimal("100000")
        val purchaseOption = BigDecimal("10000")
        val periods = 120

        val irr = CalculatorUtils.calculateInternalRateOfReturn(
            rentAmount, purchaseOption, largeAmount, periods
        )

        assertThat(irr).isNotNull
        assertThat(irr).isGreaterThanOrEqualTo(BigDecimal.ZERO)
    }

    @Test
    fun `should handle very small decimal values`() {
        val assetAmount = BigDecimal("1000")
        val rentAmount = BigDecimal("100")
        val purchaseOption = BigDecimal("10")
        val periods = 10

        val irr = CalculatorUtils.calculateInternalRateOfReturn(
            rentAmount, purchaseOption, assetAmount, periods
        )

        assertThat(irr).isNotNull
    }

    @Test
    fun `should handle zero purchase option correctly`() {
        val assetAmount = BigDecimal("50000")
        val rentAmount = BigDecimal("5000")
        val purchaseOption = BigDecimal.ZERO
        val periods = 10

        val irr = CalculatorUtils.calculateInternalRateOfReturn(
            rentAmount, purchaseOption, assetAmount, periods
        )

        assertThat(irr).isNotNull
    }

    @Test
    fun `should handle single period contract`() {
        val assetAmount = BigDecimal("100000")
        val rentAmount = BigDecimal("100000")
        val purchaseOption = BigDecimal("1000")
        val periods = 1

        val irr = CalculatorUtils.calculateInternalRateOfReturn(
            rentAmount, purchaseOption, assetAmount, periods
        )

        assertThat(irr).isNotNull
    }

    @Test
    fun `should handle very long duration contracts`() {
        val assetAmount = BigDecimal("500000")
        val rentAmount = BigDecimal("2000")
        val purchaseOption = BigDecimal("1000")
        val periods = 300

        val irr = CalculatorUtils.calculateInternalRateOfReturn(
            rentAmount, purchaseOption, assetAmount, periods
        )

        assertThat(irr).isNotNull
        assertThat(irr).isGreaterThanOrEqualTo(BigDecimal.ZERO)
    }

    @Test
    fun `should calculate NPV close to zero with correct IRR`() {
        val assetAmount = BigDecimal("150000")
        val rentAmount = BigDecimal("10000")
        val purchaseOption = BigDecimal("1500")
        val periods = 16

        val irr = CalculatorUtils.calculateInternalRateOfReturn(
            rentAmount, purchaseOption, assetAmount, periods
        )

        val npv = CalculatorUtils.calculateNetPresentValue(
            rentAmount, purchaseOption, assetAmount, periods, irr
        )

        assertThat(npv.abs()).isLessThan(BigDecimal("0.01"))
    }

    @Test
    fun `should handle high purchase option relative to asset`() {
        val assetAmount = BigDecimal("100000")
        val rentAmount = BigDecimal("1000")
        val purchaseOption = BigDecimal("80000")
        val periods = 20

        val irr = CalculatorUtils.calculateInternalRateOfReturn(
            rentAmount, purchaseOption, assetAmount, periods
        )

        assertThat(irr).isNotNull
    }

    @Test
    fun `should calculate present value with zero rate`() {
        val amount = BigDecimal("10000")
        val rate = BigDecimal.ZERO
        val periods = 12

        val pv = CalculatorUtils.calculatePresentValue(amount, rate, periods)

        assertThat(pv).isEqualByComparingTo(amount)
    }

    @Test
    fun `should calculate present value with high rate`() {
        val amount = BigDecimal("10000")
        val rate = BigDecimal("0.50")
        val periods = 12

        val pv = CalculatorUtils.calculatePresentValue(amount, rate, periods)

        assertThat(pv).isLessThan(amount)
        assertThat(pv).isGreaterThan(BigDecimal.ZERO)
    }

    @Test
    fun `should calculate total periods correctly for various durations`() {
        assertThat(CalculatorUtils.calculateTotalPeriods(12, 1)).isEqualTo(12)
        assertThat(CalculatorUtils.calculateTotalPeriods(12, 3)).isEqualTo(4)
        assertThat(CalculatorUtils.calculateTotalPeriods(12, 6)).isEqualTo(2)
        assertThat(CalculatorUtils.calculateTotalPeriods(12, 12)).isEqualTo(1)
        assertThat(CalculatorUtils.calculateTotalPeriods(48, 3)).isEqualTo(16)
        assertThat(CalculatorUtils.calculateTotalPeriods(120, 1)).isEqualTo(120)
    }

    @Test
    fun `should calculate annual reference rate for different periodicities`() {
        val periodRate = BigDecimal("0.01")

        val monthlyAnnual = CalculatorUtils.calculateAnnualReferenceRate(1, periodRate)
        val quarterlyAnnual = CalculatorUtils.calculateAnnualReferenceRate(3, periodRate)
        val semiAnnualAnnual = CalculatorUtils.calculateAnnualReferenceRate(6, periodRate)
        val annualRate = CalculatorUtils.calculateAnnualReferenceRate(12, periodRate)

        assertThat(monthlyAnnual).isGreaterThan(quarterlyAnnual)
        assertThat(quarterlyAnnual).isGreaterThan(semiAnnualAnnual)
        assertThat(semiAnnualAnnual).isGreaterThan(annualRate)
        assertThat(annualRate).isGreaterThan(BigDecimal.ZERO)
    }

    @Test
    fun `should calculate amortization amount correctly`() {
        val rent = BigDecimal("10000")
        val interest = BigDecimal("1500")

        val amortization = CalculatorUtils.calculateAmortizationAmount(rent, interest)

        assertThat(amortization).isEqualByComparingTo(BigDecimal("8500"))
    }

    @Test
    fun `should calculate debt end period correctly`() {
        val debtStart = BigDecimal("100000")
        val amortization = BigDecimal("5000")

        val debtEnd = CalculatorUtils.calculateDebtEndPeriodAmount(debtStart, amortization)

        assertThat(debtEnd).isEqualByComparingTo(BigDecimal("95000"))
    }

    @Test
    fun `should calculate financial interest correctly`() {
        val debt = BigDecimal("100000")
        val rate = BigDecimal("0.01")

        val interest = CalculatorUtils.calculateFinancialInterestAmount(debt, rate)

        assertThat(interest).isEqualByComparingTo(BigDecimal("1000"))
    }

    @Test
    fun `should handle zero debt in interest calculation`() {
        val debt = BigDecimal.ZERO
        val rate = BigDecimal("0.01")

        val interest = CalculatorUtils.calculateFinancialInterestAmount(debt, rate)

        assertThat(interest).isEqualByComparingTo(BigDecimal.ZERO)
    }

    @Test
    fun `should calculate actualized cash flow correctly`() {
        val period = 1
        val rate = BigDecimal("0.01")
        val amount = BigDecimal("10000")

        val actualized = CalculatorUtils.calculateActualizedCashFlow(period, rate, amount)

        assertThat(actualized).isLessThan(amount)
        assertThat(actualized).isGreaterThan(BigDecimal.ZERO)
    }

    @Test
    fun `should handle negative IRR scenario`() {
        val assetAmount = BigDecimal("50000")
        val rentAmount = BigDecimal("1000")
        val purchaseOption = BigDecimal("80000")
        val periods = 12

        val irr = CalculatorUtils.calculateInternalRateOfReturn(
            rentAmount, purchaseOption, assetAmount, periods
        )

        assertThat(irr).isNotNull
    }

    @Test
    fun `should calculate IRR with implicit residual debt method`() {
        val assetAmount = BigDecimal("150000")
        val rentAmount = BigDecimal("10000")
        val purchaseOption = BigDecimal("1500")
        val periods = 16
        val initialRate = BigDecimal("0.01")

        val irr = CalculatorUtils.calculateImplicitRateBasedOnResidualDebt(
            rentAmount, purchaseOption, assetAmount, periods, initialRate
        )

        assertThat(irr).isNotNull
        assertThat(irr).isGreaterThan(BigDecimal("-0.5"))
        assertThat(irr).isLessThan(BigDecimal("1.0"))
    }

    @Test
    fun `should produce consistent results between IRR methods`() {
        val assetAmount = BigDecimal("150000")
        val rentAmount = BigDecimal("10000")
        val purchaseOption = BigDecimal("1500")
        val periods = 16

        val irrNewton = CalculatorUtils.calculateInternalRateOfReturn(
            rentAmount, purchaseOption, assetAmount, periods
        )

        val irrResidual = CalculatorUtils.calculateImplicitRateBasedOnResidualDebt(
            rentAmount, purchaseOption, assetAmount, periods, BigDecimal("0.01")
        )

        val tolerance = BigDecimal("0.01")
        val diff = (irrNewton - irrResidual).abs()

        assertThat(diff).isLessThan(tolerance)
    }

    @Test
    fun `should handle rent equal to monthly asset value`() {
        val assetAmount = BigDecimal("100000")
        val periods = 10
        val rentAmount = assetAmount.divide(BigDecimal(periods), MathContext.DECIMAL128)
        val purchaseOption = BigDecimal("100")

        val irr = CalculatorUtils.calculateInternalRateOfReturn(
            rentAmount, purchaseOption, assetAmount, periods
        )

        assertThat(irr).isNotNull
        assertThat(irr).isGreaterThanOrEqualTo(BigDecimal.ZERO)
    }

    @Test
    fun `should handle very low rent relative to asset`() {
        val assetAmount = BigDecimal("1000000")
        val rentAmount = BigDecimal("100")
        val purchaseOption = BigDecimal("999000")
        val periods = 12

        val irr = CalculatorUtils.calculateInternalRateOfReturn(
            rentAmount, purchaseOption, assetAmount, periods
        )

        assertThat(irr).isNotNull
    }

    @Test
    fun `should calculate linear asset amortization correctly`() {
        val assetAmount = BigDecimal("150000")
        val periods = 16

        val linearAmortization = CalculatorUtils.calculateLinearAssetAmortization(
            assetAmount, periods
        )

        val expectedValue = BigDecimal("9375.00")
        assertThat(linearAmortization).isEqualByComparingTo(expectedValue)
    }

    @Test
    fun `should calculate IFRS16 charge correctly`() {
        val interest = BigDecimal("1000")
        val linearAmortization = BigDecimal("9375")

        val ifrs16Charge = CalculatorUtils.calculateIfrs16Charge(
            interest, linearAmortization
        )

        assertThat(ifrs16Charge).isEqualByComparingTo(BigDecimal("10375"))
    }

    @Test
    fun `should handle precision with decimal amounts`() {
        val assetAmount = BigDecimal("150000.57")
        val rentAmount = BigDecimal("10000.33")
        val purchaseOption = BigDecimal("1500.99")
        val periods = 16

        val irr = CalculatorUtils.calculateInternalRateOfReturn(
            rentAmount, purchaseOption, assetAmount, periods
        )

        assertThat(irr).isNotNull
        assertThat(irr).isGreaterThanOrEqualTo(BigDecimal.ZERO)
    }

    @Test
    fun `should calculate actualized cash flows and sum correctly`() {
        val rents = listOf(
            BigDecimal("10000"),
            BigDecimal("10000"),
            BigDecimal("10000"),
            BigDecimal("1500")
        )

        val config = com.paymentschedule.model.ScheduleConfig(
            totalPeriods = 3,
            rentAmount = BigDecimal("10000"),
            purchaseOptionAmount = BigDecimal("1500"),
            initialDebt = BigDecimal("30000"),
            firstPaymentDate = java.time.LocalDate.now(),
            periodicity = 1,
            actualizedRate = BigDecimal("0.01")
        )

        val actualizedFlows = mutableListOf<BigDecimal>()
        val sum = CalculatorUtils.calculateActualizedCashFlowsAndSum(
            rents, config, actualizedFlows
        )

        assertThat(sum).isGreaterThan(BigDecimal.ZERO)
        assertThat(actualizedFlows).hasSize(4)
        actualizedFlows.forEachIndexed { index, flow ->
            assertThat(flow).isLessThanOrEqualTo(rents[index])
        }
    }
}
