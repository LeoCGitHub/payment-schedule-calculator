export interface PaymentScheduleFormData {
  periodicity: string;
  contractDuration: string;
  assetAmount: string;
  purchaseOptionAmount: string;
  firstPaymentDate: string;
  rentAmount: string;
  marginalDebtRate?: string;
}
