package com.paymentschedule.service.`interface`.impl

import com.paymentschedule.model.PaymentScheduleLine
import com.paymentschedule.model.PaymentScheduleResponse
import com.paymentschedule.model.PaymentScheduleTotals
import com.paymentschedule.model.PurchaseOptionTotals
import com.paymentschedule.model.ScheduleConfig
import com.paymentschedule.service.`interface`.PaymentScheduleCalculator
import com.paymentschedule.utils.financial.CalculatorUtils
import jakarta.enterprise.context.ApplicationScoped
import java.math.BigDecimal
import java.time.format.DateTimeFormatter

@ApplicationScoped
class IBRPaymentScheduleCalculator : PaymentScheduleCalculator {
    override fun calculateSchedule(config: ScheduleConfig): PaymentScheduleResponse {
        val actualizedCashFlows  = mutableListOf<BigDecimal>()
        var rents = List(config.totalPeriods) { config.rentAmount }
            rents = rents.plus(config.purchaseOptionAmount)

        val initialLiability = CalculatorUtils.calculateActualizedCashFLowsAndSum(rents, config, actualizedCashFlows);

        config.linearAmortizationAmount = CalculatorUtils.calculateLinearAssetAmortization(config.initialDebt , config.totalPeriods)

        config.annualReferenceRate = CalculatorUtils.calculateAnnualReferenceRate(
            config.periodicity,
            config.actualizedRate
        )

        val lines = generateScheduleLines(rents, actualizedCashFlows, config, initialLiability)

        val purchaseOptionTotals = calculatePurchaseOptionTotals(config)

        val paymentScheduleTotals = calculateTotals(lines, config, purchaseOptionTotals)

        return PaymentScheduleResponse(
            paymentScheduleLines = lines,
            purchaseOptionTotals = purchaseOptionTotals,
            paymentScheduleTotals = paymentScheduleTotals,
            ibrNeeded = true
        )
    }

    fun generateScheduleLines(
        rents: List<BigDecimal>,
        actualizedCashFlows: List<BigDecimal>,
        config: ScheduleConfig,
        initialLiability: BigDecimal
    ): List<PaymentScheduleLine> {
        var debtBeginningPeriodAmount = initialLiability
        val results = mutableListOf<PaymentScheduleLine>()

        (1..config.totalPeriods).map { period ->
            val line = createScheduleLine(period,rents,  actualizedCashFlows, debtBeginningPeriodAmount, config)
            debtBeginningPeriodAmount = line.debtEndPeriodAmount
            results.add(line)
        }

        if (results.isNotEmpty()) {
            val lastIndex = results.lastIndex
            val lastLine = results[lastIndex]
            results[lastIndex] = lastLine.copy(
                debtEndPeriodAmount = config.purchaseOptionAmount
            )
        }

        return results
    }

    private fun createScheduleLine(
        period: Int,
        rents: List<BigDecimal>,
        actualizedCashFlows: List<BigDecimal>,
        debtBeginningPeriodAmount: BigDecimal,
        config: ScheduleConfig
    ): PaymentScheduleLine {
        val totalCashFlow = rents[period - 1]

        val actualizedCashFlowAmount = actualizedCashFlows[period - 1]

        val financialInterestAmount = CalculatorUtils.calculateFinancialInterestAmount(debtBeginningPeriodAmount, config.actualizedRate)

        val amortizationAmount = CalculatorUtils.calculateAmortizationAmount(config.rentAmount, financialInterestAmount);

        val debtEndPeriodAmount = CalculatorUtils.calculateDebtEndPeriodAmount(debtBeginningPeriodAmount, amortizationAmount);

        val dueDate = CalculatorUtils.calculatePaymentDate(
            period, config.periodicity, config.firstPaymentDate
        ).format(DateTimeFormatter.ISO_LOCAL_DATE)

        val ifrs16Charge = CalculatorUtils.calculateIfrs16Charge(financialInterestAmount, config.linearAmortizationAmount)

        return PaymentScheduleLine(
            period = period,
            dueDate = dueDate,
            amortizedAmount = amortizationAmount,
            debtBeginningPeriodAmount = debtBeginningPeriodAmount,
            debtEndPeriodAmount = debtEndPeriodAmount,
            periodRate = config.actualizedRate,
            financialInterestAmount = financialInterestAmount,
            rentAmount = totalCashFlow,
            annualReferenceRate = config.annualReferenceRate,
            actualizedCashFlowAmount = actualizedCashFlowAmount,
            linearAmortizationAmount = config.linearAmortizationAmount,
            ifrs16Expense = ifrs16Charge
        )
    }

    private fun calculatePurchaseOptionTotals(config: ScheduleConfig): PurchaseOptionTotals {
        val actualizedPurchaseOption = CalculatorUtils.calculateActualizedCashFlow(
            config.totalPeriods + 1,
            config.actualizedRate,
            config.purchaseOptionAmount
        )

        return PurchaseOptionTotals(
            purchaseOptionAmount = config.purchaseOptionAmount,
            actualizedPurchaseOptionAmount = actualizedPurchaseOption
        )
    }

    private fun calculateTotals(
        lines: List<PaymentScheduleLine>,
        config: ScheduleConfig,
        purchaseOption: PurchaseOptionTotals
    ): PaymentScheduleTotals {
        val totalInterest = lines.sumOf { it.financialInterestAmount }
        val totalRepayment = lines.sumOf { it.amortizedAmount }
        val totalActualized = lines.sumOf { it.actualizedCashFlowAmount }
        val totalLinearAmortizedAmount = lines.sumOf { it.linearAmortizationAmount }
        val totalIsfr16Charge = lines.sumOf { it.ifrs16Expense }

        val totalAmount = totalRepayment
            .add(totalInterest)
            .add(config.purchaseOptionAmount)

        val totalRepaymentWithOption = totalRepayment
            .add(config.purchaseOptionAmount)

        val totalActualizedWithOption = totalActualized
            .add(purchaseOption.actualizedPurchaseOptionAmount)

        return PaymentScheduleTotals(
            totalAmount = totalAmount,
            totalInterestAmount = totalInterest,
            totalAmortizedAmount = totalRepaymentWithOption,
            totalActualizedCashFlowsAmount = totalActualizedWithOption,
            totalLinearAmortizedAmount = totalLinearAmortizedAmount,
            totalIsfsr16Charge = totalIsfr16Charge
        )
    }
}
