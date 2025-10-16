import { describe, it, expect } from 'vitest';
import { PaymentScheduleFormService } from '../PaymentScheduleFormService';
import { PaymentScheduleFormData } from '../../types/PaymentScheduleFormData';

describe('PaymentScheduleFormService', () => {
  describe('validateField', () => {
    it('should validate contractDuration field', () => {
      expect(
        PaymentScheduleFormService.validateField('contractDuration', '')
      ).toBe('errors.contractDuration.required');
      expect(
        PaymentScheduleFormService.validateField('contractDuration', '0')
      ).toBe('errors.contractDuration.required');
      expect(
        PaymentScheduleFormService.validateField('contractDuration', '-5')
      ).toBe('errors.contractDuration.required');
      expect(
        PaymentScheduleFormService.validateField('contractDuration', '12')
      ).toBeUndefined();
    });

    it('should validate assetAmount field', () => {
      expect(PaymentScheduleFormService.validateField('assetAmount', '')).toBe(
        'errors.assetAmount.required'
      );
      expect(PaymentScheduleFormService.validateField('assetAmount', '0')).toBe(
        'errors.assetAmount.required'
      );
      expect(
        PaymentScheduleFormService.validateField('assetAmount', '-100')
      ).toBe('errors.assetAmount.required');
      expect(
        PaymentScheduleFormService.validateField('assetAmount', '1000')
      ).toBeUndefined();
    });

    it('should validate rentAmount field', () => {
      expect(PaymentScheduleFormService.validateField('rentAmount', '')).toBe(
        'errors.rentAmount.required'
      );
      expect(PaymentScheduleFormService.validateField('rentAmount', '0')).toBe(
        'errors.rentAmount.required'
      );
      expect(
        PaymentScheduleFormService.validateField('rentAmount', '-50')
      ).toBe('errors.rentAmount.required');
      expect(
        PaymentScheduleFormService.validateField('rentAmount', '500')
      ).toBeUndefined();
    });

    it('should validate firstPaymentDate field', () => {
      expect(
        PaymentScheduleFormService.validateField('firstPaymentDate', '')
      ).toBe('errors.firstPaymentDate.required');
      expect(
        PaymentScheduleFormService.validateField(
          'firstPaymentDate',
          '2024-10-13'
        )
      ).toBeUndefined();
    });

    it('should validate purchaseOptionAmount field', () => {
      expect(
        PaymentScheduleFormService.validateField('purchaseOptionAmount', '')
      ).toBe('errors.purchaseOptionAmount.required');
      expect(
        PaymentScheduleFormService.validateField('purchaseOptionAmount', '1000')
      ).toBeUndefined();
    });

    it('should return undefined for unknown fields', () => {
      expect(
        PaymentScheduleFormService.validateField('unknownField', 'value')
      ).toBeUndefined();
    });

    describe('cross-field validation with formData', () => {
      const mockFormData: PaymentScheduleFormData = {
        periodicity: '3',
        contractDuration: '48',
        assetAmount: '150000',
        purchaseOptionAmount: '1500',
        firstPaymentDate: '17/09/2025',
        rentAmount: '10000',
      };

      it('should validate contractDuration consistency with periodicity when formData is provided', () => {
        expect(
          PaymentScheduleFormService.validateField(
            'contractDuration',
            '36',
            mockFormData
          )
        ).toBeUndefined();

        expect(
          PaymentScheduleFormService.validateField(
            'contractDuration',
            '13',
            mockFormData
          )
        ).toBe('errors.contractDuration.consistency');

        const mensuelFormData = { ...mockFormData, periodicity: '1' };
        expect(
          PaymentScheduleFormService.validateField(
            'contractDuration',
            '13',
            mensuelFormData
          )
        ).toBeUndefined();
      });

      it('should validate periodicity consistency with contractDuration when formData is provided', () => {
        expect(
          PaymentScheduleFormService.validateField(
            'periodicity',
            '6',
            mockFormData
          )
        ).toBeUndefined();

        const formDataWithDuration13 = {
          ...mockFormData,
          contractDuration: '13',
        };
        expect(
          PaymentScheduleFormService.validateField(
            'periodicity',
            '6',
            formDataWithDuration13
          )
        ).toBe('errors.contractDuration.consistency');
      });

      it('should validate contractDuration without formData (backward compatibility)', () => {
        expect(
          PaymentScheduleFormService.validateField('contractDuration', '12')
        ).toBeUndefined();
        expect(
          PaymentScheduleFormService.validateField('contractDuration', '0')
        ).toBe('errors.contractDuration.required');
      });

      it('should validate periodicity changes with all periodicity types', () => {
        expect(
          PaymentScheduleFormService.validateField(
            'periodicity',
            '12',
            mockFormData
          )
        ).toBeUndefined();

        const formDataWith13 = { ...mockFormData, contractDuration: '13' };
        expect(
          PaymentScheduleFormService.validateField(
            'periodicity',
            '12',
            formDataWith13
          )
        ).toBe('errors.contractDuration.consistency');
      });
    });
  });

  describe('validateForm', () => {
    const validFormData: PaymentScheduleFormData = {
      periodicity: '3',
      contractDuration: '48',
      assetAmount: '150000',
      purchaseOptionAmount: '1500',
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
      expect(errors.contractDuration).toBe('errors.contractDuration.required');
    });

    it('should return error when contractDuration is zero', () => {
      const formData = { ...validFormData, contractDuration: '0' };
      const errors = PaymentScheduleFormService.validateForm(formData);
      expect(errors.contractDuration).toBe('errors.contractDuration.required');
    });

    it('should return error when assetAmount is empty', () => {
      const formData = { ...validFormData, assetAmount: '' };
      const errors = PaymentScheduleFormService.validateForm(formData);
      expect(errors.assetAmount).toBe('errors.assetAmount.required');
    });

    it('should return error when assetAmount is zero', () => {
      const formData = { ...validFormData, assetAmount: '0' };
      const errors = PaymentScheduleFormService.validateForm(formData);
      expect(errors.assetAmount).toBe('errors.assetAmount.required');
    });

    it('should return error when rentAmount is empty', () => {
      const formData = { ...validFormData, rentAmount: '' };
      const errors = PaymentScheduleFormService.validateForm(formData);
      expect(errors.rentAmount).toBe('errors.rentAmount.required');
    });

    it('should return error when rentAmount is zero', () => {
      const formData = { ...validFormData, rentAmount: '0' };
      const errors = PaymentScheduleFormService.validateForm(formData);
      expect(errors.rentAmount).toBe('errors.rentAmount.required');
    });

    it('should return error when firstPaymentDate is empty', () => {
      const formData = { ...validFormData, firstPaymentDate: '' };
      const errors = PaymentScheduleFormService.validateForm(formData);
      expect(errors.firstPaymentDate).toBe('errors.firstPaymentDate.required');
    });

    it('should return error when purchaseOptionAmount is empty', () => {
      const formData = { ...validFormData, purchaseOptionAmount: '' };
      const errors = PaymentScheduleFormService.validateForm(formData);
      expect(errors.purchaseOptionAmount).toBe(
        'errors.purchaseOptionAmount.required'
      );
    });

    it('should return multiple errors when multiple fields are invalid', () => {
      const formData: PaymentScheduleFormData = {
        periodicity: 'Mensuel',
        contractDuration: '',
        assetAmount: '0',
        purchaseOptionAmount: '',
        firstPaymentDate: '',
        rentAmount: '-100',
      };
      const errors = PaymentScheduleFormService.validateForm(formData);

      expect(errors.contractDuration).toBe('errors.contractDuration.required');
      expect(errors.assetAmount).toBe('errors.assetAmount.required');
      expect(errors.rentAmount).toBe('errors.rentAmount.required');
      expect(errors.firstPaymentDate).toBe('errors.firstPaymentDate.required');
      expect(errors.purchaseOptionAmount).toBe(
        'errors.purchaseOptionAmount.required'
      );
    });

    describe('duration and periodicity consistency validation', () => {
      it('should return error when duration is not a multiple of Mensuel periodicity (1 month)', () => {
        const formData = {
          ...validFormData,
          periodicity: '1',
          contractDuration: '13',
        };
        const errors = PaymentScheduleFormService.validateForm(formData);
        expect(errors.contractDuration).toBeUndefined();
      });

      it('should return error when duration is not a multiple of 3 periodicity (3 months)', () => {
        const formData = {
          ...validFormData,
          periodicity: '3',
          contractDuration: '13',
        };
        const errors = PaymentScheduleFormService.validateForm(formData);
        expect(errors.contractDuration).toBe(
          'errors.contractDuration.consistency'
        );
      });

      it('should accept valid duration for Trimestriel periodicity', () => {
        const formData = {
          ...validFormData,
          periodicity: '3',
          contractDuration: '36',
        };
        const errors = PaymentScheduleFormService.validateForm(formData);
        expect(errors.contractDuration).toBeUndefined();
      });

      it('should return error when duration is not a multiple of 6 periodicity (6 months)', () => {
        const formData = {
          ...validFormData,
          periodicity: '6',
          contractDuration: '13',
        };
        const errors = PaymentScheduleFormService.validateForm(formData);
        expect(errors.contractDuration).toBe(
          'errors.contractDuration.consistency'
        );
      });

      it('should accept valid duration for Semestriel periodicity', () => {
        const formData = {
          ...validFormData,
          periodicity: '6',
          contractDuration: '24',
        };
        const errors = PaymentScheduleFormService.validateForm(formData);
        expect(errors.contractDuration).toBeUndefined();
      });

      it('should return error when duration is not a multiple of 12 periodicity (12 months)', () => {
        const formData = {
          ...validFormData,
          periodicity: '12',
          contractDuration: '13',
        };
        const errors = PaymentScheduleFormService.validateForm(formData);
        expect(errors.contractDuration).toBe(
          'errors.contractDuration.consistency'
        );
      });

      it('should accept valid duration for Annuel periodicity', () => {
        const formData = {
          ...validFormData,
          periodicity: '12',
          contractDuration: '36',
        };
        const errors = PaymentScheduleFormService.validateForm(formData);
        expect(errors.contractDuration).toBeUndefined();
      });

      it('should check consistency even with edge case durations', () => {
        const formData = {
          ...validFormData,
          periodicity: '3',
          contractDuration: '7',
        };
        const errors = PaymentScheduleFormService.validateForm(formData);
        expect(errors.contractDuration).toBe(
          'errors.contractDuration.consistency'
        );
      });
    });
  });

  describe('isFormValid', () => {
    const validFormData: PaymentScheduleFormData = {
      periodicity: '3',
      contractDuration: '48',
      assetAmount: '150000',
      purchaseOptionAmount: '1500',
      firstPaymentDate: '17/09/2025',
      rentAmount: '10000',
    };

    it('should return true for valid form with no errors', () => {
      const isValid = PaymentScheduleFormService.isFormValid(validFormData, {});
      expect(isValid).toBe(true);
    });

    it('should return false when there are errors', () => {
      const errors = { contractDuration: 'errors.contractDuration.required' };
      const isValid = PaymentScheduleFormService.isFormValid(
        validFormData,
        errors
      );
      expect(isValid).toBe(false);
    });

    it('should return false when contractDuration is empty', () => {
      const formData = { ...validFormData, contractDuration: '' };
      const isValid = PaymentScheduleFormService.isFormValid(formData, {});
      expect(isValid).toBe(false);
    });

    it('should return false when assetAmount is empty', () => {
      const formData = { ...validFormData, assetAmount: '' };
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
        periodicity: '3',
        contractDuration: '48',
        assetAmount: '150000',
        purchaseOptionAmount: '1500',
        firstPaymentDate: '17/09/2025',
        rentAmount: '10000',
      };

      const request = PaymentScheduleFormService.transformToRequest(formData);

      expect(request).toEqual({
        marginalDebtRate: undefined,
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
        periodicity: '1',
        contractDuration: '24',
        assetAmount: '50000',
        purchaseOptionAmount: '500',
        firstPaymentDate: '01/01/2024',
        rentAmount: '2000',
      };

      const request = PaymentScheduleFormService.transformToRequest(formData);
      expect(request.periodicity).toBe(1);
    });

    it('should transform Semestriel periodicity correctly', () => {
      const formData: PaymentScheduleFormData = {
        periodicity: '6',
        contractDuration: '24',
        assetAmount: '50000',
        purchaseOptionAmount: '500',
        firstPaymentDate: '01/01/2024',
        rentAmount: '2000',
      };

      const request = PaymentScheduleFormService.transformToRequest(formData);
      expect(request.periodicity).toBe(6);
    });

    it('should transform Annuel periodicity correctly', () => {
      const formData: PaymentScheduleFormData = {
        periodicity: '12',
        contractDuration: '24',
        assetAmount: '50000',
        purchaseOptionAmount: '500',
        firstPaymentDate: '01/01/2024',
        rentAmount: '2000',
      };

      const request = PaymentScheduleFormService.transformToRequest(formData);
      expect(request.periodicity).toBe(12);
    });

    it('should handle decimal values correctly', () => {
      const formData: PaymentScheduleFormData = {
        periodicity: '3',
        contractDuration: '48',
        assetAmount: '150000.50',
        purchaseOptionAmount: '1500.75',
        firstPaymentDate: '17/09/2025',
        rentAmount: '10000.25',
      };

      const request = PaymentScheduleFormService.transformToRequest(formData);

      expect(request.assetAmount).toBe(150000.5);
      expect(request.purchaseOptionAmount).toBe(1500.75);
      expect(request.rentAmount).toBe(10000.25);
    });
  });
});
