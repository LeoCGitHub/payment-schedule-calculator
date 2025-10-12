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
