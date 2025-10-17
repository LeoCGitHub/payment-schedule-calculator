import React from 'react';
import { PaymentScheduleTotals } from '@/types/payment-schedule/response/PaymentScheduleTotals';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@/utils/formatter/NumberFormatter';
import TableCell from '@/components/Table/TableCell/TableCell';

interface TotalsRowProps {
  totals: PaymentScheduleTotals;
  IBRNeeded: boolean;
}

// Map i18next language code to standard locale format (rendu plus robuste)
const getLocale = (language: string): string => {
  return language === 'en' ? 'en-US' : 'fr-FR';
};

export default function TotalsRow({
  totals,
  IBRNeeded,
}: TotalsRowProps): React.JSX.Element {
  const { t, i18n } = useTranslation();
  const locale = getLocale(i18n.language);

  const totalCellsConfig = [
    {
      content: t('table.total'),
      type: 'text',
      colSpan: 2,
      className: 'highlight',
      isCurrency: false,
      condition: true,
    },
    {
      content: totals.totalAmount,
      type: 'currency',
      className: 'highlight amount',
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
      content: totals.totalInterestAmount,
      type: 'currency',
      className: 'highlight amount',
      isCurrency: true,
      condition: true,
    },
    {
      content: totals.totalAmortizedAmount,
      type: 'currency',
      className: 'highlight amount',
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
      content: totals.totalActualizedCashFlowsAmount,
      type: 'currency',
      className: 'highlight amount',
      isCurrency: true,
      condition: true,
    },
    {
      content: totals.totalLinearAmortizedAmount,
      type: 'currency',
      className: 'highlight amount',
      isCurrency: true,
      condition: IBRNeeded,
    },
    {
      content: totals.totalIsfsr16Charge,
      type: 'currency',
      className: 'highlight amount',
      isCurrency: true,
      condition: IBRNeeded,
    },
  ];

  const renderCellContent = (cell: (typeof totalCellsConfig)[0]) => {
    if (cell.isCurrency) {
      return formatCurrency(cell.content as number, locale);
    }

    return cell.content;
  };

  return (
    <tr className="totals-row-line">
      {totalCellsConfig
        .filter(cell => cell.condition)
        .map((cell, index) => (
          <TableCell
            key={index}
            colSpan={cell.colSpan}
            className={`totals-row-value ${cell.className || ''}`}
          >
            {renderCellContent(cell)}
          </TableCell>
        ))}
    </tr>
  );
}
