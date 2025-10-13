import { describe, it, expect, vi, beforeEach } from 'vitest';
import { paymentScheduleApiService } from '../PaymentScheduleApi';
import { PaymentScheduleRequest } from '@/types/payment-schedule/request/PaymentScheduleRequest';
import { PaymentScheduleResponse } from '@/types/payment-schedule/response/PaymentScheduleResponse';

describe('PaymentScheduleApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('calculateSchedule', () => {
    const mockRequest: PaymentScheduleRequest = {
      periodicity: 3,
      contractDuration: 48,
      assetAmount: 150000,
      purchaseOptionAmount: 1500,
      firstPaymentDate: '17/09/2025',
      rentAmount: 10000,
    };

    const mockResponse: PaymentScheduleResponse = {
      lines: [],
      totals: {
        totalRent: 480000,
        totalDepreciation: 148500,
        totalFinancialExpenses: 331500,
        totalInvoicedExclTax: 480000,
        totalInvoicedInclTax: 576000,
      },
      purchaseOptionTotals: {
        totalPurchaseOption: 1500,
        totalPurchaseOptionDepreciation: 1500,
        totalPurchaseOptionInclTax: 1800,
      },
    };

    it('should successfully calculate payment schedule', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await paymentScheduleApiService.calculateSchedule(mockRequest);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/payment-schedule/calculate'),
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mockRequest),
        })
      );

      expect(result).toEqual(mockResponse);
    });

    it('should send correct request body', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await paymentScheduleApiService.calculateSchedule(mockRequest);

      const fetchCall = (global.fetch as any).mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1].body);

      expect(requestBody).toEqual({
        periodicity: 3,
        contractDuration: 48,
        assetAmount: 150000,
        purchaseOptionAmount: 1500,
        firstPaymentDate: '17/09/2025',
        rentAmount: 10000,
      });
    });

    it('should use correct API endpoint', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await paymentScheduleApiService.calculateSchedule(mockRequest);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/payment-schedule/calculate'),
        expect.any(Object)
      );
    });

    it('should throw error when response is not ok', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
      } as Response);

      await expect(paymentScheduleApiService.calculateSchedule(mockRequest)).rejects.toThrow(
        'Error during calculating: 400 Bad Request'
      );
    });

    it('should throw error on 500 Internal Server Error', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      } as Response);

      await expect(paymentScheduleApiService.calculateSchedule(mockRequest)).rejects.toThrow(
        'Error during calculating: 500 Internal Server Error'
      );
    });

    it('should throw error on 404 Not Found', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      } as Response);

      await expect(paymentScheduleApiService.calculateSchedule(mockRequest)).rejects.toThrow(
        'Error during calculating: 404 Not Found'
      );
    });

    it('should handle network errors', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      await expect(paymentScheduleApiService.calculateSchedule(mockRequest)).rejects.toThrow(
        'Network error'
      );
    });

    it('should set correct content-type header', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await paymentScheduleApiService.calculateSchedule(mockRequest);

      const fetchCall = (global.fetch as any).mock.calls[0];
      const headers = fetchCall[1].headers;

      expect(headers['Content-Type']).toBe('application/json');
    });

    it('should handle empty response lines', async () => {
      const emptyResponse: PaymentScheduleResponse = {
        lines: [],
        totals: {
          totalRent: 0,
          totalDepreciation: 0,
          totalFinancialExpenses: 0,
          totalInvoicedExclTax: 0,
          totalInvoicedInclTax: 0,
        },
        purchaseOptionTotals: {
          totalPurchaseOption: 0,
          totalPurchaseOptionDepreciation: 0,
          totalPurchaseOptionInclTax: 0,
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => emptyResponse,
      } as Response);

      const result = await paymentScheduleApiService.calculateSchedule(mockRequest);

      expect(result.lines).toEqual([]);
      expect(result.totals.totalRent).toBe(0);
    });
  });
});
