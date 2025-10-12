package com.paymentschedule.model

import com.fasterxml.jackson.annotation.JsonFormat
import java.math.BigDecimal
import java.time.LocalDate

data class PaymentScheduleRequest(
    val periodicity: Int,
    val contractDuration: Int,
    val assetValue: BigDecimal,
    val purchaseOptionAmount: BigDecimal,
    @param:JsonFormat(pattern = "dd/MM/yyyy")
    val firstPaymentDate: LocalDate,
    val rentAmount: BigDecimal
)
