export interface PaymentScheduleRequest {
  amount: number;
  interestRate: number;
  numberOfPayments: number;
  startDate?: string;
}

export interface Payment {
  period: number;
  dueDate: string;
  debtBeginningPeriod: number;
  newDebtPerMonth: number;
  repayment: number;
  debtEndPeriod: number;
  periodRate: number;
  financialInterest: number;
  rent: number;
  annualReferenceRate: number;
  discountedCashFlow: number;
}

export interface PaymentScheduleResponse {
  payments: Payment[];
  totalAmount: number;
  totalInterest: number;
  totalPrincipal: number;
}
