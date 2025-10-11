package com.paymentschedule.model

import java.math.BigDecimal

data class PaymentScheduleResponse(
    val payments: List<Payment>,
    val totalAmount: BigDecimal,
    val totalInterest: BigDecimal,
    val totalPrincipal: BigDecimal
)


