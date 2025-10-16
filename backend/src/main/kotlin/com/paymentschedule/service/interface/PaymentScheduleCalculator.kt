package com.paymentschedule.service.`interface`

import com.paymentschedule.model.PaymentScheduleResponse
import com.paymentschedule.model.ScheduleConfig

/**
 * Payment schedule calculator strategy interface
 *
 * Defines the contract for calculating payment schedules using different financial methods.
 * Implementations include IRR (Internal Rate of Return) and IBR (Interest-Based Rate) calculators.
 */
fun interface PaymentScheduleCalculator {
    /**
     * Calculates a complete payment schedule based on the provided configuration
     *
     * @param config Schedule configuration containing financial parameters
     * @return Complete payment schedule with all periods, totals, and purchase option details
     */
    fun calculateSchedule(config: ScheduleConfig): PaymentScheduleResponse
}
