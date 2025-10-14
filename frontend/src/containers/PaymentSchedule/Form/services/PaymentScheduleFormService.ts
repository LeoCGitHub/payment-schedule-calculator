import { PaymentScheduleFormData } from '@/containers/PaymentSchedule/Form/types/PaymentScheduleFormData';
import { PaymentScheduleFormErrors } from '@/containers/PaymentSchedule/Form/types/PaymentScheduleFormErrors';
import { PaymentScheduleRequest } from '@/types/payment-schedule/request/PaymentScheduleRequest';

/**
 * Payment Schedule Form Service
 * Handles validation and transformation logic for the payment schedule form
 */
export class PaymentScheduleFormService {
  private static readonly PERIODICITY_MAP: Record<string, number> = {
    Mensuel: 1,
    Trimestriel: 3,
    Semestriel: 6,
    Annuel: 12,
  };

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
          return 'Contract duration is required';
        }
        if (formData) {
          const duration = parseInt(value);
          const periodicityMonths =
            this.PERIODICITY_MAP[formData.periodicity] ||
            this.PERIODICITY_MAP.Trimestriel;

          if (duration % periodicityMonths !== 0) {
            return `Contract duration must be a multiple of ${periodicityMonths} months for ${formData.periodicity} periodicity`;
          }
        }
        break;
      case 'periodicity':
        if (formData && formData.contractDuration) {
          const duration = parseInt(formData.contractDuration);
          const periodicityMonths =
            this.PERIODICITY_MAP[value] || this.PERIODICITY_MAP.Trimestriel;

          if (duration > 0 && duration % periodicityMonths !== 0) {
            return `Contract duration must be a multiple of ${periodicityMonths} months for ${value} periodicity`;
          }
        }
        break;
      case 'assetAmount':
        if (!value || parseFloat(value) <= 0) {
          return 'Asset amount must be greater than 0';
        }
        if (formData && formData.rentAmount) {
          if (parseInt(value) < parseInt(formData.rentAmount)) {
            return 'Asset amount must be greater than Rent amount';
          }
        }
        break;
      case 'rentAmount':
        if (!value || parseFloat(value) <= 0) {
          return 'Rent amount must be greater than 0';
        }
        if (formData && formData.assetAmount) {
          if (parseInt(value) > parseInt(formData.assetAmount)) {
            return 'Rent amount must be lower than Asset amount';
          }
        }
        break;
      case 'firstPaymentDate':
        if (!value) {
          return 'First payment date is required';
        }
        break;
      case 'purchaseOptionValue':
        if (!value) {
          return 'Purchase option amount is required';
        }
        break;
      case 'marginalDebtRate':
        if (!value) {
          return 'Marginal Debt Ratio is required';
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
      errors.contractDuration = 'Contract duration is required';
    } else {
      const duration = parseInt(formData.contractDuration);
      const periodicityMonths =
        this.PERIODICITY_MAP[formData.periodicity] ||
        this.PERIODICITY_MAP.Trimestriel;

      if (duration % periodicityMonths !== 0) {
        errors.contractDuration = `Contract duration must be a multiple of ${periodicityMonths} months for ${formData.periodicity} periodicity`;
      }
    }

    if (!formData.assetAmount || parseFloat(formData.assetAmount) <= 0) {
      errors.assetAmount = 'Asset value must be greater than 0';
    }

    if (!formData.rentAmount || parseFloat(formData.rentAmount) <= 0) {
      errors.rentAmount = 'Rent amount must be greater than 0';
    }

    if (!formData.firstPaymentDate) {
      errors.firstPaymentDate = 'First payment date is required';
    }

    if (!formData.purchaseOptionValue) {
      errors.purchaseOptionValue = 'Purchase option amount is required';
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
      periodicity:
        this.PERIODICITY_MAP[formData.periodicity] ||
        this.PERIODICITY_MAP.Trimestriel,
      contractDuration: parseInt(formData.contractDuration),
      assetAmount: parseFloat(formData.assetAmount),
      purchaseOptionAmount: parseFloat(formData.purchaseOptionValue),
      firstPaymentDate: formData.firstPaymentDate,
      rentAmount: parseFloat(formData.rentAmount),
      marginalDebtRate: parseInt(formData.marginalDebtRate || ''),
    };
  }

  /**
   * Get default form data
   * @returns Default form data values
   */
  static getDefaultFormData(): PaymentScheduleFormData {
    return {
      periodicity: 'Trimestriel',
      contractDuration: '48',
      assetAmount: '150000',
      purchaseOptionValue: '1500',
      firstPaymentDate: '17/09/2025',
      rentAmount: '10000',
    };
  }
}
