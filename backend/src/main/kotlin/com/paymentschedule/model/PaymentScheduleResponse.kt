package com.paymentschedule.model

/**
 * Payment schedule response
 *
 * @property paymentScheduleLines
 * @property paymentScheduleTotals
 * @property purchaseOptionTotals
 * @property ibrNeeded
 * @constructor Create empty Payment schedule response
 */
data class PaymentScheduleResponse(
    val paymentScheduleLines: List<PaymentScheduleLine>,
    val purchaseOptionTotals: PurchaseOptionTotals,
    val paymentScheduleTotals: PaymentScheduleTotals,
    val ibrNeeded: Boolean,
)


