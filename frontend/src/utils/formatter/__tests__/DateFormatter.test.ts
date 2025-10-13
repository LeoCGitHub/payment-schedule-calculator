import { describe, it, expect } from 'vitest';
import { formatDate, convertToISO, convertToFrench } from '../DateFormatter';

describe('DateFormatter', () => {
  describe('formatDate', () => {
    it('should format ISO date to French long format', () => {
      const result = formatDate('2024-10-13');
      expect(result).toBe('13 octobre 2024');
    });

    it('should format ISO datetime to French long format', () => {
      const result = formatDate('2024-01-01T00:00:00');
      expect(result).toBe('1 janvier 2024');
    });

    it('should handle different months', () => {
      const result = formatDate('2024-12-25');
      expect(result).toBe('25 décembre 2024');
    });
  });

  describe('convertToISO', () => {
    it('should convert French date format to ISO format', () => {
      const result = convertToISO('13/10/2024');
      expect(result).toBe('2024-10-13');
    });

    it('should return empty string for empty input', () => {
      const result = convertToISO('');
      expect(result).toBe('');
    });

    it('should return same value if already in ISO format', () => {
      const result = convertToISO('2024-10-13');
      expect(result).toBe('2024-10-13');
    });

    it('should pad single digit day and month', () => {
      const result = convertToISO('5/3/2024');
      expect(result).toBe('2024-03-05');
    });

    it('should handle dates with double digit day and month', () => {
      const result = convertToISO('25/12/2024');
      expect(result).toBe('2024-12-25');
    });
  });

  describe('convertToFrench', () => {
    it('should convert ISO format to French date format', () => {
      const result = convertToFrench('2024-10-13');
      expect(result).toBe('13/10/2024');
    });

    it('should return empty string for empty input', () => {
      const result = convertToFrench('');
      expect(result).toBe('');
    });

    it('should return same value if already in French format', () => {
      const result = convertToFrench('13/10/2024');
      expect(result).toBe('13/10/2024');
    });

    it('should handle dates with single digits', () => {
      const result = convertToFrench('2024-03-05');
      expect(result).toBe('05/03/2024');
    });

    it('should handle end of year dates', () => {
      const result = convertToFrench('2024-12-31');
      expect(result).toBe('31/12/2024');
    });
  });
});
