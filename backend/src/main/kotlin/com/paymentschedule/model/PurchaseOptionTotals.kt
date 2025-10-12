package com.paymentschedule.model

import java.math.BigDecimal

data class PurchaseOptionTotals(
    val purchaseOptionAmount: BigDecimal,
    val actualizedPurchaseOptionAmount: BigDecimal,
)