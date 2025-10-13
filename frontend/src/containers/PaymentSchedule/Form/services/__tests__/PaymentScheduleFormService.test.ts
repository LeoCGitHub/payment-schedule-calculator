import { describe, it, expect } from 'vitest';
import { PaymentScheduleFormService } from '../PaymentScheduleFormService';
import { PaymentScheduleFormData } from '../../types/PaymentScheduleFormData';

describe('PaymentScheduleFormService', () => {
  describe('validateField', () => {
    it('should validate contractDuration field', () => {
      expect(PaymentScheduleFormService.validateField('contractDuration', '')).toBe(
        'Contract duration is required'
      );
      expect(PaymentScheduleFormService.validateField('contractDuration', '0')).toBe(
        'Contract duration is required'
      );
      expect(PaymentScheduleFormService.validateField('contractDuration', '-5')).toBe(
        'Contract duration is required'
      );
      expect(PaymentScheduleFormService.validateField('contractDuration', '12')).toBeUndefined();
    });

    it('should validate assetValue field', () => {
      expect(PaymentScheduleFormService.validateField('assetValue', '')).toBe(
        'Asset value must be greater than 0'
      );
      expect(PaymentScheduleFormService.validateField('assetValue', '0')).toBe(
        'Asset value must be greater than 0'
      );
      expect(PaymentScheduleFormService.validateField('assetValue', '-100')).toBe(
        'Asset value must be greater than 0'
      );
      expect(PaymentScheduleFormService.validateField('assetValue', '1000')).toBeUndefined();
    });

    it('should validate rentAmount field', () => {
      expect(PaymentScheduleFormService.validateField('rentAmount', '')).toBe(
        'Rent amount must be greater than 0'
      );
      expect(PaymentScheduleFormService.validateField('rentAmount', '0')).toBe(
        'Rent amount must be greater than 0'
      );
      expect(PaymentScheduleFormService.validateField('rentAmount', '-50')).toBe(
        'Rent amount must be greater than 0'
      );
      expect(PaymentScheduleFormService.validateField('rentAmount', '500')).toBeUndefined();
    });

    it('should validate firstPaymentDate field', () => {
      expect(PaymentScheduleFormService.validateField('firstPaymentDate', '')).toBe(
        'First payment date is required'
      );
      expect(
        PaymentScheduleFormService.validateField('firstPaymentDate', '2024-10-13')
      ).toBeUndefined();
    });

    it('should validate purchaseOptionValue field', () => {
      expect(PaymentScheduleFormService.validateField('purchaseOptionValue', '')).toBe(
        'Purchase option amount is required'
      );
      expect(
        PaymentScheduleFormService.validateField('purchaseOptionValue', '1000')
      ).toBeUndefined();
    });

    it('should return undefined for unknown fields', () => {
      expect(PaymentScheduleFormService.validateField('unknownField', 'value')).toBeUndefined();
    });
  });

  describe('validateForm', () => {
    const validFormData: PaymentScheduleFormData = {
      periodicity: 'Trimestriel',
      contractDuration: '48',
      assetValue: '150000',
      purchaseOptionValue: '1500',
      firstPaymentDate: '17/09/2025',
      rentAmount: '10000',
    };

    it('should return empty errors for valid form', () => {
      const errors = PaymentScheduleFormService.validateForm(validFormData);
      expect(errors).toEqual({});
    });

    it('should return error when contractDuration is empty', () => {
      const formData = { ...validFormData, contractDuration: '' };
      const errors = PaymentScheduleFormService.validateForm(formData);
      expect(errors.contractDuration).toBe('Contract duration is required');
    });

    it('should return error when contractDuration is zero', () => {
      const formData = { ...validFormData, contractDuration: '0' };
      const errors = PaymentScheduleFormService.validateForm(formData);
      expect(errors.contractDuration).toBe('Contract duration is required');
    });

    it('should return error when assetValue is empty', () => {
      const formData = { ...validFormData, assetValue: '' };
      const errors = PaymentScheduleFormService.validateForm(formData);
      expect(errors.assetValue).toBe('Asset value must be greater than 0');
    });

    it('should return error when assetValue is zero', () => {
      const formData = { ...validFormData, assetValue: '0' };
      const errors = PaymentScheduleFormService.validateForm(formData);
      expect(errors.assetValue).toBe('Asset value must be greater than 0');
    });

    it('should return error when rentAmount is empty', () => {
      const formData = { ...validFormData, rentAmount: '' };
      const errors = PaymentScheduleFormService.validateForm(formData);
      expect(errors.rentAmount).toBe('Rent amount must be greater than 0');
    });

    it('should return error when rentAmount is zero', () => {
      const formData = { ...validFormData, rentAmount: '0' };
      const errors = PaymentScheduleFormService.validateForm(formData);
      expect(errors.rentAmount).toBe('Rent amount must be greater than 0');
    });

    it('should return error when firstPaymentDate is empty', () => {
      const formData = { ...validFormData, firstPaymentDate: '' };
      const errors = PaymentScheduleFormService.validateForm(formData);
      expect(errors.firstPaymentDate).toBe('First payment date is required');
    });

    it('should return error when purchaseOptionValue is empty', () => {
      const formData = { ...validFormData, purchaseOptionValue: '' };
      const errors = PaymentScheduleFormService.validateForm(formData);
      expect(errors.purchaseOptionValue).toBe('Purchase option amount is required');
    });

    it('should return multiple errors when multiple fields are invalid', () => {
      const formData: PaymentScheduleFormData = {
        periodicity: 'Mensuel',
        contractDuration: '',
        assetValue: '0',
        purchaseOptionValue: '',
        firstPaymentDate: '',
        rentAmount: '-100',
      };
      const errors = PaymentScheduleFormService.validateForm(formData);

      expect(errors.contractDuration).toBe('Contract duration is required');
      expect(errors.assetValue).toBe('Asset value must be greater than 0');
      expect(errors.rentAmount).toBe('Rent amount must be greater than 0');
      expect(errors.firstPaymentDate).toBe('First payment date is required');
      expect(errors.purchaseOptionValue).toBe('Purchase option amount is required');
    });
  });

  describe('isFormValid', () => {
    const validFormData: PaymentScheduleFormData = {
      periodicity: 'Trimestriel',
      contractDuration: '48',
      assetValue: '150000',
      purchaseOptionValue: '1500',
      firstPaymentDate: '17/09/2025',
      rentAmount: '10000',
    };

    it('should return true for valid form with no errors', () => {
      const isValid = PaymentScheduleFormService.isFormValid(validFormData, {});
      expect(isValid).toBe(true);
    });

    it('should return false when there are errors', () => {
      const errors = { contractDuration: 'Contract duration is required' };
      const isValid = PaymentScheduleFormService.isFormValid(validFormData, errors);
      expect(isValid).toBe(false);
    });

    it('should return false when contractDuration is empty', () => {
      const formData = { ...validFormData, contractDuration: '' };
      const isValid = PaymentScheduleFormService.isFormValid(formData, {});
      expect(isValid).toBe(false);
    });

    it('should return false when assetValue is empty', () => {
      const formData = { ...validFormData, assetValue: '' };
      const isValid = PaymentScheduleFormService.isFormValid(formData, {});
      expect(isValid).toBe(false);
    });

    it('should return false when rentAmount is empty', () => {
      const formData = { ...validFormData, rentAmount: '' };
      const isValid = PaymentScheduleFormService.isFormValid(formData, {});
      expect(isValid).toBe(false);
    });

    it('should return false when firstPaymentDate is empty', () => {
      const formData = { ...validFormData, firstPaymentDate: '' };
      const isValid = PaymentScheduleFormService.isFormValid(formData, {});
      expect(isValid).toBe(false);
    });
  });

  describe('transformToRequest', () => {
    it('should transform form data to API request format', () => {
      const formData: PaymentScheduleFormData = {
        periodicity: 'Trimestriel',
        contractDuration: '48',
        assetValue: '150000',
        purchaseOptionValue: '1500',
        firstPaymentDate: '17/09/2025',
        rentAmount: '10000',
      };

      const request = PaymentScheduleFormService.transformToRequest(formData);

      expect(request).toEqual({
        periodicity: 3,
        contractDuration: 48,
        assetAmount: 150000,
        purchaseOptionAmount: 1500,
        firstPaymentDate: '17/09/2025',
        rentAmount: 10000,
      });
    });

    it('should transform Mensuel periodicity correctly', () => {
      const formData: PaymentScheduleFormData = {
        periodicity: 'Mensuel',
        contractDuration: '24',
        assetValue: '50000',
        purchaseOptionValue: '500',
        firstPaymentDate: '01/01/2024',
        rentAmount: '2000',
      };

      const request = PaymentScheduleFormService.transformToRequest(formData);
      expect(request.periodicity).toBe(1);
    });

    it('should transform Semestriel periodicity correctly', () => {
      const formData: PaymentScheduleFormData = {
        periodicity: 'Semestriel',
        contractDuration: '24',
        assetValue: '50000',
        purchaseOptionValue: '500',
        firstPaymentDate: '01/01/2024',
        rentAmount: '2000',
      };

      const request = PaymentScheduleFormService.transformToRequest(formData);
      expect(request.periodicity).toBe(6);
    });

    it('should transform Annuel periodicity correctly', () => {
      const formData: PaymentScheduleFormData = {
        periodicity: 'Annuel',
        contractDuration: '24',
        assetValue: '50000',
        purchaseOptionValue: '500',
        firstPaymentDate: '01/01/2024',
        rentAmount: '2000',
      };

      const request = PaymentScheduleFormService.transformToRequest(formData);
      expect(request.periodicity).toBe(12);
    });

    it('should default to Trimestriel for unknown periodicity', () => {
      const formData: PaymentScheduleFormData = {
        periodicity: 'Unknown' as any,
        contractDuration: '24',
        assetValue: '50000',
        purchaseOptionValue: '500',
        firstPaymentDate: '01/01/2024',
        rentAmount: '2000',
      };

      const request = PaymentScheduleFormService.transformToRequest(formData);
      expect(request.periodicity).toBe(3);
    });

    it('should handle decimal values correctly', () => {
      const formData: PaymentScheduleFormData = {
        periodicity: 'Trimestriel',
        contractDuration: '48',
        assetValue: '150000.50',
        purchaseOptionValue: '1500.75',
        firstPaymentDate: '17/09/2025',
        rentAmount: '10000.25',
      };

      const request = PaymentScheduleFormService.transformToRequest(formData);

      expect(request.assetAmount).toBe(150000.5);
      expect(request.purchaseOptionAmount).toBe(1500.75);
      expect(request.rentAmount).toBe(10000.25);
    });
  });

  describe('getDefaultFormData', () => {
    it('should return default form data', () => {
      const defaultData = PaymentScheduleFormService.getDefaultFormData();

      expect(defaultData).toEqual({
        periodicity: 'Trimestriel',
        contractDuration: '48',
        assetValue: '150000',
        purchaseOptionValue: '1500',
        firstPaymentDate: '17/09/2025',
        rentAmount: '10000',
      });
    });

    it('should return a new object each time', () => {
      const defaultData1 = PaymentScheduleFormService.getDefaultFormData();
      const defaultData2 = PaymentScheduleFormService.getDefaultFormData();

      expect(defaultData1).toEqual(defaultData2);
      expect(defaultData1).not.toBe(defaultData2);
    });
  });
});
