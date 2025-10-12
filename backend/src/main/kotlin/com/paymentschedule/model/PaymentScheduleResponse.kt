package com.paymentschedule.model

data class PaymentScheduleResponse(
    val paymentScheduleLines: List<PaymentScheduleLine>,
    val paymentScheduleTotals: PaymentScheduleTotals,
    val purchaseOptionTotals: PurchaseOptionTotals
)


