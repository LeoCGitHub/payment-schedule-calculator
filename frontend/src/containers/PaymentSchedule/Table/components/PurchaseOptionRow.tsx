import { PurchaseOptionTotals } from '@/types/payment-schedule/response/PurchaseOptionsTotals';
import { formatCurrency } from '@/utils/formatter/NumberFormatter';
import TableCell from '@/components/Table/TableCell/TableCell';
import { TABLE_LABELS } from '../constants/tableConfig';

interface PurchaseOptionRowProps {
  purchaseOptionTotals: PurchaseOptionTotals;
}

export default function PurchaseOptionRow({
  purchaseOptionTotals,
}: PurchaseOptionRowProps): React.JSX.Element {
  return (
    <tr>
      <TableCell colSpan={2}>{TABLE_LABELS.purchaseOption}</TableCell>
      <TableCell className="amount">
        {formatCurrency(purchaseOptionTotals.purchaseOptionAmount)}
      </TableCell>
      <TableCell className="amount">{TABLE_LABELS.emptyCell}</TableCell>
      <TableCell className="amount">{TABLE_LABELS.emptyCell}</TableCell>
      <TableCell className="amount">{TABLE_LABELS.emptyCell}</TableCell>
      <TableCell className="amount">
        {formatCurrency(purchaseOptionTotals.purchaseOptionAmount)}
      </TableCell>
      <TableCell className="amount">{TABLE_LABELS.emptyCell}</TableCell>
      <TableCell className="amount">{TABLE_LABELS.emptyCell}</TableCell>
      <TableCell className="amount">
        {formatCurrency(purchaseOptionTotals.actualizedPurchaseOptionAmount)}
      </TableCell>
    </tr>
  );
}
