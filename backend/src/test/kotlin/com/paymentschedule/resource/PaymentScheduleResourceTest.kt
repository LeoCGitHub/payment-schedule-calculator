package com.paymentschedule.resource

import io.quarkus.test.junit.QuarkusTest
import io.restassured.RestAssured.given
import io.restassured.http.ContentType
import org.hamcrest.Matchers.*
import org.junit.jupiter.api.Test
import org.assertj.core.api.Assertions.assertThat

@QuarkusTest
class PaymentScheduleResourceTest {

    private val validRequest = """
        {
            "periodicity": 3,
            "contractDuration": 48,
            "assetAmount": 150000,
            "purchaseOptionAmount": 1500,
            "firstPaymentDate": "17/09/2025",
            "rentAmount": 10000
        }
    """.trimIndent()

    @Test
    fun `should calculate schedule successfully with valid request`() {
        given()
            .contentType(ContentType.JSON)
            .body(validRequest)
            .`when`()
            .post("/api/payment-schedule/calculate")
            .then()
            .statusCode(200)
            .contentType(ContentType.JSON)
            .body("paymentScheduleLines", hasSize<Any>(16))
            .body("paymentScheduleLines[0].period", equalTo(1))
            .body("paymentScheduleLines[0].debtBeginningPeriodAmount", equalTo(150000))
            .body("paymentScheduleTotals", notNullValue())
            .body("paymentScheduleTotals.totalAmount", greaterThan(0f))
            .body("paymentScheduleTotals.totalInterestAmount", greaterThan(0f))
            .body("paymentScheduleTotals.totalRepaymentAmount", greaterThan(0f))
            .body("paymentScheduleTotals.totalActualizedCashFlowsAmount", greaterThan(0f))
            .body("purchaseOptionTotals", notNullValue())
            .body("purchaseOptionTotals.purchaseOptionAmount", equalTo(1500))
            .body("purchaseOptionTotals.actualizedPurchaseOptionAmount", greaterThan(0f))
    }

    @Test
    fun `should return 400 when periodicity is missing`() {
        val requestMissingPeriodicity = """
            {
                "contractDuration": 48,
                "assetAmount": 150000,
                "purchaseOptionAmount": 1500,
                "firstPaymentDate": "2025-09-17",
                "rentAmount": 10000
            }
        """.trimIndent()

        given()
            .contentType(ContentType.JSON)
            .body(requestMissingPeriodicity)
            .`when`()
            .post("/api/payment-schedule/calculate")
            .then()
            .statusCode(400)
    }

    @Test
    fun `should return 400 when periodicity is zero`() {
        val requestZeroPeriodicity = """
            {
                "periodicity": 0,
                "contractDuration": 48,
                "assetAmount": 150000,
                "purchaseOptionAmount": 1500,
                "firstPaymentDate": "17/09/2025",
                "rentAmount": 10000
            }
        """.trimIndent()

        given()
            .contentType(ContentType.JSON)
            .body(requestZeroPeriodicity)
            .`when`()
            .post("/api/payment-schedule/calculate")
            .then()
            .statusCode(400)
            .body("error", equalTo("Validation Error"))
            .body("message", equalTo("Invalid request parameters"))
            .body("details.periodicity", containsString("must be at least 1"))
    }

    @Test
    fun `should return 400 when periodicity is negative`() {
        val requestNegativePeriodicity = """
            {
                "periodicity": -3,
                "contractDuration": 48,
                "assetAmount": 150000,
                "purchaseOptionAmount": 1500,
                "firstPaymentDate": "17/09/2025",
                "rentAmount": 10000
            }
        """.trimIndent()

        given()
            .contentType(ContentType.JSON)
            .body(requestNegativePeriodicity)
            .`when`()
            .post("/api/payment-schedule/calculate")
            .then()
            .statusCode(400)
            .body("error", equalTo("Validation Error"))
            .body("details.periodicity", containsString("must be at least 1"))
    }

    @Test
    fun `should return 400 when periodicity is invalid value`() {
        val requestInvalidPeriodicity = """
            {
                "periodicity": 5,
                "contractDuration": 48,
                "assetAmount": 150000,
                "purchaseOptionAmount": 1500,
                "firstPaymentDate": "17/09/2025",
                "rentAmount": 10000
            }
        """.trimIndent()

        given()
            .contentType(ContentType.JSON)
            .body(requestInvalidPeriodicity)
            .`when`()
            .post("/api/payment-schedule/calculate")
            .then()
            .statusCode(400)
            .body("error", equalTo("Business Rule Violation"))
            .body("message", containsString("Periodicity must be 1 (monthly), 3 (quarterly), 6 (semi-annual), or 12 (annual)"))
    }

    @Test
    fun `should return 400 when contract duration is not divisible by periodicity`() {
        val requestInvalidDuration = """
            {
                "periodicity": 3,
                "contractDuration": 47,
                "assetAmount": 150000,
                "purchaseOptionAmount": 1500,
                "firstPaymentDate": "17/09/2025",
                "rentAmount": 10000
            }
        """.trimIndent()

        given()
            .contentType(ContentType.JSON)
            .body(requestInvalidDuration)
            .`when`()
            .post("/api/payment-schedule/calculate")
            .then()
            .statusCode(400)
            .body("error", equalTo("Business Rule Violation"))
            .body("message", containsString("Contract duration"))
            .body("message", containsString("must be divisible by periodicity"))
    }

    @Test
    fun `should return 400 when asset amount is zero`() {
        val requestZeroAsset = """
            {
                "periodicity": 3,
                "contractDuration": 48,
                "assetAmount": 0,
                "purchaseOptionAmount": 1500,
                "firstPaymentDate": "17/09/2025",
                "rentAmount": 10000
            }
        """.trimIndent()

        given()
            .contentType(ContentType.JSON)
            .body(requestZeroAsset)
            .`when`()
            .post("/api/payment-schedule/calculate")
            .then()
            .statusCode(400)
            .body("error", equalTo("Validation Error"))
            .body("details.assetAmount", containsString("must be greater than 0"))
    }

    @Test
    fun `should return 400 when asset amount is negative`() {
        val requestNegativeAsset = """
            {
                "periodicity": 3,
                "contractDuration": 48,
                "assetAmount": -150000,
                "purchaseOptionAmount": 1500,
                "firstPaymentDate": "17/09/2025",
                "rentAmount": 10000
            }
        """.trimIndent()

        given()
            .contentType(ContentType.JSON)
            .body(requestNegativeAsset)
            .`when`()
            .post("/api/payment-schedule/calculate")
            .then()
            .statusCode(400)
            .body("error", equalTo("Validation Error"))
            .body("details.assetAmount", containsString("must be greater than 0"))
    }

    @Test
    fun `should return 400 when purchase option is negative`() {
        val requestNegativePurchaseOption = """
            {
                "periodicity": 3,
                "contractDuration": 48,
                "assetAmount": 150000,
                "purchaseOptionAmount": -1500,
                "firstPaymentDate": "17/09/2025",
                "rentAmount": 10000
            }
        """.trimIndent()

        given()
            .contentType(ContentType.JSON)
            .body(requestNegativePurchaseOption)
            .`when`()
            .post("/api/payment-schedule/calculate")
            .then()
            .statusCode(400)
            .body("error", equalTo("Validation Error"))
            .body("details.purchaseOptionAmount", containsString("must be greater than or equal to 0"))
    }

    @Test
    fun `should return 400 when rent amount is zero`() {
        val requestZeroRent = """
            {
                "periodicity": 3,
                "contractDuration": 48,
                "assetAmount": 150000,
                "purchaseOptionAmount": 1500,
                "firstPaymentDate": "17/09/2025",
                "rentAmount": 0
            }
        """.trimIndent()

        given()
            .contentType(ContentType.JSON)
            .body(requestZeroRent)
            .`when`()
            .post("/api/payment-schedule/calculate")
            .then()
            .statusCode(400)
            .body("error", equalTo("Validation Error"))
            .body("details.rentAmount", containsString("must be greater than 0"))
    }

    @Test
    fun `should return 400 when rent amount exceeds asset amount`() {
        val requestRentExceedsAsset = """
            {
                "periodicity": 3,
                "contractDuration": 48,
                "assetAmount": 150000,
                "purchaseOptionAmount": 1500,
                "firstPaymentDate": "17/09/2025",
                "rentAmount": 200000
            }
        """.trimIndent()

        given()
            .contentType(ContentType.JSON)
            .body(requestRentExceedsAsset)
            .`when`()
            .post("/api/payment-schedule/calculate")
            .then()
            .statusCode(400)
            .body("error", equalTo("Business Rule Violation"))
            .body("message", containsString("Rent amount"))
            .body("message", containsString("must be less than asset amount"))
    }

    @Test
    fun `should handle multiple validation errors`() {
        val requestMultipleErrors = """
            {
                "periodicity": 0,
                "contractDuration": -10,
                "assetAmount": -150000,
                "purchaseOptionAmount": -1500,
                "firstPaymentDate": "01/01/2025",
                "rentAmount": -10000
            }
        """.trimIndent()

        given()
            .contentType(ContentType.JSON)
            .body(requestMultipleErrors)
            .`when`()
            .post("/api/payment-schedule/calculate")
            .then()
            .statusCode(400)
            .body("error", equalTo("Validation Error"))
            .body("message", equalTo("Invalid request parameters"))
            .body("details.size()", greaterThan(1))
    }

    @Test
    fun `should calculate schedule for monthly periodicity`() {
        val monthlyRequest = """
            {
                "periodicity": 1,
                "contractDuration": 12,
                "assetAmount": 50000,
                "purchaseOptionAmount": 500,
                "firstPaymentDate": "01/01/2025",
                "rentAmount": 4500
            }
        """.trimIndent()

        given()
            .contentType(ContentType.JSON)
            .body(monthlyRequest)
            .`when`()
            .post("/api/payment-schedule/calculate")
            .then()
            .statusCode(200)
            .body("paymentScheduleLines", hasSize<Any>(12))
            .body("paymentScheduleLines[0].dueDate", equalTo("2025-01-01"))
            .body("paymentScheduleLines[1].dueDate", equalTo("2025-02-01"))
    }

    @Test
    fun `should calculate schedule for quarterly periodicity`() {
        val quarterlyRequest = """
            {
                "periodicity": 3,
                "contractDuration": 12,
                "assetAmount": 50000,
                "purchaseOptionAmount": 500,
                "firstPaymentDate": "01/01/2025",
                "rentAmount": 13500
            }
        """.trimIndent()

        given()
            .contentType(ContentType.JSON)
            .body(quarterlyRequest)
            .`when`()
            .post("/api/payment-schedule/calculate")
            .then()
            .statusCode(200)
            .body("paymentScheduleLines", hasSize<Any>(4))
            .body("paymentScheduleLines[0].dueDate", equalTo("2025-01-01"))
            .body("paymentScheduleLines[1].dueDate", equalTo("2025-04-01"))
    }

    @Test
    fun `should calculate schedule for semi-annual periodicity`() {
        val semiAnnualRequest = """
            {
                "periodicity": 6,
                "contractDuration": 12,
                "assetAmount": 50000,
                "purchaseOptionAmount": 500,
                "firstPaymentDate": "01/01/2025",
                "rentAmount": 27000
            }
        """.trimIndent()

        given()
            .contentType(ContentType.JSON)
            .body(semiAnnualRequest)
            .`when`()
            .post("/api/payment-schedule/calculate")
            .then()
            .statusCode(200)
            .body("paymentScheduleLines", hasSize<Any>(2))
            .body("paymentScheduleLines[0].dueDate", equalTo("2025-01-01"))
            .body("paymentScheduleLines[1].dueDate", equalTo("2025-07-01"))
    }

    @Test
    fun `should calculate schedule for annual periodicity`() {
        val annualRequest = """
            {
                "periodicity": 12,
                "contractDuration": 12,
                "assetAmount": 50000,
                "purchaseOptionAmount": 500,
                "firstPaymentDate": "01/01/2025",
                "rentAmount": 10000
            }
        """.trimIndent()

        given()
            .contentType(ContentType.JSON)
            .body(annualRequest)
            .`when`()
            .post("/api/payment-schedule/calculate")
            .then()
            .statusCode(200)
            .body("paymentScheduleLines", hasSize<Any>(1))
            .body("paymentScheduleLines[0].dueDate", equalTo("2025-01-01"))
    }

    @Test
    fun `should have consistent rent amounts in all periods`() {
        given()
            .contentType(ContentType.JSON)
            .body(validRequest)
            .`when`()
            .post("/api/payment-schedule/calculate")
            .then()
            .statusCode(200)
            .body("paymentScheduleLines.every { it.rentAmount == 10000.00 }", equalTo(true))
    }

    @Test
    fun `should have decreasing debt amounts over periods`() {
        val response = given()
            .contentType(ContentType.JSON)
            .body(validRequest)
            .`when`()
            .post("/api/payment-schedule/calculate")
            .then()
            .statusCode(200)
            .extract().response()

            val debt1 = response.jsonPath().getDouble("paymentScheduleLines[0].debtBeginningPeriodAmount")
            val debt2 = response.jsonPath().getDouble("paymentScheduleLines[1].debtBeginningPeriodAmount")

            assertThat(debt1)
                .withFailMessage("La period 0 debt ($debt1) is not greater than period 1 debt ($debt2)")
                .isGreaterThan(debt2)
    }

    @Test
    fun `should include error timestamp in error responses`() {
        val invalidRequest = """
            {
                "periodicity": 0,
                "contractDuration": 48,
                "assetAmount": 150000,
                "purchaseOptionAmount": 1500,
                "firstPaymentDate": "17/09/2025",
                "rentAmount": 10000
            }
        """.trimIndent()

        given()
            .contentType(ContentType.JSON)
            .body(invalidRequest)
            .`when`()
            .post("/api/payment-schedule/calculate")
            .then()
            .statusCode(400)
            .body("timestamp", notNullValue())
    }

    @Test
    fun `should calculate with zero purchase option`() {
        val requestZeroPurchaseOption = """
            {
                "periodicity": 3,
                "contractDuration": 12,
                "assetAmount": 50000,
                "purchaseOptionAmount": 0.00,
                "firstPaymentDate": "01/01/2025",
                "rentAmount": 12500
            }
        """.trimIndent()

        given()
            .contentType(ContentType.JSON)
            .body(requestZeroPurchaseOption)
            .`when`()
            .post("/api/payment-schedule/calculate")
            .then()
            .statusCode(200)
            .body("purchaseOptionTotals.purchaseOptionAmount", equalTo(0.00f))
            .body("purchaseOptionTotals.actualizedPurchaseOptionAmount", equalTo(0.00f))
    }
}
