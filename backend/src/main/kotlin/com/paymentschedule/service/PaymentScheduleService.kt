package com.paymentschedule.service

import com.paymentschedule.model.PaymentScheduleLine
import com.paymentschedule.model.PaymentScheduleRequest
import com.paymentschedule.model.PaymentScheduleResponse
import com.paymentschedule.model.PaymentScheduleTotals
import com.paymentschedule.model.PurchaseOptionTotals
import com.paymentschedule.utils.BigDecimalUtils.roundingHalfUpFiveScale
import com.paymentschedule.utils.BigDecimalUtils.roundingHalfUpTwoScale
import com.paymentschedule.utils.CalculatorUtils
import jakarta.enterprise.context.ApplicationScoped
import java.math.BigDecimal
import java.time.format.DateTimeFormatter

@ApplicationScoped
class PaymentScheduleService {

    fun calculateSchedule(request: PaymentScheduleRequest): PaymentScheduleResponse {
        var totalInterestAmount = BigDecimal.ZERO
        var totalRepaymentAmount = BigDecimal.ZERO
        var actualizedTotalAmount = BigDecimal.ZERO
        var debtBeginningPeriodAmount = request.assetAmount
        val contractDuration = request.contractDuration
        val periodicity = request.periodicity
        val rentAmount =  request.rentAmount
        val purchaseOptionAmount =  request.purchaseOptionAmount
        val firstPaymentDate =  request.firstPaymentDate
        val paymentScheduleLines = mutableListOf<PaymentScheduleLine>()

        val totalPeriods = CalculatorUtils.calculateTotalPeriods(contractDuration, periodicity)

        val actualizedRate = CalculatorUtils.calculateInternalRateOfReturn(
            rentAmount,
            purchaseOptionAmount,
            debtBeginningPeriodAmount,
            totalPeriods
        )

        val annualReferenceRate = CalculatorUtils.calculateAnnualReferenceRate(periodicity, actualizedRate)

        for (periodIndex in 1..totalPeriods) {
            val actualizedCashFlowAmount = CalculatorUtils.calculateActualizedCashFlows(
                periodIndex,
                actualizedRate,
                rentAmount
            )

            val financialInterestAmount =
                CalculatorUtils.calculateFinancialInterest(debtBeginningPeriodAmount, actualizedRate);

            val repaymentAmount = CalculatorUtils.calculateRepayment(rentAmount, financialInterestAmount);

            val debtEndPeriodAmount =
                CalculatorUtils.calculateDebtEndPeriod(debtBeginningPeriodAmount, repaymentAmount);

            val paymentDate =
                CalculatorUtils.calculatePaymentDate(periodIndex, periodicity, firstPaymentDate);

            paymentScheduleLines.add(
                PaymentScheduleLine(
                    period = periodIndex,
                    dueDate = paymentDate.format(DateTimeFormatter.ISO_LOCAL_DATE),
                    repaymentAmount = repaymentAmount.roundingHalfUpTwoScale(),
                    debtBeginningPeriodAmount = debtBeginningPeriodAmount.roundingHalfUpTwoScale(),
                    debtEndPeriodAmount = debtEndPeriodAmount.roundingHalfUpTwoScale(),
                    periodRate = actualizedRate.roundingHalfUpFiveScale(),
                    financialInterestAmount = financialInterestAmount.roundingHalfUpTwoScale(),
                    rentAmount = request.rentAmount.roundingHalfUpTwoScale(),
                    annualReferenceRate = annualReferenceRate.roundingHalfUpFiveScale(),
                    actualizedCashFlowAmount = actualizedCashFlowAmount.roundingHalfUpTwoScale()
                )
            )

            totalInterestAmount = totalInterestAmount.add(financialInterestAmount)
            totalRepaymentAmount = totalRepaymentAmount.add(repaymentAmount)
            actualizedTotalAmount = actualizedTotalAmount.add(actualizedCashFlowAmount)
            debtBeginningPeriodAmount = debtEndPeriodAmount
        }

        val actualizedPurchaseOptionAmount = CalculatorUtils.calculateActualizedCashFlows(
            totalPeriods,
            actualizedRate,
            purchaseOptionAmount
        )

        val paymentScheduleTotals = createPaymentTotals(
            totalRepaymentAmount,
            totalInterestAmount,
            actualizedTotalAmount,
            purchaseOptionAmount,
            actualizedPurchaseOptionAmount
        );

        val purchaseOptionTotals = PurchaseOptionTotals(
            purchaseOptionAmount,
            actualizedPurchaseOptionAmount.roundingHalfUpTwoScale()
        );

        return PaymentScheduleResponse(
            paymentScheduleLines, paymentScheduleTotals, purchaseOptionTotals,
        )
    }

    fun createPaymentTotals(
        totalRepayment: BigDecimal,
        totalInterest: BigDecimal,
        actualizedTotalAmount: BigDecimal,
        purchaseOptionAmount: BigDecimal,
        actualizedPurchaseOptionAmount: BigDecimal
    ): PaymentScheduleTotals {
        val totalAmount = totalRepayment.add(totalInterest).add(purchaseOptionAmount).roundingHalfUpTwoScale()
        val totalInterestAmount = totalInterest.roundingHalfUpTwoScale()
        val totalRepaymentAmount = totalRepayment.add(purchaseOptionAmount).roundingHalfUpTwoScale()
        val totalActualizedCashFlowsAmount =
            actualizedTotalAmount.add(actualizedPurchaseOptionAmount).roundingHalfUpTwoScale()

        return PaymentScheduleTotals(
            totalAmount,
            totalInterestAmount,
            totalRepaymentAmount,
            totalActualizedCashFlowsAmount,
        );
    }
}
