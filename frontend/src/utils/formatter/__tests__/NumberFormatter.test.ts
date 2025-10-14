import { describe, it, expect } from 'vitest';
import { formatCurrency, formatPercentage } from '../NumberFormatter';

describe('NumberFormatter', () => {
  describe('formatCurrency', () => {
    it('should format positive number as EUR currency', () => {
      const result = formatCurrency(1234.56);
      // Use regex to handle both space and narrow no-break space
      expect(result).toMatch(/1[\s\u202f]234,56[\s\u202f]€/);
    });

    it('should format zero as EUR currency', () => {
      const result = formatCurrency(0);
      expect(result).toMatch(/0,00[\s\u202f]€/);
    });

    it('should format negative number as EUR currency', () => {
      const result = formatCurrency(-500.75);
      expect(result).toMatch(/-500,75[\s\u202f]€/);
    });

    it('should format large numbers with thousands separator', () => {
      const result = formatCurrency(1000000.99);
      expect(result).toMatch(/1[\s\u202f]000[\s\u202f]000,99[\s\u202f]€/);
    });

    it('should round to 2 decimal places', () => {
      const result = formatCurrency(10.999);
      expect(result).toMatch(/11,00[\s\u202f]€/);
    });
  });

  describe('formatPercentage', () => {
    it('should format decimal as percentage', () => {
      const result = formatPercentage(0.1234);
      expect(result).toMatch(/12,34[\s\u202f]%/);
    });

    it('should format zero as percentage', () => {
      const result = formatPercentage(0);
      expect(result).toMatch(/0,00[\s\u202f]%/);
    });

    it('should format negative percentage', () => {
      const result = formatPercentage(-0.05);
      expect(result).toMatch(/-5,00[\s\u202f]%/);
    });

    it('should handle percentages with more than 2 decimal places', () => {
      const result = formatPercentage(0.12345);
      expect(result).toMatch(/12,345[\s\u202f]%/);
    });

    it('should limit to 4 decimal places maximum', () => {
      const result = formatPercentage(0.123456);
      expect(result).toMatch(/12,346[\s\u202f]%/);
    });

    it('should format 1 as 100%', () => {
      const result = formatPercentage(1);
      expect(result).toMatch(/100,00[\s\u202f]%/);
    });
  });
});
