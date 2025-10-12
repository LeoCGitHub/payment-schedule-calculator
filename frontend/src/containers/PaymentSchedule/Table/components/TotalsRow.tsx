import { PaymentScheduleTotals } from '@/types/payment-schedule/response/PaymentScheduleTotals';
import { formatCurrency } from '@/utils/formatter/NumberFormatter';
import TableCell from '@/components/Table/TableCell/TableCell';
import { TABLE_LABELS } from '../constants/tableConfig';

interface TotalsRowProps {
  totals: PaymentScheduleTotals;
}

export default function TotalsRow({
  totals,
}: TotalsRowProps): React.JSX.Element {
  return (
    <tr className="totals-row">
      <TableCell colSpan={2} className="totals-row-value highlight">
        {TABLE_LABELS.total}
      </TableCell>
      <TableCell className="amount totals-row-value highlight">
        {formatCurrency(totals.totalAmount)}
      </TableCell>
      <TableCell className="amount">{TABLE_LABELS.emptyCell}</TableCell>
      <TableCell className="amount">{TABLE_LABELS.emptyCell}</TableCell>
      <TableCell className="amount totals-row-value highlight">
        {formatCurrency(totals.totalInterestAmount)}
      </TableCell>
      <TableCell className="amount totals-row-value highlight">
        {formatCurrency(totals.totalRepaymentAmount)}
      </TableCell>
      <TableCell className="amount">{TABLE_LABELS.emptyCell}</TableCell>
      <TableCell className="amount">{TABLE_LABELS.emptyCell}</TableCell>
      <TableCell className="amount totals-row-value highlight">
        {formatCurrency(totals.totalActualizedCashFlowsAmount)}
      </TableCell>
    </tr>
  );
}
