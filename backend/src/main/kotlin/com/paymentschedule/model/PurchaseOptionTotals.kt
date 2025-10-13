package com.paymentschedule.model

import java.math.BigDecimal

/**
 * Purchase option totals
 *
 * @property purchaseOptionAmount
 * @property actualizedPurchaseOptionAmount
 * @constructor Create empty Purchase option totals
 */
data class PurchaseOptionTotals(
    val purchaseOptionAmount: BigDecimal,
    val actualizedPurchaseOptionAmount: BigDecimal,
)