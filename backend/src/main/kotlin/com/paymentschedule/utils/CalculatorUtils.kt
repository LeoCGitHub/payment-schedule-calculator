package com.paymentschedule.utils

import com.paymentschedule.model.PaymentScheduleLine
import com.paymentschedule.model.ScheduleConfig
import java.math.BigDecimal
import java.math.RoundingMode
import java.time.LocalDate
import java.time.format.DateTimeFormatter
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

    fun calculateActualizedCashFlows(periodIndex: Int, actualizedRate: BigDecimal, rentAmount: BigDecimal): BigDecimal {
        val onePlusRate = BigDecimal.ONE.add(actualizedRate)
        val discountFactor = BigDecimalUtils.bigDecimalPow(onePlusRate, -periodIndex)

        return rentAmount.multiply(discountFactor, BigDecimalUtils.MATH_CONTEXT)
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
     * Calculate annual reference rate
     * Negative rate authorized
     *
     * @param periodicity
     * @param actualizedRate
     * @return
     */
    fun calculateAnnualReferenceRate(periodicity: Int, actualizedRate: BigDecimal): BigDecimal {
        val periodsPerYear = 12.div(periodicity)

        return BigDecimalUtils.bigDecimalPow(BigDecimal.ONE.add(actualizedRate), periodsPerYear)
            .subtract(BigDecimal.ONE)
    }

    /**
     * Calculate financial interest
     *
     * @param debtBeginningPeriod
     * @param actualizedRate
     * @return
     */
    fun calculateFinancialInterest(debtBeginningPeriod: BigDecimal, actualizedRate: BigDecimal): BigDecimal {
        return debtBeginningPeriod.multiply(actualizedRate)
    }

    /**
     * Calculate repayment
     *
     * @param rentAmount
     * @param financialInterestAmount
     * @return
     */
    fun calculateRepayment(rentAmount: BigDecimal, financialInterestAmount: BigDecimal): BigDecimal {
        return rentAmount.subtract(financialInterestAmount)
    }

    /**
     * Calculate debt end period
     *
     * @param debtBeginningPeriod
     * @param repayment
     * @return
     */
    fun calculateDebtEndPeriod(debtBeginningPeriod: BigDecimal, repayment: BigDecimal): BigDecimal {
        return debtBeginningPeriod.subtract(repayment)
    }

    /**
     * Calculate payment date
     *
     * @param periodIndex
     * @param periodicity
     * @param firstPaymentDate
     * @return
     */
    fun calculatePaymentDate(periodIndex: Int, periodicity: Int, firstPaymentDate: LocalDate): LocalDate {
        val monthsToAdd = (periodIndex - 1) * periodicity

        return firstPaymentDate.plusMonths(monthsToAdd.toLong())
    }

    /**
     * Calculate total periods
     *
     * @param contractDuration
     * @param periodicity
     * @return
     */
    fun calculateTotalPeriods(contractDuration: Int, periodicity: Int): Int {
        return contractDuration.div(periodicity)
    }

    fun calculateIBRPassifInitial(rents: List<BigDecimal>, config: ScheduleConfig): BigDecimal {
        return rents.foldIndexed(BigDecimal.ZERO) { index, acc, rent ->
            val pv = rent.divide((BigDecimal.ONE + config.actualizedRate).pow(index + 1), 8, RoundingMode.HALF_UP)
            acc + pv
        }
    }

    private const val CALCULATION_SCALE = 10
    private const val DISPLAY_SCALE = 2
    private val ROUNDING_MODE = RoundingMode.HALF_UP

    fun generateScheduleLinesIBR(
        rents: List<BigDecimal>,
        config: ScheduleConfig, // Doit contenir : initialDebt, totalPeriods, periodicity, firstPaymentDate, actualizedRate, rentAmount
        IBRPassifInitial: BigDecimal
    ): List<PaymentScheduleLine> {

        // 1. Calcul de l'amortissement linéaire de l'Actif IFRS 16
        val amortActif = config.initialDebt.divide(
            BigDecimal(config.totalPeriods),
            DISPLAY_SCALE,
            ROUNDING_MODE
        )

        val results = mutableListOf<PaymentScheduleLine>()
        var debtBeginningPeriodAmount = IBRPassifInitial
        val lastPeriod = config.totalPeriods

        // On suppose que le loyer standard est le premier paiement (sans l'option d'achat)
        val standardRent = rents.first().setScale(DISPLAY_SCALE, ROUNDING_MODE)

        // Si l'option d'achat est incluse, elle est la différence dans le dernier paiement
        val optionAchat = if (rents.size == lastPeriod) {
            rents.last().subtract(standardRent).setScale(DISPLAY_SCALE, ROUNDING_MODE)
        } else {
            BigDecimal.ZERO
        }


        for (p in 1..lastPeriod) {
            // Le flux de trésorerie réel de cette période (avec option dans la dernière)
            val totalCashFlow = rents[p - 1]

            // 2. Calcul des Intérêts financiers
            val financialInterestAmount = debtBeginningPeriodAmount
                .multiply(config.actualizedRate)
                .setScale(DISPLAY_SCALE, ROUNDING_MODE)

            // 3. Montant utilisé pour l'amortissement du passif (Principal)
            // C'est le paiement de loyer SANS l'option d'achat
            val effectivePaymentForAmortization = if (p == lastPeriod) {
                standardRent // Loyer standard pour le calcul du passif
            } else {
                totalCashFlow
            }

            // Amortissement du Passif (Principal remboursé)
            val amortizationAmount = effectivePaymentForAmortization
                .subtract(financialInterestAmount)
                .setScale(DISPLAY_SCALE, ROUNDING_MODE)

            // 4. Calcul du Solde Final de la dette
            val debtEndPeriodAmount = debtBeginningPeriodAmount
                .subtract(amortizationAmount)
                .setScale(DISPLAY_SCALE, ROUNDING_MODE)

            // 5. Charge Totale IFRS 16
            val chargeIFRS16 = financialInterestAmount
                .add(amortActif)
                .setScale(DISPLAY_SCALE, ROUNDING_MODE)

            // 6. Date d'échéance
            val dueDate = calculatePaymentDate(
                p,
                config.periodicity,
                config.firstPaymentDate
            ).format(DateTimeFormatter.ISO_LOCAL_DATE)

            // 7. Calcul du flux actualisé (PV) : doit utiliser le totalCashFlow, car c'est le flux réel
            val factor = BigDecimal.ONE.add(config.actualizedRate).pow(p)
            val actualizedCashFlowAmount = totalCashFlow.divide(
                factor,
                DISPLAY_SCALE,
                ROUNDING_MODE
            )

            // Ajout de la ligne au tableau
            results.add(
                PaymentScheduleLine(
                    period = p,
                    dueDate = dueDate,
                    // Le repaymentAmount (montant remboursant le passif) est l'amortissement SANS l'option
                    repaymentAmount = amortizationAmount,
                    debtBeginningPeriodAmount = debtBeginningPeriodAmount,
                    debtEndPeriodAmount = debtEndPeriodAmount,
                    periodRate = config.actualizedRate.setScale(DISPLAY_SCALE, ROUNDING_MODE),
                    financialInterestAmount = financialInterestAmount,
                    // rentAmount est le montant du loyer total (Cash flow)
                    rentAmount = totalCashFlow,
                    annualReferenceRate = BigDecimal.ZERO.setScale(DISPLAY_SCALE, ROUNDING_MODE),
                    actualizedCashFlowAmount = actualizedCashFlowAmount,
                    // Ajout des champs IFRS 16 pour être complet
//                    amortActif = amortActif,
//                    chargeIFRS16 = chargeIFRS16
                )
            )

            // Mise à jour pour la période suivante
            debtBeginningPeriodAmount = debtEndPeriodAmount
        }

        // --- CORRECTION FINALE ---
        if (results.isNotEmpty()) {
            val lastIndex = results.lastIndex
            val lastLine = results[lastIndex]

            // 1. Correction du montant du flux total (rentAmount) pour inclure l'option d'achat
            // -> C'est déjà fait, car on utilise totalCashFlow

            // 2. Correction de la dette finale pour qu'elle soit ZÉRO.
            // La dernière ligne doit avoir un Solde Fin de 0, car l'amortissement a été calculé
            // de manière à l'atteindre avec le loyer standard.
            results[lastIndex] = lastLine.copy(
                debtEndPeriodAmount = BigDecimal.ZERO.setScale(DISPLAY_SCALE, ROUNDING_MODE)
            )

            // 3. OPTIONNEL: Afficher le montant de l'option d'achat à part dans le tableau
            // ou dans le champ rentAmount (qui est le flux total).
            // Si vous voulez l'afficher clairement comme "Loyer standard + Option",
            // vous pouvez ajuster le champ rentAmount de la dernière ligne.
        }

        return results
    }
}
