package com.paymentschedule.model

import com.fasterxml.jackson.annotation.JsonFormat
import jakarta.validation.constraints.*
import java.math.BigDecimal
import java.time.LocalDate

/**
 * Payment schedule request
 *
 * Validates all input parameters to ensure business rules are respected:
 * - Periodicity must be 1, 3, 6, or 12 months
 * - All monetary amounts must be positive
 * - Contract duration must be divisible by periodicity
 * - Rent amount must be less than asset amount
 *
 * @property periodicity Payment frequency in months (1=monthly, 3=quarterly, 6=semi-annual, 12=annual)
 * @property contractDuration Total contract duration in months
 * @property assetAmount Total asset value being financed
 * @property purchaseOptionAmount Purchase option value at contract end
 * @property firstPaymentDate Date of the first payment
 * @property rentAmount Periodic rent amount
 */
data class PaymentScheduleRequest(
    @field:Min(value = 1, message = "Periodicity must be at least 1")
    @field:Max(value = 12, message = "Periodicity must be at most 12")
    val periodicity: Int,

    @field:Min(value = 1, message = "Contract duration must be at least 1 month")
    val contractDuration: Int,

    @field:NotNull(message = "Asset amount is required")
    @field:DecimalMin(value = "0.01", message = "Asset amount must be greater than 0")
    val assetAmount: BigDecimal,

    @field:NotNull(message = "Purchase option amount is required")
    @field:DecimalMin(value = "0.00", inclusive = true, message = "Purchase option amount cannot be negative")
    val purchaseOptionAmount: BigDecimal,

    @field:NotNull(message = "First payment date is required")
    @param:JsonFormat(pattern = "dd/MM/yyyy")
    val firstPaymentDate: LocalDate,

    @field:NotNull(message = "Rent amount is required")
    @field:DecimalMin(value = "0.0001", message = "Rent amount must be greater than 0")
    val rentAmount: BigDecimal
) {
    /**
     * Validate business rules
     *
     * Checks complex business rules that can't be expressed with simple annotations.
     * Throws IllegalArgumentException if validation fails.
     *
     * Call this method after Bean Validation passes.
     */
    fun validateBusinessRules() {
        require(periodicity in listOf(1, 3, 6, 12)) {
            "Periodicity must be 1 (monthly), 3 (quarterly), 6 (semi-annual), or 12 (annual)"
        }

        require(contractDuration % periodicity == 0) {
            "Contract duration ($contractDuration months) must be divisible by periodicity ($periodicity months)"
        }

        require(rentAmount < assetAmount) {
            "Rent amount ($rentAmount) must be less than asset amount ($assetAmount)"
        }

        require(purchaseOptionAmount <= assetAmount) {
            "Purchase option amount ($purchaseOptionAmount) must not exceed asset amount ($assetAmount)"
        }
    }
}
