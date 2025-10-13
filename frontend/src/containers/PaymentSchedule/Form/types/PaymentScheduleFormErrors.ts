export interface PaymentScheduleFormErrors {
  [key: string]: string | undefined;
  periodicity?: string;
  contractDuration?: string;
  assetAmount?: string;
  rentAmount?: string;
  firstPaymentDate?: string;
}
