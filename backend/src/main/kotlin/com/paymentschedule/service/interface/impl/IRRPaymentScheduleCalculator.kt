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

/**
 * IRR-based payment schedule calculator
 *
 * Calculates payment schedules using the Internal Rate of Return (IRR) method.
 * This is the default calculation method when no marginal debt rate is provided.
 *
 * The IRR is calculated using Newton-Raphson method to find the rate where NPV equals zero.
 * Each period's financial interest is calculated as: debt × IRR
 *
 * If total interest is negative, the ibrNeeded flag is set to true, indicating
 * that Interest-Based Rate calculation should be used instead.
 */
@ApplicationScoped
class IRRPaymentScheduleCalculator : PaymentScheduleCalculator {
    override fun calculateSchedule(config: ScheduleConfig): PaymentScheduleResponse {

        config.actualizedRate = CalculatorUtils.calculateInternalRateOfReturn(
            rentAmount = config.rentAmount,
            purchaseOptionAmount = config.purchaseOptionAmount,
            assetAmount = config.initialDebt,
            totalPeriods = config.totalPeriods
        )

        config.annualReferenceRate = CalculatorUtils.calculateAnnualReferenceRate(
            config.periodicity,
            config.actualizedRate
        )

        val lines = generateScheduleLines(config)
        val purchaseOptionTotals = calculatePurchaseOptionTotals(config)
        val paymentScheduleTotals = calculateTotals(lines, config, purchaseOptionTotals)

        return PaymentScheduleResponse(
            paymentScheduleLines = lines,
            purchaseOptionTotals = purchaseOptionTotals,
            paymentScheduleTotals = paymentScheduleTotals,
            ibrNeeded = paymentScheduleTotals.totalInterestAmount < BigDecimal.ZERO
        )
    }

    private fun generateScheduleLines(config: ScheduleConfig): List<PaymentScheduleLine> {
        var currentDebt = config.initialDebt

        return (1..config.totalPeriods).map { period ->
            val line = createScheduleLine(period, currentDebt, config)
            currentDebt = line.debtEndPeriodAmount
            line
        }
    }

    private fun createScheduleLine(
        period: Int,
        debtBeginningPeriodAmount: BigDecimal,
        config: ScheduleConfig
    ): PaymentScheduleLine {
        val actualizedCashFlowAmount = CalculatorUtils.calculateActualizedCashFlow(
            period,
            config.actualizedRate,
            config.rentAmount
        )

        val financialInterestAmount = CalculatorUtils.calculateFinancialInterestAmount(
            debtBeginningPeriodAmount,
            config.actualizedRate
        )

        val amortizedAmount = CalculatorUtils.calculateAmortizationAmount(
            config.rentAmount,
            financialInterestAmount
        )

        val debtEndPeriodAmount = CalculatorUtils.calculateDebtEndPeriodAmount(
            debtBeginningPeriodAmount,
            amortizedAmount
        )

        val dueDate = CalculatorUtils.calculatePaymentDate(
            period,
            config.periodicity,
            config.firstPaymentDate
        )

        return PaymentScheduleLine(
            period = period,
            dueDate.format(DateTimeFormatter.ISO_LOCAL_DATE),
            amortizedAmount,
            debtBeginningPeriodAmount,
            debtEndPeriodAmount,
            config.actualizedRate,
            financialInterestAmount,
            config.rentAmount,
            config.annualReferenceRate,
            actualizedCashFlowAmount
        )
    }

    private fun calculatePurchaseOptionTotals(config: ScheduleConfig): PurchaseOptionTotals {
        val actualizedPurchaseOption = CalculatorUtils.calculateActualizedCashFlow(
            config.totalPeriods,
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
            totalActualizedCashFlowsAmount = totalActualizedWithOption
        )
    }
}

