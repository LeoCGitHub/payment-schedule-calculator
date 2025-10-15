package com.paymentschedule.service.`interface`

import com.paymentschedule.model.PaymentScheduleResponse
import com.paymentschedule.model.ScheduleConfig

fun interface PaymentScheduleCalculator {
    fun calculateSchedule(config: ScheduleConfig): PaymentScheduleResponse
}
