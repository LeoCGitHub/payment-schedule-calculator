import { describe, it, expect } from 'vitest';
import {
  formatDate,
  formatDateShort,
  convertToISO,
  convertFromISO,
} from '../DateFormatter';

describe('DateFormatter', () => {
  describe('formatDate (Long Format)', () => {
    describe('French Locale (fr-FR)', () => {
      it('should format ISO date (yyyy-MM-dd) to French long format', () => {
        const result = formatDate('2024-10-13');
        expect(result).toBe('13 octobre 2024');
      });

      it('should format ISO datetime to French long format', () => {
        const result = formatDate('2024-01-01T00:00:00');
        expect(result).toBe('1 janvier 2024');
      });

      it('should format short date (dd/MM/yyyy) to French long format', () => {
        const result = formatDate('25/12/2024');
        expect(result).toBe('25 décembre 2024');
      });

      it('should return empty string for nullish input', () => {
        const result = formatDate('');
        expect(result).toBe('');
      });
    });

    describe('US Locale (en-US)', () => {
      it('should format ISO date (yyyy-MM-dd) to US long format', () => {
        const result = formatDate('2024-10-13', 'en-US');
        expect(result).toBe('October 13, 2024');
      });

      it('should format short date (MM/dd/yyyy) to US long format', () => {
        const result = formatDate('10/25/2024', 'en-US');
        expect(result).toBe('October 25, 2024');
      });

      it('should correctly handle short date (dd/MM/yyyy) passed as MM/dd/yyyy in en-US', () => {
        // Teste le cas où le format passé est d'abord dd/MM/yyyy mais le locale est en-US
        const result = formatDate('03/05/2024', 'en-US');
        expect(result).toBe('March 5, 2024'); // Interprété comme MM/dd/yyyy (Mars 5)
      });
    });
  });

  describe('formatDateShort (Short Format)', () => {
    it('should return empty string for empty input', () => {
      expect(formatDateShort('')).toBe('');
    });

    describe('French Locale (fr-FR)', () => {
      it('should convert ISO date to French short format (dd/MM/yyyy)', () => {
        const result = formatDateShort('2024-10-13');
        expect(result).toBe('13/10/2024');
      });

      it('should handle already short format (dd/MM/yyyy)', () => {
        const result = formatDateShort('13/10/2024');
        expect(result).toBe('13/10/2024');
      });

      it('should convert MM/dd/yyyy to dd/MM/yyyy if day > 12', () => {
        // Si l'input est 10/25/2024 (MM/dd/yyyy), il le corrige en dd/MM/yyyy
        const result = formatDateShort('10/25/2024');
        expect(result).toBe('25/10/2024');
      });
    });

    // --- Tests pour Locale Américaine (en-US) ---
    describe('US Locale (en-US)', () => {
      it('should convert ISO date to US short format (MM/dd/yyyy)', () => {
        const result = formatDateShort('2024-03-05', 'en-US');
        expect(result).toBe('03/05/2024');
      });

      it('should handle already short format (MM/dd/yyyy)', () => {
        const result = formatDateShort('03/05/2024', 'en-US');
        expect(result).toBe('03/05/2024');
      });

      it('should convert dd/MM/yyyy to MM/dd/yyyy if day > 12', () => {
        const result = formatDateShort('25/10/2024', 'en-US');
        expect(result).toBe('10/25/2024');
      });
    });
  });

  describe('convertToISO (Short -> ISO)', () => {
    it('should return empty string for empty input', () => {
      const result = convertToISO('');
      expect(result).toBe('');
    });

    it('should return same value if already in ISO format', () => {
      const result = convertToISO('2024-10-13');
      expect(result).toBe('2024-10-13');
    });

    it('should convert French date format (dd/MM/yyyy) to ISO format', () => {
      const result = convertToISO('13/10/2024');
      expect(result).toBe('2024-10-13');
    });

    it('should pad single digit day and month (d/M/yyyy)', () => {
      const result = convertToISO('5/3/2024');
      expect(result).toBe('2024-03-05');
    });

    it('should handle dates with double digit day and month', () => {
      const result = convertToISO('25/12/2024');
      expect(result).toBe('2024-12-25');
    });
  });

  describe('convertFromISO (ISO -> Short)', () => {
    it('should return empty string for empty input', () => {
      const result = convertFromISO('');
      expect(result).toBe('');
    });

    it('should return same value if already in short format', () => {
      const result = convertFromISO('13/10/2024');
      expect(result).toBe('13/10/2024');
    });

    it('should convert ISO date to French short format (dd/MM/yyyy) by default', () => {
      const result = convertFromISO('2024-10-13');
      expect(result).toBe('13/10/2024');
    });

    it('should convert ISO date to US short format (MM/dd/yyyy)', () => {
      const result = convertFromISO('2024-10-13', 'en-US');
      expect(result).toBe('10/13/2024');
    });
  });
});
