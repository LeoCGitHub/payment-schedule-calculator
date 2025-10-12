export interface PaymentScheduleLine {
  period: number;
  dueDate: string;
  repaymentAmount: number;
  debtBeginningPeriodAmount: number;
  debtEndPeriodAmount: number;
  periodRate: number;
  financialInterestAmount: number;
  rentAmount: number;
  annualReferenceRate: number;
  actualizedCashFlowAmount: number;
}

export interface PaymentScheduleTotals {
  totalAmount: number;
  totalInterestAmount: number;
  totalRepaymentAmount: number;
  totalActualizedCashFlowsAmount: number;
}

export interface PurchaseOptionTotals {
  purchaseOptionAmount: number;
  actualizedPurchaseOptionAmount: number;
}

export interface PaymentScheduleResponse {
  paymentScheduleLines: PaymentScheduleLine[];
  paymentScheduleTotals: PaymentScheduleTotals;
  purchaseOptionTotals: PurchaseOptionTotals;
}

export interface PaymentScheduleRequest {
  periodicity: number;
  contractDuration: number;
  assetAmount: number;
  purchaseOptionAmount: number;
  firstPaymentDate: string;
  rentAmount: number;
}

export interface FormData {
  periodicity: string;
  contractDuration: string;
  assetValue: string;
  purchaseOptionValue: string;
  firstPaymentDate: string;
  rentAmount: string;
}

export interface FormErrors {
  [key: string]: string | undefined;
  contractDuration?: string;
  assetValue?: string;
  rentAmount?: string;
  firstPaymentDate?: string;
}
