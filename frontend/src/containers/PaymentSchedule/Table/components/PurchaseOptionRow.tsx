import React from 'react';
import { PurchaseOptionTotals } from '@/types/payment-schedule/response/PurchaseOptionsTotals';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@/utils/formatter/NumberFormatter';
import TableCell from '@/components/Table/TableCell/TableCell';

interface PurchaseOptionRowProps {
  purchaseOptionTotals: PurchaseOptionTotals;
  IBRNeeded: boolean;
}

const getLocale = (language: string): string => {
  return language === 'en' ? 'en-US' : 'fr-FR';
};

export default function PurchaseOptionRow({
  purchaseOptionTotals,
  IBRNeeded,
}: PurchaseOptionRowProps): React.JSX.Element {
  const { t, i18n } = useTranslation();
  const locale = getLocale(i18n.language);

  const purchaseOptionCellsConfig = [
    {
      content: t('table.purchaseOption'),
      type: 'text',
      colSpan: 2,
      className: 'purchase-option-label',
      isCurrency: false,
      condition: true,
    },
    {
      content: purchaseOptionTotals.purchaseOptionAmount,
      type: 'currency',
      className: 'amount',
      isCurrency: true,
      condition: true,
    },
    {
      content: t('table.emptyCell'),
      className: 'amount',
      isCurrency: false,
      condition: true,
    },
    {
      content: t('table.emptyCell'),
      className: 'amount',
      isCurrency: false,
      condition: true,
    },
    {
      content: t('table.emptyCell'),
      className: 'amount',
      isCurrency: false,
      condition: true,
    },
    {
      content: purchaseOptionTotals.purchaseOptionAmount,
      type: 'currency',
      className: 'amount',
      isCurrency: true,
      condition: true,
    },
    {
      content: t('table.emptyCell'),
      className: 'amount',
      isCurrency: false,
      condition: true,
    },
    {
      content: t('table.emptyCell'),
      className: 'amount',
      isCurrency: false,
      condition: true,
    },
    {
      content: purchaseOptionTotals.actualizedPurchaseOptionAmount,
      type: 'currency',
      className: 'amount',
      isCurrency: true,
      condition: true,
    },
    {
      content: t('table.emptyCell'),
      className: 'amount',
      isCurrency: false,
      condition: IBRNeeded,
    },
    {
      content: t('table.emptyCell'),
      className: 'amount',
      isCurrency: false,
      condition: IBRNeeded,
    },
  ];

  const renderCellContent = (cell: (typeof purchaseOptionCellsConfig)[0]) => {
    if (cell.isCurrency) {
      return formatCurrency(cell.content as number, locale);
    }
    return cell.content;
  };

  return (
    <tr className="purchase-option-line">
      {purchaseOptionCellsConfig
        .filter(cell => cell.condition)
        .map((cell, index) => (
          <TableCell
            key={index}
            colSpan={cell.colSpan}
            className={`${cell.className || ''}`}
          >
            {renderCellContent(cell)}
          </TableCell>
        ))}
    </tr>
  );
}
