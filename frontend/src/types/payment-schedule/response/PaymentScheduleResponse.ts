import { PaymentScheduleLine } from './PaymentScheduleLine';
import { PaymentScheduleTotals } from './PaymentScheduleTotals';
import { PurchaseOptionTotals } from './PurchaseOptionsTotals';

export interface PaymentScheduleResponse {
  paymentScheduleLines: PaymentScheduleLine[];
  paymentScheduleTotals: PaymentScheduleTotals;
  purchaseOptionTotals: PurchaseOptionTotals;
  ibrNeeded: boolean;
}
