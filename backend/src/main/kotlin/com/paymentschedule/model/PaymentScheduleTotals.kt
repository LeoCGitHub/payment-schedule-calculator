package com.paymentschedule.model

import java.math.BigDecimal

/**
 * Payment schedule totals
 *
 * @property totalAmount
 * @property totalInterestAmount
 * @property totalRepaymentAmount
 * @property totalActualizedCashFlowsAmount
 * @constructor Create empty Payment schedule totals
 */
data class PaymentScheduleTotals(
    val totalAmount: BigDecimal,
    val totalInterestAmount: BigDecimal,
    val totalRepaymentAmount: BigDecimal,
    val totalActualizedCashFlowsAmount: BigDecimal
)