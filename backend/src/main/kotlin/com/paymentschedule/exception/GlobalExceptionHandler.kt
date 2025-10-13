package com.paymentschedule.exception

import com.paymentschedule.model.ErrorResponse
import jakarta.validation.ConstraintViolationException
import jakarta.ws.rs.core.Response
import jakarta.ws.rs.ext.ExceptionMapper
import jakarta.ws.rs.ext.Provider
import org.jboss.logging.Logger

/**
 * Global exception handler for validation errors
 *
 * Maps constraint violation exceptions to proper HTTP 400 responses
 * with detailed validation error messages
 */
@Provider
class ConstraintViolationExceptionMapper : ExceptionMapper<ConstraintViolationException> {

    private val log = Logger.getLogger(ConstraintViolationExceptionMapper::class.java)

    override fun toResponse(exception: ConstraintViolationException): Response {
        log.warn("Validation error: ${exception.message}")

        val violations = exception.constraintViolations.associate { violation ->
            val propertyPath = violation.propertyPath.toString()
            val fieldName = propertyPath.substringAfterLast('.')
            fieldName to violation.message
        }

        val errorResponse = ErrorResponse(
            error = "Validation Error",
            message = "Invalid request parameters",
            details = violations
        )

        return Response.status(Response.Status.BAD_REQUEST)
            .entity(errorResponse)
            .build()
    }
}

/**
 * Global exception handler for illegal argument exceptions
 *
 * Maps business rule violations to proper HTTP 400 responses
 */
@Provider
class IllegalArgumentExceptionMapper : ExceptionMapper<IllegalArgumentException> {

    private val log = Logger.getLogger(IllegalArgumentExceptionMapper::class.java)

    override fun toResponse(exception: IllegalArgumentException): Response {
        log.warn("Business rule violation: ${exception.message}")

        val errorResponse = ErrorResponse(
            error = "Business Rule Violation",
            message = exception.message ?: "Invalid request parameters"
        )

        return Response.status(Response.Status.BAD_REQUEST)
            .entity(errorResponse)
            .build()
    }
}

/**
 * Global exception handler for arithmetic exceptions
 *
 * Maps calculation errors to proper HTTP 422 responses
 */
@Provider
class ArithmeticExceptionMapper : ExceptionMapper<ArithmeticException> {

    private val log = Logger.getLogger(ArithmeticExceptionMapper::class.java)

    override fun toResponse(exception: ArithmeticException): Response {
        log.error("Calculation error: ${exception.message}", exception)

        val errorResponse = ErrorResponse(
            error = "Calculation Error",
            message = "Unable to calculate payment schedule with provided parameters"
        )

        return Response.status(422)
            .entity(errorResponse)
            .build()
    }
}

/**
 * Global exception handler for all other exceptions
 *
 * Maps unexpected errors to proper HTTP 500 responses
 * Avoids exposing internal error details to clients
 */
@Provider
class GeneralExceptionMapper : ExceptionMapper<Exception> {

    private val log = Logger.getLogger(GeneralExceptionMapper::class.java)

    override fun toResponse(exception: Exception): Response {
        log.error("Unexpected error: ${exception.message}", exception)

        val errorResponse = ErrorResponse(
            error = "Internal Server Error",
            message = "An unexpected error occurred. Please try again later."
        )

        return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
            .entity(errorResponse)
            .build()
    }
}
