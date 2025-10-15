package com.paymentschedule.model

import java.math.BigDecimal

/**
 * Payment schedule line
 *
 * @property period
 * @property dueDate
 * @property amortizedAmount
 * @property debtBeginningPeriodAmount
 * @property debtEndPeriodAmount
 * @property periodRate
 * @property financialInterestAmount
 * @property rentAmount
 * @property annualReferenceRate
 * @property actualizedCashFlowAmount
 * @constructor Create empty Payment schedule line
 */
data class PaymentScheduleLine(
    val period: Int,
    val dueDate: String,
    val amortizedAmount: BigDecimal,
    val debtBeginningPeriodAmount: BigDecimal,
    val debtEndPeriodAmount: BigDecimal,
    val periodRate: BigDecimal,
    val financialInterestAmount: BigDecimal,
    val rentAmount: BigDecimal,
    val annualReferenceRate: BigDecimal,
    val actualizedCashFlowAmount: BigDecimal,
    val linearAmortizationAmount: BigDecimal = BigDecimal.ZERO,
    val ifrs16Expense: BigDecimal = BigDecimal.ZERO
)