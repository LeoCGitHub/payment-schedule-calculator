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

// Map i18next language code to locale
const getLocale = (language: string): string => {
  return language === 'en' ? 'en-US' : 'fr-FR';
};

export default function PaymentScheduleRow({
  line,
  IBRNeeded,
}: PaymentScheduleRowProps): React.JSX.Element {
  const { i18n } = useTranslation();
  const locale = getLocale(i18n.language);

  return (
    <tr>
      <TableCell>{line.period}</TableCell>
      <TableCell>{formatDateShort(line.dueDate, locale)}</TableCell>
      <TableCell className="amount">
        {formatCurrency(line.rentAmount, locale)}
      </TableCell>
      <TableCell className="amount">
        {formatPercentage(line.periodRate, locale)}
      </TableCell>
      <TableCell className="amount">
        {formatPercentage(line.annualReferenceRate, locale)}
      </TableCell>
      <TableCell className="amount interest">
        {formatCurrency(line.financialInterestAmount, locale)}
      </TableCell>
      <TableCell className="amount">
        {formatCurrency(line.amortizedAmount, locale)}
      </TableCell>
      <TableCell className="amount">
        {formatCurrency(line.debtBeginningPeriodAmount, locale)}
      </TableCell>
      <TableCell className="amount balance">
        {formatCurrency(line.debtEndPeriodAmount, locale)}
      </TableCell>
      <TableCell className="amount">
        {formatCurrency(line.actualizedCashFlowAmount, locale)}
      </TableCell>
      {IBRNeeded ? (
        <TableCell className="amount">
          {formatCurrency(line.linearAmortizationAmount, locale)}
        </TableCell>
      ) : null}
      {IBRNeeded ? (
        <TableCell className="amount">
          {formatCurrency(line.ifrs16Expense, locale)}
        </TableCell>
      ) : null}
    </tr>
  );
}
