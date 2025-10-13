package com.paymentschedule.model

import java.time.LocalDateTime

/**
 * Standard error response format
 *
 * Provides consistent error structure across all API endpoints
 *
 * @property error Error type/category
 * @property message Human-readable error message
 * @property details Optional additional error details (e.g., validation errors)
 * @property timestamp When the error occurred
 * @property path API path that caused the error
 */
data class ErrorResponse(
    val error: String,
    val message: String,
    val details: Map<String, String>? = null,
    val timestamp: LocalDateTime = LocalDateTime.now(),
    val path: String? = null
)

/**
 * Validation error response
 *
 * Specialized error response for validation failures
 *
 * @property field Field that failed validation
 * @property rejectedValue Value that was rejected
 * @property message Validation error message
 */
data class ValidationError(
    val field: String,
    val rejectedValue: Any?,
    val message: String
)
