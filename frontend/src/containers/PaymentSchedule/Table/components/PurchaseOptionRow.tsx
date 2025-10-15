import { PurchaseOptionTotals } from '@/types/payment-schedule/response/PurchaseOptionsTotals';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@/utils/formatter/NumberFormatter';
import TableCell from '@/components/Table/TableCell/TableCell';

interface PurchaseOptionRowProps {
  purchaseOptionTotals: PurchaseOptionTotals;
  IBRNeeded: boolean;
}

// Map i18next language code to locale
const getLocale = (language: string): string => {
  return language === 'en' ? 'en-US' : 'fr-FR';
};

export default function PurchaseOptionRow({
  purchaseOptionTotals,
  IBRNeeded,
}: PurchaseOptionRowProps): React.JSX.Element {
  const { t, i18n } = useTranslation();
  const locale = getLocale(i18n.language);

  return (
    <tr className="purchase-option-line">
      <TableCell colSpan={2} className="purchase-option-label">
        {t('table.purchaseOption')}
      </TableCell>
      <TableCell className="amount">
        {formatCurrency(purchaseOptionTotals.purchaseOptionAmount, locale)}
      </TableCell>
      <TableCell className="amount">{t('table.emptyCell')}</TableCell>
      <TableCell className="amount">{t('table.emptyCell')}</TableCell>
      <TableCell className="amount">{t('table.emptyCell')}</TableCell>
      <TableCell className="amount">
        {formatCurrency(purchaseOptionTotals.purchaseOptionAmount, locale)}
      </TableCell>
      <TableCell className="amount">{t('table.emptyCell')}</TableCell>
      <TableCell className="amount">{t('table.emptyCell')}</TableCell>
      <TableCell className="amount">
        {formatCurrency(
          purchaseOptionTotals.actualizedPurchaseOptionAmount,
          locale
        )}
      </TableCell>
      {IBRNeeded ? (
        <TableCell className="amount">{t('table.emptyCell')}</TableCell>
      ) : null}
      {IBRNeeded ? (
        <TableCell className="amount">{t('table.emptyCell')}</TableCell>
      ) : null}
    </tr>
  );
}
