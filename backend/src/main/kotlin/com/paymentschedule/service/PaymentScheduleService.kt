package com.paymentschedule.service

import com.paymentschedule.model.*
import com.paymentschedule.utils.CalculatorUtils
import com.paymentschedule.utils.CalculatorUtils.calculateIBRPassifInitial
import com.paymentschedule.utils.CalculatorUtils.generateScheduleLinesIBR
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
        var lines: List<PaymentScheduleLine>;
        var purchaseOption: PurchaseOptionTotals;
        var totals: PaymentScheduleTotals;

        if (request.marginalDebtRate == null) {
            lines = generateScheduleLines(config)
            purchaseOption = calculatePurchaseOption(config)
            totals = calculateTotals(lines, config, purchaseOption)
        } else {
            var rents = List(config.totalPeriods) { config.rentAmount }
//            rents = rents.plus(config.rentAmount.add(config.purchaseOptionAmount))

            val IBRPassifInitial = calculateIBRPassifInitial(rents, config)
            lines = generateScheduleLinesIBR(rents, config, IBRPassifInitial)
            purchaseOption = calculatePurchaseOption(config)

            totals = calculateTotals(lines, config, purchaseOption)
        }

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
        debtBeginningPeriodAmount: BigDecimal,
        config: ScheduleConfig
    ): PaymentScheduleLine {
        val actualizedCashFlowAmount = CalculatorUtils.calculateActualizedCashFlows(
            period,
            config.actualizedRate,
            config.rentAmount
        )

        val financialInterestAmount = CalculatorUtils.calculateFinancialInterest(
            debtBeginningPeriodAmount,
            config.actualizedRate
        )

        val repaymentAmount = CalculatorUtils.calculateRepayment(
            config.rentAmount,
            financialInterestAmount
        )

        val debtEndPeriodAmount = CalculatorUtils.calculateDebtEndPeriod(
            debtBeginningPeriodAmount,
            repaymentAmount
        )

        val dueDate = CalculatorUtils.calculatePaymentDate(
            period,
            config.periodicity,
            config.firstPaymentDate
        )

        return PaymentScheduleLine(
            period = period,
            dueDate.format(DateTimeFormatter.ISO_LOCAL_DATE),
            repaymentAmount,
            debtBeginningPeriodAmount,
            debtEndPeriodAmount,
            config.actualizedRate,
            financialInterestAmount,
            config.rentAmount,
            config.annualReferenceRate,
            actualizedCashFlowAmount
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
            actualizedPurchaseOptionAmount = actualizedPurchaseOption
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

        val totalRepaymentWithOption = totalRepayment
            .add(config.purchaseOptionAmount)

        val totalActualizedWithOption = totalActualized
            .add(purchaseOption.actualizedPurchaseOptionAmount)

        return PaymentScheduleTotals(
            totalAmount = totalAmount,
            totalInterestAmount = totalInterest,
            totalRepaymentAmount = totalRepaymentWithOption,
            totalActualizedCashFlowsAmount = totalActualizedWithOption
        )
    }
}
