package com.paymentschedule.service

import com.paymentschedule.model.*
import com.paymentschedule.utils.BigDecimalUtils.roundFinancial
import com.paymentschedule.utils.BigDecimalUtils.roundRate
import com.paymentschedule.utils.CalculatorUtils
import jakarta.enterprise.context.ApplicationScoped
import org.jboss.logging.Logger
import java.math.BigDecimal
import java.time.format.DateTimeFormatter

/**
 * Payment schedule calculation service
 *
 * Generates complete payment schedules for financial lease contracts including:
 * - Period-by-period amortization
 * - Interest and principal breakdown
 * - Internal rate of return (IRR)
 * - Actualized cash flows
 * - Purchase option calculations
 */
@ApplicationScoped
class PaymentScheduleService {

    private val log = Logger.getLogger(PaymentScheduleService::class.java)

    /**
     * Calculate complete payment schedule
     *
     * Main entry point for schedule calculation. Orchestrates the entire
     * calculation process from configuration to final response.
     *
     * @param request Validated payment schedule request
     * @return Complete payment schedule with all lines and totals
     */
    fun calculateSchedule(request: PaymentScheduleRequest): PaymentScheduleResponse {
        log.debugf("Starting schedule calculation for %d periods", request.contractDuration / request.periodicity)

        val config = ScheduleConfig.from(request)
        val lines = generateScheduleLines(config)
        val purchaseOption = calculatePurchaseOption(config)
        val totals = calculateTotals(lines, config, purchaseOption)

        log.debugf("Schedule calculation completed: %d lines generated", lines.size)

        return PaymentScheduleResponse(
            paymentScheduleLines = lines,
            paymentScheduleTotals = totals,
            purchaseOptionTotals = purchaseOption
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
        debtBeginning: BigDecimal,
        config: ScheduleConfig
    ): PaymentScheduleLine {
        val actualizedCashFlow = CalculatorUtils.calculateActualizedCashFlows(
            period,
            config.actualizedRate,
            config.rentAmount
        )

        val financialInterest = CalculatorUtils.calculateFinancialInterest(
            debtBeginning,
            config.actualizedRate
        )

        val repayment = CalculatorUtils.calculateRepayment(
            config.rentAmount,
            financialInterest
        )

        val debtEnd = CalculatorUtils.calculateDebtEndPeriod(
            debtBeginning,
            repayment
        )

        val paymentDate = CalculatorUtils.calculatePaymentDate(
            period,
            config.periodicity,
            config.firstPaymentDate
        )

        return PaymentScheduleLine(
            period = period,
            dueDate = paymentDate.format(DateTimeFormatter.ISO_LOCAL_DATE),
            repaymentAmount = repayment.roundFinancial(),
            debtBeginningPeriodAmount = debtBeginning.roundFinancial(),
            debtEndPeriodAmount = debtEnd.roundFinancial(),
            periodRate = config.actualizedRate.roundRate(),
            financialInterestAmount = financialInterest.roundFinancial(),
            rentAmount = config.rentAmount.roundFinancial(),
            annualReferenceRate = config.annualReferenceRate.roundRate(),
            actualizedCashFlowAmount = actualizedCashFlow.roundFinancial()
        )
    }

    private fun calculatePurchaseOption(config: ScheduleConfig): PurchaseOptionTotals {
        val actualizedPurchaseOption = CalculatorUtils.calculateActualizedCashFlows(
            config.totalPeriods,
            config.actualizedRate,
            config.purchaseOptionAmount
        )

        return PurchaseOptionTotals(
            purchaseOptionAmount = config.purchaseOptionAmount,
            actualizedPurchaseOptionAmount = actualizedPurchaseOption.roundFinancial()
        )
    }

    private fun calculateTotals(
        lines: List<PaymentScheduleLine>,
        config: ScheduleConfig,
        purchaseOption: PurchaseOptionTotals
    ): PaymentScheduleTotals {
        val totalInterest = lines.sumOf { it.financialInterestAmount }
        val totalRepayment = lines.sumOf { it.repaymentAmount }
        val totalActualized = lines.sumOf { it.actualizedCashFlowAmount }

        val totalAmount = totalRepayment
            .add(totalInterest)
            .add(config.purchaseOptionAmount)
            .roundFinancial()

        val totalRepaymentWithOption = totalRepayment
            .add(config.purchaseOptionAmount)
            .roundFinancial()

        val totalActualizedWithOption = totalActualized
            .add(purchaseOption.actualizedPurchaseOptionAmount)
            .roundFinancial()

        return PaymentScheduleTotals(
            totalAmount = totalAmount,
            totalInterestAmount = totalInterest.roundFinancial(),
            totalRepaymentAmount = totalRepaymentWithOption,
            totalActualizedCashFlowsAmount = totalActualizedWithOption
        )
    }
}
