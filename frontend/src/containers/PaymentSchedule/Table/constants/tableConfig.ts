export interface TableColumn {
  key: string;
  label: string;
  className?: string;
}

export const TABLE_COLUMNS: TableColumn[] = [
  { key: 'period', label: 'Période' },
  { key: 'dueDate', label: "Date d'échéance" },
  { key: 'rentAmount', label: 'Loyer' },
  { key: 'periodRate', label: 'Taux' },
  { key: 'annualReferenceRate', label: 'Taux annuel' },
  { key: 'financialInterestAmount', label: 'Intérêts financiers' },
  { key: 'repaymentAmount', label: 'Remboursement' },
  { key: 'debtBeginningPeriodAmount', label: 'Dette début période' },
  { key: 'debtEndPeriodAmount', label: 'Dette fin période' },
  { key: 'actualizedCashFlowAmount', label: 'Flux actualisés' },
];

export const TABLE_LABELS = {
  purchaseOption: "Option d'achat",
  total: 'Total',
  emptyCell: '-',
} as const;
