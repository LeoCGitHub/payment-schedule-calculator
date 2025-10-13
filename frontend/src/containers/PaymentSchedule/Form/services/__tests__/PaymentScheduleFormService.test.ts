import { describe, it, expect } from 'vitest';
import { PaymentScheduleFormService } from '../PaymentScheduleFormService';
import { PaymentScheduleFormData } from '../../types/PaymentScheduleFormData';

describe('PaymentScheduleFormService', () => {
  describe('validateField', () => {
    it('should validate contractDuration field', () => {
      expect(
        PaymentScheduleFormService.validateField('contractDuration', '')
      ).toBe('Contract duration is required');
      expect(
        PaymentScheduleFormService.validateField('contractDuration', '0')
      ).toBe('Contract duration is required');
      expect(
        PaymentScheduleFormService.validateField('contractDuration', '-5')
      ).toBe('Contract duration is required');
      expect(
        PaymentScheduleFormService.validateField('contractDuration', '12')
      ).toBeUndefined();
    });

    it('should validate assetAmount field', () => {
      expect(PaymentScheduleFormService.validateField('assetAmount', '')).toBe(
        'Asset value must be greater than 0'
      );
      expect(PaymentScheduleFormService.validateField('assetAmount', '0')).toBe(
        'Asset value must be greater than 0'
      );
      expect(
        PaymentScheduleFormService.validateField('assetAmount', '-100')
      ).toBe('Asset value must be greater than 0');
      expect(
        PaymentScheduleFormService.validateField('assetAmount', '1000')
      ).toBeUndefined();
    });

    it('should validate rentAmount field', () => {
      expect(PaymentScheduleFormService.validateField('rentAmount', '')).toBe(
        'Rent amount must be greater than 0'
      );
      expect(PaymentScheduleFormService.validateField('rentAmount', '0')).toBe(
        'Rent amount must be greater than 0'
      );
      expect(
        PaymentScheduleFormService.validateField('rentAmount', '-50')
      ).toBe('Rent amount must be greater than 0');
      expect(
        PaymentScheduleFormService.validateField('rentAmount', '500')
      ).toBeUndefined();
    });

    it('should validate firstPaymentDate field', () => {
      expect(
        PaymentScheduleFormService.validateField('firstPaymentDate', '')
      ).toBe('First payment date is required');
      expect(
        PaymentScheduleFormService.validateField(
          'firstPaymentDate',
          '2024-10-13'
        )
      ).toBeUndefined();
    });

    it('should validate purchaseOptionValue field', () => {
      expect(
        PaymentScheduleFormService.validateField('purchaseOptionValue', '')
      ).toBe('Purchase option amount is required');
      expect(
        PaymentScheduleFormService.validateField('purchaseOptionValue', '1000')
      ).toBeUndefined();
    });

    it('should return undefined for unknown fields', () => {
      expect(
        PaymentScheduleFormService.validateField('unknownField', 'value')
      ).toBeUndefined();
    });

    describe('cross-field validation with formData', () => {
      const mockFormData: PaymentScheduleFormData = {
        periodicity: 'Trimestriel',
        contractDuration: '48',
        assetAmount: '150000',
        purchaseOptionValue: '1500',
        firstPaymentDate: '17/09/2025',
        rentAmount: '10000',
      };

      it('should validate contractDuration consistency with periodicity when formData is provided', () => {
        // Valid: 36 is a multiple of 3 (Trimestriel)
        expect(
          PaymentScheduleFormService.validateField(
            'contractDuration',
            '36',
            mockFormData
          )
        ).toBeUndefined();

        // Invalid: 13 is not a multiple of 3
        expect(
          PaymentScheduleFormService.validateField(
            'contractDuration',
            '13',
            mockFormData
          )
        ).toBe(
          'Contract duration must be a multiple of 3 months for Trimestriel periodicity'
        );

        // Valid with Mensuel periodicity
        const mensuelFormData = { ...mockFormData, periodicity: 'Mensuel' };
        expect(
          PaymentScheduleFormService.validateField(
            'contractDuration',
            '13',
            mensuelFormData
          )
        ).toBeUndefined();
      });

      it('should validate periodicity consistency with contractDuration when formData is provided', () => {
        // Valid: 48 is a multiple of 6 (Semestriel)
        expect(
          PaymentScheduleFormService.validateField(
            'periodicity',
            'Semestriel',
            mockFormData
          )
        ).toBeUndefined();

        // Invalid: 13 is not a multiple of 6
        const formDataWithDuration13 = {
          ...mockFormData,
          contractDuration: '13',
        };
        expect(
          PaymentScheduleFormService.validateField(
            'periodicity',
            'Semestriel',
            formDataWithDuration13
          )
        ).toBe(
          'Contract duration must be a multiple of 6 months for Semestriel periodicity'
        );
      });

      it('should validate contractDuration without formData (backward compatibility)', () => {
        // Should still work without formData for basic validation
        expect(
          PaymentScheduleFormService.validateField('contractDuration', '12')
        ).toBeUndefined();
        expect(
          PaymentScheduleFormService.validateField('contractDuration', '0')
        ).toBe('Contract duration is required');
      });

      it('should validate periodicity changes with all periodicity types', () => {
        // Annuel (12 months) - 36 is valid
        expect(
          PaymentScheduleFormService.validateField(
            'periodicity',
            'Annuel',
            mockFormData
          )
        ).toBeUndefined();

        // Annuel (12 months) - 13 is invalid
        const formDataWith13 = { ...mockFormData, contractDuration: '13' };
        expect(
          PaymentScheduleFormService.validateField(
            'periodicity',
            'Annuel',
            formDataWith13
          )
        ).toBe(
          'Contract duration must be a multiple of 12 months for Annuel periodicity'
        );
      });
    });
  });

  describe('validateForm', () => {
    const validFormData: PaymentScheduleFormData = {
      periodicity: 'Trimestriel',
      contractDuration: '48',
      assetAmount: '150000',
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

    it('should return error when assetAmount is empty', () => {
      const formData = { ...validFormData, assetAmount: '' };
      const errors = PaymentScheduleFormService.validateForm(formData);
      expect(errors.assetAmount).toBe('Asset value must be greater than 0');
    });

    it('should return error when assetAmount is zero', () => {
      const formData = { ...validFormData, assetAmount: '0' };
      const errors = PaymentScheduleFormService.validateForm(formData);
      expect(errors.assetAmount).toBe('Asset value must be greater than 0');
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
      expect(errors.purchaseOptionValue).toBe(
        'Purchase option amount is required'
      );
    });

    it('should return multiple errors when multiple fields are invalid', () => {
      const formData: PaymentScheduleFormData = {
        periodicity: 'Mensuel',
        contractDuration: '',
        assetAmount: '0',
        purchaseOptionValue: '',
        firstPaymentDate: '',
        rentAmount: '-100',
      };
      const errors = PaymentScheduleFormService.validateForm(formData);

      expect(errors.contractDuration).toBe('Contract duration is required');
      expect(errors.assetAmount).toBe('Asset value must be greater than 0');
      expect(errors.rentAmount).toBe('Rent amount must be greater than 0');
      expect(errors.firstPaymentDate).toBe('First payment date is required');
      expect(errors.purchaseOptionValue).toBe(
        'Purchase option amount is required'
      );
    });

    describe('duration and periodicity consistency validation', () => {
      it('should return error when duration is not a multiple of Mensuel periodicity (1 month)', () => {
        // Mensuel = 1 month, so any positive duration should be valid
        const formData = {
          ...validFormData,
          periodicity: 'Mensuel',
          contractDuration: '13',
        };
        const errors = PaymentScheduleFormService.validateForm(formData);
        expect(errors.contractDuration).toBeUndefined();
      });

      it('should return error when duration is not a multiple of Trimestriel periodicity (3 months)', () => {
        const formData = {
          ...validFormData,
          periodicity: 'Trimestriel',
          contractDuration: '13',
        };
        const errors = PaymentScheduleFormService.validateForm(formData);
        expect(errors.contractDuration).toBe(
          'Contract duration must be a multiple of 3 months for Trimestriel periodicity'
        );
      });

      it('should accept valid duration for Trimestriel periodicity', () => {
        const formData = {
          ...validFormData,
          periodicity: 'Trimestriel',
          contractDuration: '36',
        };
        const errors = PaymentScheduleFormService.validateForm(formData);
        expect(errors.contractDuration).toBeUndefined();
      });

      it('should return error when duration is not a multiple of Semestriel periodicity (6 months)', () => {
        const formData = {
          ...validFormData,
          periodicity: 'Semestriel',
          contractDuration: '13',
        };
        const errors = PaymentScheduleFormService.validateForm(formData);
        expect(errors.contractDuration).toBe(
          'Contract duration must be a multiple of 6 months for Semestriel periodicity'
        );
      });

      it('should accept valid duration for Semestriel periodicity', () => {
        const formData = {
          ...validFormData,
          periodicity: 'Semestriel',
          contractDuration: '24',
        };
        const errors = PaymentScheduleFormService.validateForm(formData);
        expect(errors.contractDuration).toBeUndefined();
      });

      it('should return error when duration is not a multiple of Annuel periodicity (12 months)', () => {
        const formData = {
          ...validFormData,
          periodicity: 'Annuel',
          contractDuration: '13',
        };
        const errors = PaymentScheduleFormService.validateForm(formData);
        expect(errors.contractDuration).toBe(
          'Contract duration must be a multiple of 12 months for Annuel periodicity'
        );
      });

      it('should accept valid duration for Annuel periodicity', () => {
        const formData = {
          ...validFormData,
          periodicity: 'Annuel',
          contractDuration: '36',
        };
        const errors = PaymentScheduleFormService.validateForm(formData);
        expect(errors.contractDuration).toBeUndefined();
      });

      it('should check consistency even with edge case durations', () => {
        // 7 is not a multiple of 3 (Trimestriel)
        const formData = {
          ...validFormData,
          periodicity: 'Trimestriel',
          contractDuration: '7',
        };
        const errors = PaymentScheduleFormService.validateForm(formData);
        expect(errors.contractDuration).toBe(
          'Contract duration must be a multiple of 3 months for Trimestriel periodicity'
        );
      });
    });
  });

  describe('isFormValid', () => {
    const validFormData: PaymentScheduleFormData = {
      periodicity: 'Trimestriel',
      contractDuration: '48',
      assetAmount: '150000',
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
        periodicity: 'Trimestriel',
        contractDuration: '48',
        assetAmount: '150000',
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
        assetAmount: '50000',
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
        assetAmount: '50000',
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
        assetAmount: '50000',
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
        assetAmount: '50000',
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
        assetAmount: '150000.50',
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
        assetAmount: '150000',
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
