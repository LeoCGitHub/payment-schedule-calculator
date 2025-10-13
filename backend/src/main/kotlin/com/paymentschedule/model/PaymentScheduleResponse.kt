package com.paymentschedule.model

/**
 * Payment schedule response
 *
 * @property paymentScheduleLines
 * @property paymentScheduleTotals
 * @property purchaseOptionTotals
 * @constructor Create empty Payment schedule response
 */
data class PaymentScheduleResponse(
    val paymentScheduleLines: List<PaymentScheduleLine>,
    val paymentScheduleTotals: PaymentScheduleTotals,
    val purchaseOptionTotals: PurchaseOptionTotals
)


