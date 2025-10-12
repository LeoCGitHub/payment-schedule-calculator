import {
  PaymentScheduleRequest,
  PaymentScheduleResponse,
} from '../types/payment.types';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const paymentScheduleApi = {
  async calculateSchedule(
    request: PaymentScheduleRequest
  ): Promise<PaymentScheduleResponse> {
    const response = await fetch(`${API_BASE_URL}/payment-schedule/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(
        `Erreur lors du calcul: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  },
};
