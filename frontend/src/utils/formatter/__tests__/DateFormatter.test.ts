import { describe, it, expect } from 'vitest';
import { formatDateShort } from '../DateFormatter';

describe('DateFormatter', () => {
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
});
