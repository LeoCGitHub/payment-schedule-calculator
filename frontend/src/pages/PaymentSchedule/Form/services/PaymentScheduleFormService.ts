import { PaymentScheduleFormData } from '@/pages/PaymentSchedule/Form/types/PaymentScheduleFormData';
import { PaymentScheduleFormErrors } from '@/pages/PaymentSchedule/Form/types/PaymentScheduleFormErrors';
import { PaymentScheduleRequest } from '@/types/payment-schedule/request/PaymentScheduleRequest';

/**
 * Payment Schedule Form Service
 * Handles validation and transformation logic for the payment schedule form
 */
export class PaymentScheduleFormService {
  /**
   * Validate a single field
   * @param name Field name
   * @param value Field value
   * @param formData Optional form data for cross-field validation
   * @returns Error message if validation fails, undefined otherwise
   */
  static validateField(
    name: string,
    value: string,
    formData?: PaymentScheduleFormData
  ): string | undefined {
    switch (name) {
      case 'contractDuration':
        if (!value || parseInt(value) <= 0) {
          return 'errors.contractDuration.required';
        }

        if (formData) {
          const duration = parseInt(value);
          const periodicityMonths = parseInt(formData.periodicity);

          if (duration % periodicityMonths !== 0) {
            return 'errors.contractDuration.consistency';
          }
        }

        break;
      case 'periodicity':
        if (formData && formData.contractDuration) {
          const duration = parseInt(formData.contractDuration);
          const periodicityMonths = parseInt(value);

          if (duration > 0 && duration % periodicityMonths !== 0) {
            return 'errors.contractDuration.consistency';
          }
        }

        break;
      case 'assetAmount':
        if (!value || parseFloat(value) <= 0) {
          return 'errors.assetAmount.required';
        }

        if (formData && formData.rentAmount) {
          if (parseFloat(value) < parseFloat(formData.rentAmount)) {
            return 'errors.assetAmount.consistency.rentAmount';
          }
        }

        if (formData && formData.purchaseOptionAmount) {
          if (parseFloat(value) < parseFloat(formData.purchaseOptionAmount)) {
            return 'errors.assetAmount.consistency.purchaseOptionAmount';
          }
        }

        break;
      case 'rentAmount':
        if (!value || parseFloat(value) <= 0) {
          return 'errors.rentAmount.required';
        }

        if (formData && formData.assetAmount) {
          if (parseFloat(value) > parseFloat(formData.assetAmount)) {
            return 'errors.rentAmount.consistency';
          }
        }

        break;
      case 'firstPaymentDate':
        if (!value) {
          return 'errors.firstPaymentDate.required';
        }

        break;
      case 'purchaseOptionAmount':
        if (!value) {
          return 'errors.purchaseOptionAmount.required';
        }

        if (formData && formData.assetAmount) {
          if (parseFloat(value) > parseFloat(formData.assetAmount)) {
            return 'errors.purchaseOptionAmount.consistency';
          }
        }

        break;
      default:
        break;
    }
    return undefined;
  }

  /**
   * Validate all form fields
   * @param formData Form data to validate
   * @returns Object containing validation errors
   */
  static validateForm(
    formData: PaymentScheduleFormData
  ): PaymentScheduleFormErrors {
    const errors: PaymentScheduleFormErrors = {};

    if (
      !formData.contractDuration ||
      parseInt(formData.contractDuration) <= 0
    ) {
      errors.contractDuration = 'errors.contractDuration.required';
    } else {
      const duration = parseInt(formData.contractDuration);
      const periodicityMonths = parseInt(formData.periodicity);

      if (duration % periodicityMonths !== 0) {
        errors.contractDuration = `errors.contractDuration.consistency`;
      }
    }

    if (!formData.assetAmount || parseFloat(formData.assetAmount) <= 0) {
      errors.assetAmount = 'errors.assetAmount.required';
    }

    if (!formData.rentAmount || parseFloat(formData.rentAmount) <= 0) {
      errors.rentAmount = 'errors.rentAmount.required';
    }

    if (!formData.firstPaymentDate) {
      errors.firstPaymentDate = 'errors.firstPaymentDate.required';
    }

    if (!formData.purchaseOptionAmount) {
      errors.purchaseOptionAmount = 'errors.purchaseOptionAmount.required';
    }

    return errors;
  }

  /**
   * Check if form is valid
   * @param formData Form data
   * @param errors Current validation errors
   * @returns True if form is valid, false otherwise
   */
  static isFormValid(
    formData: PaymentScheduleFormData,
    errors: PaymentScheduleFormErrors
  ): boolean {
    return (
      !!formData.contractDuration &&
      parseInt(formData.contractDuration) > 0 &&
      !!formData.assetAmount &&
      parseFloat(formData.assetAmount) > 0 &&
      !!formData.rentAmount &&
      parseFloat(formData.rentAmount) > 0 &&
      !!formData.firstPaymentDate &&
      Object.keys(errors).length === 0
    );
  }

  /**
   * Transform form data to API request
   * @param formData Form data from UI
   * @returns Payment schedule request object for API
   */
  static transformToRequest(
    formData: PaymentScheduleFormData
  ): PaymentScheduleRequest {
    return {
      periodicity: parseInt(formData.periodicity),
      contractDuration: parseInt(formData.contractDuration),
      assetAmount: parseFloat(formData.assetAmount),
      purchaseOptionAmount: parseFloat(formData.purchaseOptionAmount),
      firstPaymentDate: formData.firstPaymentDate,
      rentAmount: parseFloat(formData.rentAmount),
      marginalDebtRate: formData.marginalDebtRate
        ? parseFloat(formData.marginalDebtRate) / 100
        : undefined,
    };
  }
}
