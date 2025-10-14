export interface PaymentScheduleFormData {
  periodicity: string;
  contractDuration: string;
  assetAmount: string;
  purchaseOptionValue: string;
  firstPaymentDate: string;
  rentAmount: string;
  marginalDebtRate?: string;
}
