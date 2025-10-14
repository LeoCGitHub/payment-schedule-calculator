import { TFunction } from 'i18next';
import { describe, expect, test } from 'vitest';
import { translateError } from '../translateError';

interface ConsistencyOptions {
  periodicity: string;
  months: string;
}

const mockT_implementation = (key: string, options?: unknown): string => {
  if (!options) {
    return `[${key}]`;
  }

  if (key === 'errors.contractDuration.consistency') {
    const consistencyOptions = options as ConsistencyOptions;

    return `[${key}: ${consistencyOptions.periodicity}, ${consistencyOptions.months} mois]`;
  }

  if (key.startsWith('form.periodicity.')) {
    return `[Périodicité: ${key.split('.').pop()}]`;
  }

  return `[${key}]`;
};

export const mockT = mockT_implementation as TFunction;

describe('translateError', () => {
  test('should translate "Contract duration is required" correctly', () => {
    const error = 'Contract duration is required';
    const expected = '[errors.contractDuration.required]';
    expect(translateError(error, mockT)).toBe(expected);
  });

  test('should translate "Asset value must be greater than 0" correctly', () => {
    const error = 'Asset value must be greater than 0';
    const expected = '[errors.assetAmount.required]';
    expect(translateError(error, mockT)).toBe(expected);
  });

  test('should translate "Asset amount must be greater than Rent amount" correctly', () => {
    const error = 'Asset amount must be greater than Rent amount';
    const expected = '[errors.assetAmount.consistency]';
    expect(translateError(error, mockT)).toBe(expected);
  });

  test('should translate "Rent amount must be greater than 0" correctly', () => {
    const error = 'Rent amount must be greater than 0';
    const expected = '[errors.rentAmount.required]';
    expect(translateError(error, mockT)).toBe(expected);
  });

  test('should translate "Rent amount must be lower than Asset amount" correctly', () => {
    const error = 'Rent amount must be lower than Asset amount';
    const expected = '[errors.rentAmount.consistency]';
    expect(translateError(error, mockT)).toBe(expected);
  });

  test('should translate "First payment date is required" correctly', () => {
    const error = 'First payment date is required';
    const expected = '[errors.firstPaymentDate.required]';
    expect(translateError(error, mockT)).toBe(expected);
  });

  test('should translate "Purchase option amount is required" correctly', () => {
    const error = 'Purchase option amount is required';
    const expected = '[errors.purchaseOptionAmount.required]';
    expect(translateError(error, mockT)).toBe(expected);
  });

  test('should translate consistency error with correct interpolation for "Quarterly"', () => {
    const error =
      'Contract duration must be a multiple of 3 months for Quarterly periodicity';
    const expected =
      '[errors.contractDuration.consistency: [form.periodicity.Quarterly], 3 mois]';

    expect(translateError(error, mockT)).toBe(expected);
  });

  test('should translate consistency error with correct interpolation for "Monthly"', () => {
    const error =
      'Contract duration must be a multiple of 1 months for Monthly periodicity';
    const expected =
      '[errors.contractDuration.consistency: [form.periodicity.Monthly], 1 mois]';

    expect(translateError(error, mockT)).toBe(expected);
  });

  test('should return the original error string if no match is found', () => {
    const error = 'Some unknown service error';
    expect(translateError(error, mockT)).toBe(error);
  });
});
