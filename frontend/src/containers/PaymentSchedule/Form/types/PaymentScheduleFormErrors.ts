export interface PaymentScheduleFormErrors {
  [key: string]: string | undefined;
  periodicity?: string;
  contractDuration?: string;
  assetValue?: string;
  rentAmount?: string;
  firstPaymentDate?: string;
}
