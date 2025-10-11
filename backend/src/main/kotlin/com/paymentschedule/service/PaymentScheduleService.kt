package com.paymentschedule.service

import com.paymentschedule.model.Payment
import com.paymentschedule.model.PaymentScheduleRequest
import com.paymentschedule.model.PaymentScheduleResponse
import com.paymentschedule.utils.CalculatorUtils
import jakarta.enterprise.context.ApplicationScoped
import java.math.BigDecimal
import java.time.format.DateTimeFormatter

@ApplicationScoped
class PaymentScheduleService {

    fun calculateSchedule(request: PaymentScheduleRequest): PaymentScheduleResponse {
        var totalInterest = BigDecimal.ZERO
        var totalPrincipal = BigDecimal.ZERO
        val payments = mutableListOf<Payment>()
        var debtBeginningPeriod = request.assetValue
        val totalPeriods = request.contractDuration.div(request.periodicity)

        val actualizedRate = CalculatorUtils.calculateInternalRateOfReturn(
            request.rentAmount,
            request.purchaseOptionValue,
            request.assetValue,
            totalPeriods
        )

        //TODO LCG attention
        // Calculate annual reference rate from period rate
        // Formula: annualRate ≈ (1 + periodRate)^periodsPerYear - 1
        val periodsPerYear = 12.div(request.periodicity)
        val annualReferenceRate = if (actualizedRate > BigDecimal.ZERO) {
            CalculatorUtils.bigDecimalPow(BigDecimal.ONE.add(actualizedRate), periodsPerYear).subtract(BigDecimal.ONE)
        } else {
            BigDecimal.ZERO
        }

        for (periodIndex in 1..totalPeriods) {
            val discountedCashFlow = CalculatorUtils.calculateDiscountedCashFlows(
                periodIndex,
                actualizedRate,
                request.rentAmount
            )

            val financialInterest = debtBeginningPeriod.multiply(actualizedRate)

            var repayment = request.rentAmount.subtract(financialInterest)

            // New debt per month (generally 0 unless specified)
            val newDebtPerMonth = BigDecimal.ZERO

            // Adjustment for last payment (remaining capital balance)
//            if (i == periodNumber) {
//                repayment = debtBeginningPeriod
//            }

            // Debt end period = Debt beginning + New debt - Repayment
            val debtEndPeriod = debtBeginningPeriod
                .add(newDebtPerMonth)
                .subtract(repayment)

            // Due date calculation based on periodicity
            // Each period advances by 'periodicity' months
            val monthsToAdd = (periodIndex - 1) * request.periodicity
            val paymentDate = request.firstPaymentDate.plusMonths(monthsToAdd.toLong())

            // Accumulate totals
            totalInterest = totalInterest.add(financialInterest)
            totalPrincipal = totalPrincipal.add(repayment)

            payments.add(
                Payment(
                    period = periodIndex,
                    dueDate = paymentDate.format(DateTimeFormatter.ISO_LOCAL_DATE),
                    debtBeginningPeriod = CalculatorUtils.roundingHalfUp(debtBeginningPeriod, 2),
                    newDebtPerMonth = CalculatorUtils.roundingHalfUp(newDebtPerMonth, 2),
                    repayment = CalculatorUtils.roundingHalfUp(repayment, 2),
                    debtEndPeriod = CalculatorUtils.roundingHalfUp(debtEndPeriod, 2),
                    periodRate = CalculatorUtils.roundingHalfUp(actualizedRate, 5),
                    financialInterest = financialInterest,
                    rent = request.rentAmount,
                    annualReferenceRate = CalculatorUtils.roundingHalfUp(annualReferenceRate, 5),
                    discountedCashFlow = discountedCashFlow
                )
            )

            debtBeginningPeriod = debtEndPeriod
        }

        return PaymentScheduleResponse(
            payments = payments,
            totalAmount = CalculatorUtils.roundingHalfUp(totalPrincipal.add(totalInterest), 2),
            totalInterest = CalculatorUtils.roundingHalfUp(totalInterest, 2),
            totalPrincipal = CalculatorUtils.roundingHalfUp(totalPrincipal, 2)
        )
    }
}
