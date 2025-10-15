import { PaymentScheduleRequest } from '@/types/payment-schedule/request/PaymentScheduleRequest';
import { PaymentScheduleResponse } from '@/types/payment-schedule/response/PaymentScheduleResponse';

const API_BASE_URL: string = import.meta.env.VITE_API_URL as string;

export const paymentScheduleApiService = {
  calculateSchedule: async (
    request: PaymentScheduleRequest
  ): Promise<PaymentScheduleResponse> => {
    const response = await fetch(`${API_BASE_URL}/payment-schedule/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(
        `Error during calculating: ${response.status} ${response.statusText}`
      );
    }

    return response.json() as Promise<PaymentScheduleResponse>;
  },
};
