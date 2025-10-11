package com.paymentschedule.resource

import com.paymentschedule.model.PaymentScheduleRequest
import com.paymentschedule.model.PaymentScheduleResponse
import com.paymentschedule.service.PaymentScheduleService
import jakarta.inject.Inject
import jakarta.ws.rs.*
import jakarta.ws.rs.core.MediaType

@Path("/api/payment-schedule")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
class PaymentScheduleResource {

    @Inject
    lateinit var paymentScheduleService: PaymentScheduleService

    @POST
    @Path("/calculate")
    fun calculateSchedule(request: PaymentScheduleRequest): PaymentScheduleResponse {
        return paymentScheduleService.calculateSchedule(request)
    }
}
