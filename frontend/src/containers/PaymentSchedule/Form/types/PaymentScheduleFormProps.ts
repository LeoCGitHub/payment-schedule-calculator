import { PaymentScheduleRequest } from '@/types/payment-schedule/request/PaymentScheduleRequest';
import { PaymentScheduleFormData } from './PaymentScheduleFormData';

export interface PaymentScheduleFormProps {
  onSubmit: (request: PaymentScheduleRequest) => Promise<void>;
  loading: boolean;
  initialData?: PaymentScheduleFormData;
  onDataChange?: (data: PaymentScheduleFormData) => void;
  rateNegativ?: boolean;
  onReset: () => void;
}
