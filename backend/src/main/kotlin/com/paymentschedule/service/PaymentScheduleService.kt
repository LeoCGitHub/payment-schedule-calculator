package com.paymentschedule.service

import com.paymentschedule.model.PaymentScheduleLine
import com.paymentschedule.model.PaymentScheduleRequest
import com.paymentschedule.model.PaymentScheduleResponse
import com.paymentschedule.model.PaymentScheduleTotals
import com.paymentschedule.model.PurchaseOptionTotals
import com.paymentschedule.utils.BigDecimalUtils
import com.paymentschedule.utils.CalculatorUtils
import jakarta.enterprise.context.ApplicationScoped
import java.math.BigDecimal
import java.time.LocalDate
import java.time.format.DateTimeFormatter

@ApplicationScoped
class PaymentScheduleService {

    fun calculateSchedule(request: PaymentScheduleRequest): PaymentScheduleResponse {
        var totalInterestAmount = BigDecimal.ZERO
        var totalRepaymentAmount = BigDecimal.ZERO
        var actualizedTotalAmount = BigDecimal.ZERO
        var debtBeginningPeriodAmount = request.assetValue
        val paymentScheduleLines = mutableListOf<PaymentScheduleLine>()

        val totalPeriods = CalculatorUtils.calculateTotalPeriods(request.contractDuration, request.periodicity)

        val actualizedRate = CalculatorUtils.calculateInternalRateOfReturn(
            request.rentAmount,
            request.purchaseOptionAmount,
            request.assetValue,
            totalPeriods
        )

        val annualReferenceRate = CalculatorUtils.calculateAnnualReferenceRate(request.periodicity, actualizedRate)

        for (periodIndex in 1..totalPeriods) {
            val actualizedCashFlow = CalculatorUtils.calculateActualizedCashFlows(
                periodIndex,
                actualizedRate,
                request.rentAmount
            )

            val financialInterestAmount = CalculatorUtils.calculateFinancialInterest(debtBeginningPeriodAmount, actualizedRate);

            val repaymentAmount = CalculatorUtils.calculateRepayment(request.rentAmount, financialInterestAmount);

            val debtEndPeriodAmount = CalculatorUtils.calculateDebtEndPeriod(debtBeginningPeriodAmount, repaymentAmount);

            paymentScheduleLines.add(
                createPayment(
                    request.periodicity,
                    periodIndex,
                    request.firstPaymentDate,
                    request.rentAmount,
                    repaymentAmount,
                    financialInterestAmount,
                    debtEndPeriodAmount,
                    debtBeginningPeriodAmount,
                    actualizedRate,
                    annualReferenceRate
                )
            )

            totalInterestAmount = totalInterestAmount.add(financialInterestAmount)
            totalRepaymentAmount = totalRepaymentAmount.add(repaymentAmount)
            actualizedTotalAmount = actualizedTotalAmount.add(actualizedCashFlow)
            debtBeginningPeriodAmount = debtEndPeriodAmount
        }

        val actualizedPurchaseOptionAmount =
            CalculatorUtils.calculateActualizedCashFlows(
                totalPeriods,
                actualizedRate,
                request.purchaseOptionAmount
            )

        val paymentTotals =
            createPaymentTotals(totalRepaymentAmount, totalInterestAmount, actualizedTotalAmount, request.purchaseOptionAmount,actualizedPurchaseOptionAmount);
        val purchaseOptions = PurchaseOptionTotals(
            request.purchaseOptionAmount,
            actualizedPurchaseOptionAmount
        );

        return PaymentScheduleResponse(
            paymentScheduleLines, paymentTotals, purchaseOptions,
        )
    }

    fun createPayment(
        periodicity: Int,
        periodIndex: Int,
        firstPaymentDate: LocalDate,
        rentAmount: BigDecimal,
        repaymentAmount: BigDecimal,
        financialInterestAmount: BigDecimal,
        debtEndPeriodAmount: BigDecimal,
        debtBeginningPeriodAmount: BigDecimal,
        actualizedRate: BigDecimal,
        annualReferenceRate: BigDecimal
    ): PaymentScheduleLine {
        val actualizedCashFlowAmount = CalculatorUtils.calculateActualizedCashFlows(
            periodIndex,
            actualizedRate,
            rentAmount
        )

        val paymentDate =
            CalculatorUtils.calculatePaymentDate(periodIndex, periodicity, firstPaymentDate);

        return PaymentScheduleLine(
            period = periodIndex,
            dueDate = paymentDate.format(DateTimeFormatter.ISO_LOCAL_DATE),
            debtBeginningPeriodAmount = BigDecimalUtils.roundingHalfUpTwoScale(debtBeginningPeriodAmount),
            repaymentAmount = BigDecimalUtils.roundingHalfUpTwoScale(repaymentAmount),
            debtEndPeriodAmount = BigDecimalUtils.roundingHalfUpTwoScale(debtEndPeriodAmount),
            periodRate = BigDecimalUtils.roundingHalfUpFiveScale(actualizedRate),
            financialInterestAmount = financialInterestAmount,
            rentAmount = rentAmount,
            annualReferenceRate = BigDecimalUtils.roundingHalfUpFiveScale(annualReferenceRate),
            actualizedCashFlowAmount = actualizedCashFlowAmount
        )
    }

    fun createPaymentTotals(
        totalRepayment: BigDecimal,
        totalInterest: BigDecimal,
        actualizedTotalAmount: BigDecimal,
        purchaseOptionAmount: BigDecimal,
        actualizedPurchaseOptionAmount: BigDecimal
    ): PaymentScheduleTotals {
        val totalAmount = BigDecimalUtils.roundingHalfUpTwoScale(
            totalRepayment.add(totalInterest).add(purchaseOptionAmount)
        )
        val totalInterestAmount = BigDecimalUtils.roundingHalfUpTwoScale(totalInterest)
        val totalRepaymentAmount = BigDecimalUtils.roundingHalfUpTwoScale(totalRepayment.add(purchaseOptionAmount))
        val totalActualizedCashFlowsAmount = BigDecimalUtils.roundingHalfUpTwoScale(
            actualizedTotalAmount.add(actualizedPurchaseOptionAmount)
        )

        return PaymentScheduleTotals(
            totalAmount,
            totalInterestAmount,
            totalRepaymentAmount,
            totalActualizedCashFlowsAmount,
        );
    }
}
