export interface PaymentScheduleLine {
  period: number;
  dueDate: string;
  amortizedAmount: number;
  debtBeginningPeriodAmount: number;
  debtEndPeriodAmount: number;
  periodRate: number;
  financialInterestAmount: number;
  rentAmount: number;
  annualReferenceRate: number;
  actualizedCashFlowAmount: number;
  linearAmortizationAmount: number;
  ifrs16Expense: number;
}
