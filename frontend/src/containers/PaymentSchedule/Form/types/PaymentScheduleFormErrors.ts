export interface PaymentScheduleFormErrors {
  [key: string]: string | undefined;
  contractDuration?: string;
  assetValue?: string;
  rentAmount?: string;
  firstPaymentDate?: string;
}
