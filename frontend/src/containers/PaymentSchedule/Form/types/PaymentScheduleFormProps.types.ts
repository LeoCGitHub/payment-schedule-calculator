import { PaymentScheduleRequest } from '@/types/payment-schedule/request/PaymentScheduleRequest';
import { PaymentScheduleFormData } from './PaymentScheduleFormData.types';

export interface PaymentScheduleFormProps {
  onSubmit: (request: PaymentScheduleRequest) => void;
  loading: boolean;
  initialData?: PaymentScheduleFormData;
  onDataChange?: (data: PaymentScheduleFormData) => void;
}
