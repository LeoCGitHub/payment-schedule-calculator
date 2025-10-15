package com.paymentschedule.service

import com.paymentschedule.model.*
import com.paymentschedule.service.`interface`.impl.IBRPaymentScheduleCalculator
import com.paymentschedule.service.`interface`.impl.IRRPaymentScheduleCalculator
import jakarta.enterprise.context.ApplicationScoped
import org.jboss.logging.Logger

/**
 * Payment schedule calculation service
 *
 * Generates complete payment schedules for financial lease contracts including:
 * - Period-by-period amortization
 * - Interest and principal breakdown
 * - Internal rate of return (IRR)
 * - Actualized cash flows
 * - Purchase option calculations
 */
@ApplicationScoped
class PaymentScheduleService(
    private val irrCalculator: IRRPaymentScheduleCalculator,
    private val ibrCalculator: IBRPaymentScheduleCalculator
) {
//TODO LCG
    private val log = Logger.getLogger(PaymentScheduleService::class.java)

    /**
     * Calculate complete payment schedule
     *
     * Main entry point for schedule calculation. Orchestrates the entire
     * calculation process from configuration to final response.
     *
     * @param request Validated payment schedule request
     * @return Complete payment schedule with all lines and totals
     */
    fun calculateSchedule(request: PaymentScheduleRequest): PaymentScheduleResponse {
        val config = ScheduleConfig.from(request);

//TODO LCG issues
        val paymentScheduleResponse: PaymentScheduleResponse = if (request.marginalDebtRate == null) {
            irrCalculator.calculateSchedule(config)
        } else {
            config.actualizedRate = request.marginalDebtRate;

            ibrCalculator.calculateSchedule(config)
        }

        return paymentScheduleResponse;
    }
}
