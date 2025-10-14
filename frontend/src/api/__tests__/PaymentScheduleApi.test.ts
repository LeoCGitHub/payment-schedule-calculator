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
      paymentScheduleLines: [],
      paymentScheduleTotals: {
        totalAmount: 480000,
        totalActualizedCashFlowsAmount: 148500,
        totalInterestAmount: 331500,
        totalRepaymentAmount: 480000,
      },
      purchaseOptionTotals: {
        purchaseOptionAmount: 1500,
        actualizedPurchaseOptionAmount: 1500,
      },
    };

    it('should successfully calculate payment schedule', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => mockResponse,
      } as unknown as Response);

      const result =
        await paymentScheduleApiService.calculateSchedule(mockRequest);

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

    it('should use correct API endpoint', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => mockResponse,
      } as unknown as Response);

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

      await expect(
        paymentScheduleApiService.calculateSchedule(mockRequest)
      ).rejects.toThrow('Error during calculating: 400 Bad Request');
    });

    it('should throw error on 500 Internal Server Error', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      } as Response);

      await expect(
        paymentScheduleApiService.calculateSchedule(mockRequest)
      ).rejects.toThrow('Error during calculating: 500 Internal Server Error');
    });

    it('should throw error on 404 Not Found', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      } as Response);

      await expect(
        paymentScheduleApiService.calculateSchedule(mockRequest)
      ).rejects.toThrow('Error during calculating: 404 Not Found');
    });

    it('should handle network errors', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      await expect(
        paymentScheduleApiService.calculateSchedule(mockRequest)
      ).rejects.toThrow('Network error');
    });

    it('should handle empty response lines', async () => {
      const emptyResponse: PaymentScheduleResponse = {
        paymentScheduleLines: [],
        paymentScheduleTotals: {
          totalAmount: 0,
          totalActualizedCashFlowsAmount: 0,
          totalInterestAmount: 0,
          totalRepaymentAmount: 0,
        },
        purchaseOptionTotals: {
          purchaseOptionAmount: 0,
          actualizedPurchaseOptionAmount: 0,
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => emptyResponse,
      } as unknown as Response);

      const result =
        await paymentScheduleApiService.calculateSchedule(mockRequest);

      expect(result.paymentScheduleLines).toEqual([]);
      expect(result.paymentScheduleTotals.totalAmount).toBe(0);
    });
  });
});
