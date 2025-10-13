package com.paymentschedule.model

import com.paymentschedule.utils.CalculatorUtils
import java.math.BigDecimal
import java.time.LocalDate

/**
 * Configuration for payment schedule calculation
 *
 * Encapsulates all calculated parameters needed for schedule generation.
 * Separates configuration from iteration logic for better maintainability.
 *
 * @property totalPeriods Total number of payment periods
 * @property actualizedRate Internal rate of return (IRR) per period
 * @property annualReferenceRate Annual equivalent rate
 * @property rentAmount Fixed rent amount per period
 * @property purchaseOptionAmount Purchase option value at contract end
 * @property firstPaymentDate Date of first payment
 * @property periodicity Payment frequency in months
 * @property initialDebt Starting debt amount (asset value)
 */
data class ScheduleConfig(
    val totalPeriods: Int,
    val actualizedRate: BigDecimal,
    val annualReferenceRate: BigDecimal,
    val rentAmount: BigDecimal,
    val purchaseOptionAmount: BigDecimal,
    val firstPaymentDate: LocalDate,
    val periodicity: Int,
    val initialDebt: BigDecimal
) {
    companion object {
        /**
         * Create configuration from payment schedule request
         *
         * Performs initial calculations:
         * - Total periods from contract duration and periodicity
         * - Internal rate of return (IRR) using bisection method
         * - Annual reference rate conversion
         *
         * @param request Payment schedule request with input parameters
         * @return Configured ScheduleConfig ready for schedule generation
         */
        fun from(request: PaymentScheduleRequest): ScheduleConfig {
            val totalPeriods = CalculatorUtils.calculateTotalPeriods(
                request.contractDuration,
                request.periodicity
            )

            val actualizedRate = CalculatorUtils.calculateInternalRateOfReturn(
                rentAmount = request.rentAmount,
                purchaseOptionAmount = request.purchaseOptionAmount,
                assetAmount = request.assetAmount,
                totalPeriods = totalPeriods
            )

            val annualReferenceRate = CalculatorUtils.calculateAnnualReferenceRate(
                request.periodicity,
                actualizedRate
            )

            return ScheduleConfig(
                totalPeriods = totalPeriods,
                actualizedRate = actualizedRate,
                annualReferenceRate = annualReferenceRate,
                rentAmount = request.rentAmount,
                purchaseOptionAmount = request.purchaseOptionAmount,
                firstPaymentDate = request.firstPaymentDate,
                periodicity = request.periodicity,
                initialDebt = request.assetAmount
            )
        }
    }
}
