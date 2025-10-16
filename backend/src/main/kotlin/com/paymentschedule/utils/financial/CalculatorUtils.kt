package com.paymentschedule.utils.financial

import com.paymentschedule.model.ScheduleConfig
import com.paymentschedule.utils.BigDecimalUtils
import java.math.BigDecimal
import java.math.RoundingMode
import java.time.LocalDate
import kotlin.plus

object CalculatorUtils {

    /**
     * Method 1 (RECOMMENDED): Calculate implicit discount rate using annuity formula
     * Solves: Sum of discounted cash flows - Asset value = 0
     * Negative rate authorized (low at -50% max)
     *
     * Formula: Rent × [(1 - (1+r)^-n) / r] + Purchase option / (1+r)^n = Asset value
     *
     * This method uses the closed-form Net Present Value (NPV) formula,
     * which is the industry standard for calculating Internal Rate of Return (IRR).
     *
     * Advantages:
     * - Optimal performance: O(log(1/precision))
     * - Industry standard (IRR/NPV)
     * - Single equation evaluation per iteration
     * - High precision with BigDecimal
     *
     * Algorithm: Bisection method (binary search)
     * 1. Start with interval [0, 1] for the rate
     * 2. Test the midpoint
     * 3. Evaluate NPV equation
     * 4. Narrow the interval based on sign
     * 5. Repeat until convergence
     *
     * @param rentAmount Periodic rent amount
     * @param purchaseOptionAmount Purchase option value (residual value)
     * @param assetAmount Asset value (financed amount)
     * @param totalPeriods Number of contract periods
     * @param precision Convergence precision (default 1e-5)
     * @param maxIterations Maximum number of iterations (default 1000)
     * @return The implicit periodic discount rate
     *
     * @see calculateImplicitRateBasedOnResidualDebt Alternative method (deprecated, for testing only)
     */
    fun calculateInternalRateOfReturn(
        rentAmount: BigDecimal,
        purchaseOptionAmount: BigDecimal,
        assetAmount: BigDecimal,
        totalPeriods: Int,
        precision: BigDecimal = BigDecimal.valueOf(1e-5),
        maxIterations: Int = 1000
    ): BigDecimal {
        var low = BigDecimal.valueOf(-0.5)
        var high = BigDecimal.ONE
        var mid: BigDecimal

        var iteration = 0

        while (iteration < maxIterations) {
            mid = (low + high).divide(BigDecimal.valueOf(2), BigDecimalUtils.MATH_CONTEXT)

            val value = calculateNetPresentValue(
                rentAmount,
                purchaseOptionAmount,
                assetAmount,
                totalPeriods,
                mid
            )

            if (value.abs() < precision) return mid

            if (value > BigDecimal.ZERO) {
                low = mid
            } else {
                high = mid
            }

            iteration++
        }

        return (low + high).divide(BigDecimal.valueOf(2), BigDecimalUtils.MATH_CONTEXT)
    }

    /**
     * Method 2: Residual debt approach
     * Solves: Final_debt = Purchase option value
     * Negative rate authorized (low at -50% max)
     *
     * Principle: Simulates amortization and finds the rate for which
     * the residual debt after all payments equals the purchase option value
     *
     * For each period:
     * - Interest = Debt × Rate
     * - Principal repayment = Rent - Interest
     * - New debt = Debt - Principal repayment
     *
     * The sought rate is the one for which: Final debt = Purchase option value
     *
     * @deprecated This method is kept only for testing and validation purposes.
     * In production, use [calculateInternalRateOfReturn] which is mathematically equivalent
     * but 16× faster (O(log n) vs O(n × log n)).
     *
     * Reasons for deprecation:
     * - Performance: Slower iterative method (n calculations per iteration)
     * - Identical result: Both methods converge to the same rate
     * - Industry standard: NPV method (Internal Rate of Return) is the reference
     *
     * @see calculateInternalRateOfReturn Recommended method for production
     */
    @Deprecated(
        message = "Use calculateInternalRateOfReturn for better performance. " +
                "This method is kept only for testing and validation purposes.",
        replaceWith = ReplaceWith("calculateInternalRateOfReturn(rentAmount, purchaseOptionAmount, assetAmount, period)"),
        level = DeprecationLevel.WARNING
    )
    fun calculateImplicitRateBasedOnResidualDebt(
        rentAmount: BigDecimal,
        purchaseOptionAmount: BigDecimal,
        assetAmount: BigDecimal,
        totalPeriods: Int,
        precision: BigDecimal = BigDecimal.valueOf(1e-10)
    ): BigDecimal {
        var low = BigDecimal.valueOf(-0.5)
        var high = BigDecimal.ONE
        var mid: BigDecimal

        while ((high - low) > precision) {
            mid = (low + high).divide(BigDecimal.valueOf(2), BigDecimalUtils.MATH_CONTEXT)

            var currentDebt = assetAmount

            for (t in 1..totalPeriods) {
                val interestForPeriod = currentDebt.multiply(mid, BigDecimalUtils.MATH_CONTEXT)

                val principalRepayment = rentAmount.subtract(interestForPeriod)

                currentDebt = currentDebt.subtract(principalRepayment)
            }

            val diff = currentDebt.subtract(purchaseOptionAmount)

            if (diff > BigDecimal.ZERO) {
                high = mid
            } else {
                low = mid
            }
        }

        return (low + high).divide(BigDecimal.valueOf(2), BigDecimalUtils.MATH_CONTEXT)
    }

    /**
     * Calculate actualized (discounted) cash flow for a specific period
     *
     * Computes the present value of a future cash flow using the formula:
     * PV = FutureValue / (1 + rate)^period
     *
     * @param periodIndex Period number (1-based index)
     * @param actualizedRate Discount rate per period
     * @param rentAmount Cash flow amount to discount
     * @return Present value of the cash flow
     */
    fun calculateActualizedCashFlow(periodIndex: Int, actualizedRate: BigDecimal, rentAmount: BigDecimal): BigDecimal {
        val onePlusRate = BigDecimal.ONE.add(actualizedRate)
        val discountFactor = BigDecimalUtils.bigDecimalPow(onePlusRate, -periodIndex)

        return rentAmount.multiply(discountFactor, BigDecimalUtils.MATH_CONTEXT)
    }

    /**
     * Calculate actualized cash flows for all rents and return their sum
     *
     * Computes the present value of each rent payment and accumulates them.
     * The actualized values are stored in the provided mutable list.
     *
     * @param rents List of rent amounts (including purchase option as last element)
     * @param config Schedule configuration containing the actualized rate
     * @param actualizedCashFlows Mutable list to store each period's actualized cash flow
     * @return Sum of all actualized cash flows (initial liability)
     */
    fun calculateActualizedCashFlowsAndSum(rents: List<BigDecimal>, config: ScheduleConfig, actualizedCashFlows: MutableList<BigDecimal>): BigDecimal {
        return rents.foldIndexed(BigDecimal.ZERO) { index, acc, rent ->
            val actualizationPeriod = index + 1
            val pv = calculateActualizedCashFlow(actualizationPeriod, config.actualizedRate, rent)
            actualizedCashFlows.add(pv)
            acc + pv
        }
    }

    /**
     * Calculate Net Present Value (NPV) equation for IRR calculation
     *
     * Evaluates: NPV = Rent × [(1 - (1+r)^-n) / r] + PurchaseOption / (1+r)^n - assetAmount
     *
     * This function returns the difference between the present value of all cash flows
     * and the asset value. When this equals zero, we've found the Internal Rate of Return.
     *
     * @param rentAmount Periodic rent payment
     * @param purchaseOptionAmount Purchase option at end of contract
     * @param assetAmount Initial asset value (amount financed)
     * @param totalPeriods Number of periods
     * @param estimatedRate Rate being tested
     * @return NPV difference (zero when rate is correct)
     */
    fun calculateNetPresentValue(
        rentAmount: BigDecimal,
        purchaseOptionAmount: BigDecimal,
        assetAmount: BigDecimal,
        totalPeriods: Int,
        estimatedRate: BigDecimal
    ): BigDecimal {
        val onePlusRate = BigDecimal.ONE + estimatedRate
        val numerator = BigDecimal.ONE - BigDecimalUtils.bigDecimalPow(onePlusRate, -totalPeriods)

        val presentValueOfRents = rentAmount.multiply(
            numerator.divide(estimatedRate, BigDecimalUtils.MATH_CONTEXT),
            BigDecimalUtils.MATH_CONTEXT
        )

        val presentValueOfOption = purchaseOptionAmount.divide(
            BigDecimalUtils.bigDecimalPow(onePlusRate, totalPeriods),
            BigDecimalUtils.MATH_CONTEXT
        )

        return presentValueOfRents + presentValueOfOption - assetAmount
    }

    /**
     * Calculate Present Value (PV) of a future cash flow
     *
     * Formula: PV = FutureValue / (1 + rate)^period
     *
     * This discounts a single future payment back to its present value
     * using the specified discount rate and time period.
     *
     * @param cashFlow Future cash flow amount
     * @param discountRate Discount rate per period
     * @param period Number of periods in the future
     * @return Present value of the future cash flow
     */
    fun calculatePresentValue(cashFlow: BigDecimal, discountRate: BigDecimal, period: Int): BigDecimal {
        val onePlusRate = BigDecimal.ONE.add(discountRate)
        val discountFactor = BigDecimalUtils.bigDecimalPow(onePlusRate, period)

        return cashFlow.divide(discountFactor, BigDecimalUtils.MATH_CONTEXT)
    }

    /**
     * Calculate annual reference rate from periodic rate
     *
     * Converts a periodic rate to its equivalent annual rate using compound interest formula:
     * Annual rate = (1 + periodic rate)^(periods per year) - 1
     *
     * @param periodicity Number of months per period (1, 3, 6, or 12)
     * @param actualizedRate Periodic rate to convert
     * @return Equivalent annual reference rate
     */
    fun calculateAnnualReferenceRate(periodicity: Int, actualizedRate: BigDecimal): BigDecimal {
        val periodsPerYear = 12.div(periodicity)

        return BigDecimalUtils.bigDecimalPow(BigDecimal.ONE.add(actualizedRate), periodsPerYear)
            .subtract(BigDecimal.ONE)
    }

    /**
     * Calculate financial interest for a period
     *
     * Computes interest as: Interest = Debt × Rate
     *
     * @param debtBeginningPeriodAmount Outstanding debt at beginning of period
     * @param rate Interest rate per period
     * @return Financial interest amount for the period
     */
    fun calculateFinancialInterestAmount(debtBeginningPeriodAmount: BigDecimal, rate: BigDecimal): BigDecimal {
        return debtBeginningPeriodAmount.multiply(rate)
    }

    /**
     * Calculate debt at end of period
     *
     * Computes remaining debt after subtracting amortization:
     * End debt = Beginning debt - Amortization
     *
     * @param debtBeginningPeriodAmount Outstanding debt at beginning of period
     * @param amountToSubtract Principal amortization amount
     * @return Remaining debt at end of period
     */
    fun calculateDebtEndPeriodAmount(debtBeginningPeriodAmount: BigDecimal, amountToSubtract: BigDecimal): BigDecimal {
        return debtBeginningPeriodAmount.subtract(amountToSubtract)
    }

    /**
     * Calculate payment date for a given period
     *
     * Computes the due date by adding months to the first payment date:
     * Due date = First payment date + ((period - 1) × periodicity) months
     *
     * @param periodIndex Period number (1-based index)
     * @param periodicity Number of months between payments
     * @param firstPaymentDate Date of the first payment
     * @return Due date for the specified period
     */
    fun calculatePaymentDate(periodIndex: Int, periodicity: Int, firstPaymentDate: LocalDate): LocalDate {
        val monthsToAdd = (periodIndex - 1L) * periodicity
        return firstPaymentDate.plusMonths(monthsToAdd)
    }

    /**
     * Calculate total number of payment periods
     *
     * Divides contract duration by periodicity to get number of payments:
     * Total periods = Contract duration (months) / Periodicity (months)
     *
     * @param contractDuration Total contract duration in months
     * @param periodicity Payment frequency in months
     * @return Number of payment periods
     */
    fun calculateTotalPeriods(contractDuration: Int, periodicity: Int): Int {
        return contractDuration.div(periodicity)
    }

    /**
     * Calculate linear asset amortization per period
     *
     * Computes constant amortization amount for each period:
     * Linear amortization = Initial debt / Total periods
     *
     * Used in IBR calculation for IFRS 16 compliance
     *
     * @param initialDebt Initial asset value to amortize
     * @param totalPeriods Number of periods over which to amortize
     * @return Linear amortization amount per period
     */
    fun calculateLinearAssetAmortization(initialDebt: BigDecimal, totalPeriods: Int): BigDecimal {
        return initialDebt.divide(BigDecimal(totalPeriods))
    }

    /**
     * Calculate principal amortization amount
     *
     * Computes the portion of rent payment that goes toward principal:
     * Amortization = Rent - Interest
     *
     * @param rentAmount Total rent payment for the period
     * @param financialInterestAmount Interest portion of the payment
     * @return Principal amortization amount
     */
    fun calculateAmortizationAmount(rentAmount: BigDecimal, financialInterestAmount: BigDecimal): BigDecimal {
        return rentAmount.subtract(financialInterestAmount)
    }

    /**
     * Calculate IFRS 16 charge for the period
     *
     * Computes total IFRS 16 expense by adding:
     * IFRS 16 charge = Financial interest + Linear asset amortization
     *
     * This represents the total lease expense under IFRS 16 accounting standards
     *
     * @param financialInterestAmount Interest expense for the period
     * @param assetAmortization Linear depreciation of the right-of-use asset
     * @return Total IFRS 16 charge for the period
     */
    fun calculateIfrs16Charge(financialInterestAmount: BigDecimal, assetAmortization: BigDecimal): BigDecimal {
        return financialInterestAmount.add(assetAmortization)
    }
}
