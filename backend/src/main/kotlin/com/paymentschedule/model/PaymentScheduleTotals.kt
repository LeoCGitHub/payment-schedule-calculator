package com.paymentschedule.model

import java.math.BigDecimal

/**
 * Payment schedule totals
 *
 * @property totalAmount
 * @property totalInterestAmount
 * @property totalAmortizedAmount
 * @property totalActualizedCashFlowsAmount
 * @constructor Create empty Payment schedule totals
 */
data class PaymentScheduleTotals(
    val totalAmount: BigDecimal,
    val totalInterestAmount: BigDecimal,
    val totalAmortizedAmount: BigDecimal,
    val totalActualizedCashFlowsAmount: BigDecimal,
    val totalLinearAmortizedAmount: BigDecimal = BigDecimal.ZERO,
    val totalIsfsr16Charge: BigDecimal = BigDecimal.ZERO,
)