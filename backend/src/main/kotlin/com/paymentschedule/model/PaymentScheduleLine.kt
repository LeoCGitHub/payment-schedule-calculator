package com.paymentschedule.model

import java.math.BigDecimal

data class PaymentScheduleLine(
    val period: Int,
    val dueDate: String,
    val repaymentAmount: BigDecimal,
    val debtBeginningPeriodAmount: BigDecimal,
    val debtEndPeriodAmount: BigDecimal,
    val periodRate: BigDecimal,
    val financialInterestAmount: BigDecimal,
    val rentAmount: BigDecimal,
    val annualReferenceRate: BigDecimal,
    val actualizedCashFlowAmount: BigDecimal
)