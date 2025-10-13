import { PaymentScheduleTotals } from '@/types/payment-schedule/response/PaymentScheduleTotals';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@/utils/formatter/NumberFormatter';
import TableCell from '@/components/Table/TableCell/TableCell';

interface TotalsRowProps {
  totals: PaymentScheduleTotals;
}

// Map i18next language code to locale
const getLocale = (language: string): string => {
  return language === 'en' ? 'en-US' : 'fr-FR';
};

export default function TotalsRow({
  totals,
}: TotalsRowProps): React.JSX.Element {
  const { t, i18n } = useTranslation();
  const locale = getLocale(i18n.language);

  return (
    <tr className="totals-row-line">
      <TableCell colSpan={2} className="totals-row-value highlight">
        {t('table.total')}
      </TableCell>
      <TableCell className="amount totals-row-value highlight">
        {formatCurrency(totals.totalAmount, locale)}
      </TableCell>
      <TableCell className="amount">{t('table.emptyCell')}</TableCell>
      <TableCell className="amount">{t('table.emptyCell')}</TableCell>
      <TableCell className="amount totals-row-value highlight">
        {formatCurrency(totals.totalInterestAmount, locale)}
      </TableCell>
      <TableCell className="amount totals-row-value highlight">
        {formatCurrency(totals.totalRepaymentAmount, locale)}
      </TableCell>
      <TableCell className="amount">{t('table.emptyCell')}</TableCell>
      <TableCell className="amount">{t('table.emptyCell')}</TableCell>
      <TableCell className="amount totals-row-value highlight">
        {formatCurrency(totals.totalActualizedCashFlowsAmount, locale)}
      </TableCell>
    </tr>
  );
}
