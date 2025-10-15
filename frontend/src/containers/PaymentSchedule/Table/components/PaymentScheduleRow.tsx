import { PaymentScheduleLine } from '@/types/payment-schedule/response/PaymentScheduleLine';
import { useTranslation } from 'react-i18next';
import {
  formatCurrency,
  formatPercentage,
} from '@/utils/formatter/NumberFormatter';
import { formatDateShort } from '@/utils/formatter/DateFormatter';
import TableCell from '@/components/Table/TableCell/TableCell';

interface PaymentScheduleRowProps {
  line: PaymentScheduleLine;
  IBRNeeded: boolean;
}

const getLocale = (language: string): string => {
  return language === 'en' ? 'en-US' : 'fr-FR';
};

export default function PaymentScheduleRow({
  line,
  IBRNeeded,
}: PaymentScheduleRowProps): React.JSX.Element {
  const { i18n } = useTranslation();
  const locale = getLocale(i18n.language);

  const cellConfig = [
    { content: line.period, type: 'number', className: '', condition: true },
    { content: line.dueDate, type: 'date', className: '', condition: true },
    {
      content: line.rentAmount,
      type: 'currency',
      className: 'amount',
      condition: true,
    },
    {
      content: line.periodRate,
      type: 'percentage',
      className: 'amount',
      condition: true,
    },
    {
      content: line.annualReferenceRate,
      type: 'percentage',
      className: 'amount',
      condition: true,
    },
    {
      content: line.financialInterestAmount,
      type: 'currency',
      className: 'amount interest',
      condition: true,
    },
    {
      content: line.amortizedAmount,
      type: 'currency',
      className: 'amount',
      condition: true,
    },
    {
      content: line.debtBeginningPeriodAmount,
      type: 'currency',
      className: 'amount',
      condition: true,
    },
    {
      content: line.debtEndPeriodAmount,
      type: 'currency',
      className: 'amount balance',
      condition: true,
    },
    {
      content: line.actualizedCashFlowAmount,
      type: 'currency',
      className: 'amount',
      condition: true,
    },
    {
      content: line.linearAmortizationAmount,
      type: 'currency',
      className: 'amount',
      condition: IBRNeeded,
    },
    {
      content: line.ifrs16Expense,
      type: 'currency',
      className: 'amount',
      condition: IBRNeeded,
    },
  ];

  const renderCellContent = (cell: (typeof cellConfig)[0]) => {
    switch (cell.type) {
      case 'currency':
        return formatCurrency(cell.content as number, locale);
      case 'percentage':
        return formatPercentage(cell.content as number, locale);
      case 'date':
        return formatDateShort(cell.content as string, locale);
      default:
        return cell.content;
    }
  };

  return (
    <tr>
      {cellConfig
        .filter(cell => cell.condition)
        .map((cell, index) => (
          <TableCell key={index} className={cell.className}>
            {renderCellContent(cell)}
          </TableCell>
        ))}
    </tr>
  );
}
