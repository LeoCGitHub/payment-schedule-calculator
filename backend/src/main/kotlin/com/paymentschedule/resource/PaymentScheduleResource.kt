package com.paymentschedule.resource

import com.paymentschedule.model.PaymentScheduleRequest
import com.paymentschedule.model.PaymentScheduleResponse
import com.paymentschedule.service.PaymentScheduleService
import jakarta.inject.Inject
import jakarta.validation.Valid
import jakarta.ws.rs.*
import jakarta.ws.rs.core.MediaType
import org.eclipse.microprofile.openapi.annotations.Operation
import org.eclipse.microprofile.openapi.annotations.media.Content
import org.eclipse.microprofile.openapi.annotations.media.Schema
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse
import org.eclipse.microprofile.openapi.annotations.responses.APIResponses
import org.eclipse.microprofile.openapi.annotations.tags.Tag
import org.jboss.logging.Logger

/**
 * Payment schedule REST API
 *
 * Provides endpoints for calculating financial lease payment schedules
 * with automatic validation and error handling
 */
@Path("/api/payment-schedule")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Payment Schedule", description = "Calculate lease payment schedules")
class PaymentScheduleResource {

    private val log = Logger.getLogger(PaymentScheduleResource::class.java)

    /**
     * Payment schedule service injected by CDI
     *
     * Handles business logic for calculating payment schedules using IRR or IBR methods
     */
    @Inject
    lateinit var paymentScheduleService: PaymentScheduleService

    /**
     * Calculate payment schedule
     *
     * Calculates a complete payment schedule including:
     * - Period-by-period amortization
     * - Interest and principal breakdown
     * - Internal rate of return (IRR)
     * - Actualized cash flows
     *
     * @param request Payment schedule parameters (validated)
     * @return Complete payment schedule with totals
     */
    @POST
    @Path("/calculate")
    @Operation(
        summary = "Calculate payment schedule",
        description = "Generates a complete payment schedule for a financial lease contract"
    )
    @APIResponses(
        value = [
            APIResponse(
                responseCode = "200",
                description = "Schedule calculated successfully",
                content = [Content(schema = Schema(implementation = PaymentScheduleResponse::class))]
            ),
            APIResponse(
                responseCode = "400",
                description = "Invalid request parameters"
            ),
            APIResponse(
                responseCode = "422",
                description = "Calculation error with provided parameters"
            ),
            APIResponse(
                responseCode = "500",
                description = "Internal server error"
            )
        ]
    )
    fun calculateSchedule(@Valid request: PaymentScheduleRequest): PaymentScheduleResponse {
        log.infof(
            "Calculating schedule: periods=%d, asset=%s, rent=%s",
            request.contractDuration / request.periodicity,
            request.assetAmount,
            request.rentAmount
        )

        request.validateBusinessRules()

        val response = paymentScheduleService.calculateSchedule(request)

        return response
    }
}
