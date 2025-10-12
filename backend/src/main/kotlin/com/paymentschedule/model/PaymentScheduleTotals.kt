package com.paymentschedule.model

import java.math.BigDecimal

data class PaymentScheduleTotals(
    val totalAmount: BigDecimal,
    val totalInterestAmount: BigDecimal,
    val totalRepaymentAmount: BigDecimal,
    val totalActualizedCashFlowsAmount: BigDecimal
)