export interface PaymentScheduleRequest {
  periodicity: number;
  contractDuration: number;
  assetAmount: number;
  purchaseOptionAmount: number;
  firstPaymentDate: string;
  rentAmount: number;
  marginalDebtRate?: number;
}
