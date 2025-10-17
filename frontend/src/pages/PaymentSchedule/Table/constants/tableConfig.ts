export interface TableColumn {
  key: string;
  className?: string;
}
export const IRR_COLUMNS: TableColumn[] = [
  { key: 'period' },
  { key: 'dueDate' },
  { key: 'rentAmount' },
  { key: 'periodRate' },
  { key: 'annualReferenceRate' },
  { key: 'financialInterestAmount' },
  { key: 'amortizedAmount' },
  { key: 'debtBeginningPeriodAmount' },
  { key: 'debtEndPeriodAmount' },
  { key: 'actualizedCashFlowAmount' },
];

export const IBR_COLUMNS: TableColumn[] = [
  { key: 'linearAmortizationAmount' },
  { key: 'ifrs16Expense' },
];
