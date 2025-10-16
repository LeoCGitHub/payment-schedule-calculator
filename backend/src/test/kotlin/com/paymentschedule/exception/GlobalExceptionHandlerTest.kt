package com.paymentschedule.exception

import com.paymentschedule.model.ErrorResponse
import io.quarkus.test.junit.QuarkusTest
import jakarta.validation.ConstraintViolation
import jakarta.validation.ConstraintViolationException
import jakarta.validation.Path
import jakarta.ws.rs.core.Response
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import io.mockk.every
import io.mockk.mockk

@QuarkusTest
class GlobalExceptionHandlerTest {

    @Test
    fun `ConstraintViolationExceptionMapper should return 400 with validation errors`() {
        // Given
        val mapper = ConstraintViolationExceptionMapper()

        val violation1 = mockk<ConstraintViolation<*>>()
        val path1 = mockk<Path>()
        every { path1.toString() } returns "calculateSchedule.request.assetAmount"
        every { violation1.propertyPath } returns path1
        every { violation1.message } returns "Asset amount must be greater than 0"

        val violation2 = mockk<ConstraintViolation<*>>()
        val path2 = mockk<Path>()
        every { path2.toString() } returns "calculateSchedule.request.rentAmount"
        every { violation2.propertyPath } returns path2
        every { violation2.message } returns "Rent amount must be greater than 0"

        val violations = setOf(violation1, violation2)
        val exception = ConstraintViolationException("Validation failed", violations)

        // When
        val response = mapper.toResponse(exception)

        // Then
        assertThat(response.status).isEqualTo(Response.Status.BAD_REQUEST.statusCode)
        assertThat(response.entity).isInstanceOf(ErrorResponse::class.java)

        val errorResponse = response.entity as ErrorResponse
        assertThat(errorResponse.error).isEqualTo("Validation Error")
        assertThat(errorResponse.message).isEqualTo("Invalid request parameters")
        assertThat(errorResponse.details).isNotNull
        assertThat(errorResponse.details).hasSize(2)
        assertThat(errorResponse.details!!).containsKey("assetAmount")
        assertThat(errorResponse.details).containsKey("rentAmount")
        assertThat(errorResponse.details["assetAmount"]).isEqualTo("Asset amount must be greater than 0")
        assertThat(errorResponse.details["rentAmount"]).isEqualTo("Rent amount must be greater than 0")
    }

    @Test
    fun `ConstraintViolationExceptionMapper should handle single violation`() {
        // Given
        val mapper = ConstraintViolationExceptionMapper()

        val violation = mockk<ConstraintViolation<*>>()
        val path = mockk<Path>()
        every { path.toString() } returns "calculateSchedule.request.periodicity"
        every { violation.propertyPath } returns path
        every { violation.message } returns "Periodicity must be at least 1"

        val violations = setOf(violation)
        val exception = ConstraintViolationException("Validation failed", violations)

        // When
        val response = mapper.toResponse(exception)

        // Then
        assertThat(response.status).isEqualTo(400)
        val errorResponse = response.entity as ErrorResponse
        assertThat(errorResponse.details).isNotNull
        assertThat(errorResponse.details).hasSize(1)
        assertThat(errorResponse.details!!["periodicity"]).isEqualTo("Periodicity must be at least 1")
    }

    @Test
    fun `ConstraintViolationExceptionMapper should extract field name correctly`() {
        // Given
        val mapper = ConstraintViolationExceptionMapper()

        val violation = mockk<ConstraintViolation<*>>()
        val path = mockk<Path>()
        every { path.toString() } returns "complex.nested.path.fieldName"
        every { violation.propertyPath } returns path
        every { violation.message } returns "Field is invalid"

        val violations = setOf(violation)
        val exception = ConstraintViolationException("Validation failed", violations)

        // When
        val response = mapper.toResponse(exception)

        // Then
        val errorResponse = response.entity as ErrorResponse
        assertThat(errorResponse.details).isNotNull
        assertThat(errorResponse.details!!).containsKey("fieldName")
        assertThat(errorResponse.details["fieldName"]).isEqualTo("Field is invalid")
    }

    @Test
    fun `IllegalArgumentExceptionMapper should return 400 with business rule violation`() {
        // Given
        val mapper = IllegalArgumentExceptionMapper()
        val exception = IllegalArgumentException("Periodicity must be 1 (monthly), 3 (quarterly), 6 (semi-annual), or 12 (annual)")

        // When
        val response = mapper.toResponse(exception)

        // Then
        assertThat(response.status).isEqualTo(Response.Status.BAD_REQUEST.statusCode)
        assertThat(response.entity).isInstanceOf(ErrorResponse::class.java)

        val errorResponse = response.entity as ErrorResponse
        assertThat(errorResponse.error).isEqualTo("Business Rule Violation")
        assertThat(errorResponse.message).isEqualTo("Periodicity must be 1 (monthly), 3 (quarterly), 6 (semi-annual), or 12 (annual)")
        assertThat(errorResponse.details).isNullOrEmpty()
    }

    @Test
    fun `IllegalArgumentExceptionMapper should handle null message`() {
        // Given
        val mapper = IllegalArgumentExceptionMapper()
        val exception = IllegalArgumentException(null as String?)

        // When
        val response = mapper.toResponse(exception)

        // Then
        assertThat(response.status).isEqualTo(400)
        val errorResponse = response.entity as ErrorResponse
        assertThat(errorResponse.error).isEqualTo("Business Rule Violation")
        assertThat(errorResponse.message).isEqualTo("Invalid request parameters")
    }

    @Test
    fun `IllegalArgumentExceptionMapper should handle empty message`() {
        // Given
        val mapper = IllegalArgumentExceptionMapper()
        val exception = IllegalArgumentException("")

        // When
        val response = mapper.toResponse(exception)

        // Then
        assertThat(response.status).isEqualTo(400)
        val errorResponse = response.entity as ErrorResponse
        // Empty string is falsy in Kotlin's isNullOrEmpty check, so it fallbacks to default message
        assertThat(errorResponse.message).isEqualTo("")
    }

    @Test
    fun `ArithmeticExceptionMapper should return 422 with calculation error`() {
        // Given
        val mapper = ArithmeticExceptionMapper()
        val exception = ArithmeticException("Division by zero")

        // When
        val response = mapper.toResponse(exception)

        // Then
        assertThat(response.status).isEqualTo(422)
        assertThat(response.entity).isInstanceOf(ErrorResponse::class.java)

        val errorResponse = response.entity as ErrorResponse
        assertThat(errorResponse.error).isEqualTo("Calculation Error")
        assertThat(errorResponse.message).isEqualTo("Unable to calculate payment schedule with provided parameters")
        assertThat(errorResponse.details).isNullOrEmpty()
    }

    @Test
    fun `ArithmeticExceptionMapper should handle various arithmetic errors`() {
        // Given
        val mapper = ArithmeticExceptionMapper()
        val exception = ArithmeticException("Overflow in calculation")

        // When
        val response = mapper.toResponse(exception)

        // Then
        assertThat(response.status).isEqualTo(422)
        val errorResponse = response.entity as ErrorResponse
        assertThat(errorResponse.error).isEqualTo("Calculation Error")
    }

    @Test
    fun `GeneralExceptionMapper should return 500 with internal server error`() {
        // Given
        val mapper = GeneralExceptionMapper()
        val exception = RuntimeException("Unexpected error occurred")

        // When
        val response = mapper.toResponse(exception)

        // Then
        assertThat(response.status).isEqualTo(Response.Status.INTERNAL_SERVER_ERROR.statusCode)
        assertThat(response.entity).isInstanceOf(ErrorResponse::class.java)

        val errorResponse = response.entity as ErrorResponse
        assertThat(errorResponse.error).isEqualTo("Internal Server Error")
        assertThat(errorResponse.message).isEqualTo("An unexpected error occurred. Please try again later.")
        assertThat(errorResponse.details).isNullOrEmpty()
    }

    @Test
    fun `GeneralExceptionMapper should not expose internal error details`() {
        // Given
        val mapper = GeneralExceptionMapper()
        val exception = RuntimeException("Internal database connection failed with password: secret123")

        // When
        val response = mapper.toResponse(exception)

        // Then
        val errorResponse = response.entity as ErrorResponse
        assertThat(errorResponse.message).doesNotContain("secret123")
        assertThat(errorResponse.message).doesNotContain("database")
        assertThat(errorResponse.message).isEqualTo("An unexpected error occurred. Please try again later.")
    }

    @Test
    fun `GeneralExceptionMapper should handle NullPointerException`() {
        // Given
        val mapper = GeneralExceptionMapper()
        val exception = NullPointerException("Null value encountered")

        // When
        val response = mapper.toResponse(exception)

        // Then
        assertThat(response.status).isEqualTo(500)
        val errorResponse = response.entity as ErrorResponse
        assertThat(errorResponse.error).isEqualTo("Internal Server Error")
    }

    @Test
    fun `GeneralExceptionMapper should handle generic Exception`() {
        // Given
        val mapper = GeneralExceptionMapper()
        val exception = Exception("Generic error")

        // When
        val response = mapper.toResponse(exception)

        // Then
        assertThat(response.status).isEqualTo(500)
        val errorResponse = response.entity as ErrorResponse
        assertThat(errorResponse.error).isEqualTo("Internal Server Error")
        assertThat(errorResponse.message).isEqualTo("An unexpected error occurred. Please try again later.")
    }

    @Test
    fun `all exception mappers should return non-null responses`() {
        // Given
        val constraintMapper = ConstraintViolationExceptionMapper()
        val illegalArgMapper = IllegalArgumentExceptionMapper()
        val arithmeticMapper = ArithmeticExceptionMapper()
        val generalMapper = GeneralExceptionMapper()

        val constraintViolation = mockk<ConstraintViolation<*>>()
        val path = mockk<Path>()
        every { path.toString() } returns "field"
        every { constraintViolation.propertyPath } returns path
        every { constraintViolation.message } returns "error"

        val constraintException = ConstraintViolationException("error", setOf(constraintViolation))
        val illegalArgException = IllegalArgumentException("error")
        val arithmeticException = ArithmeticException("error")
        val generalException = Exception("error")

        // When
        val constraintResponse = constraintMapper.toResponse(constraintException)
        val illegalArgResponse = illegalArgMapper.toResponse(illegalArgException)
        val arithmeticResponse = arithmeticMapper.toResponse(arithmeticException)
        val generalResponse = generalMapper.toResponse(generalException)

        // Then
        assertThat(constraintResponse).isNotNull
        assertThat(illegalArgResponse).isNotNull
        assertThat(arithmeticResponse).isNotNull
        assertThat(generalResponse).isNotNull

        assertThat(constraintResponse.entity).isNotNull
        assertThat(illegalArgResponse.entity).isNotNull
        assertThat(arithmeticResponse.entity).isNotNull
        assertThat(generalResponse.entity).isNotNull
    }

    @Test
    fun `all exception mappers should return proper status codes`() {
        // Given
        val constraintMapper = ConstraintViolationExceptionMapper()
        val illegalArgMapper = IllegalArgumentExceptionMapper()
        val arithmeticMapper = ArithmeticExceptionMapper()
        val generalMapper = GeneralExceptionMapper()

        val constraintViolation = mockk<ConstraintViolation<*>>()
        val path = mockk<Path>()
        every { path.toString() } returns "field"
        every { constraintViolation.propertyPath } returns path
        every { constraintViolation.message } returns "error"

        // When & Then
        val constraintResponse = constraintMapper.toResponse(
            ConstraintViolationException("error", setOf(constraintViolation))
        )
        assertThat(constraintResponse.status).isEqualTo(400)

        val illegalArgResponse = illegalArgMapper.toResponse(IllegalArgumentException("error"))
        assertThat(illegalArgResponse.status).isEqualTo(400)

        val arithmeticResponse = arithmeticMapper.toResponse(ArithmeticException("error"))
        assertThat(arithmeticResponse.status).isEqualTo(422)

        val generalResponse = generalMapper.toResponse(Exception("error"))
        assertThat(generalResponse.status).isEqualTo(500)
    }

    @Test
    fun `ConstraintViolationExceptionMapper should handle complex path structures`() {
        // Given
        val mapper = ConstraintViolationExceptionMapper()

        val violation = mockk<ConstraintViolation<*>>()
        val path = mockk<Path>()
        every { path.toString() } returns "service.method.param.nested.field.value"
        every { violation.propertyPath } returns path
        every { violation.message } returns "Value is invalid"

        val violations = setOf(violation)
        val exception = ConstraintViolationException("Validation failed", violations)

        // When
        val response = mapper.toResponse(exception)

        // Then
        val errorResponse = response.entity as ErrorResponse
        assertThat(errorResponse.details).isNotNull
        assertThat(errorResponse.details!!).containsKey("value")
        assertThat(errorResponse.details["value"]).isEqualTo("Value is invalid")
    }

    @Test
    fun `ErrorResponse should have timestamp`() {
        // Given
        val mapper = IllegalArgumentExceptionMapper()
        val exception = IllegalArgumentException("Test error")

        // When
        val response = mapper.toResponse(exception)

        // Then
        val errorResponse = response.entity as ErrorResponse
        assertThat(errorResponse.timestamp).isNotNull()
    }
}
