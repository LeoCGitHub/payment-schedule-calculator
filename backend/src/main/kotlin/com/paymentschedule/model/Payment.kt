package com.paymentschedule.model

import java.math.BigDecimal

data class Payment(
    val period: Int,
    val dueDate: String,
    val debtBeginningPeriod: BigDecimal,
    val newDebtPerMonth: BigDecimal,
    val repayment: BigDecimal,
    val debtEndPeriod: BigDecimal,
    val periodRate: BigDecimal,
    val financialInterest: BigDecimal,
    val rent: BigDecimal,
    val annualReferenceRate: BigDecimal,
    val discountedCashFlow: BigDecimal
)