import { PaymentScheduleLine } from '@/types/payment-schedule/response/PaymentScheduleLine';
import {
  formatCurrency,
  formatPercentage,
} from '@/utils/formatter/NumberFormatter';
import { convertToFrench } from '@/utils/formatter/DateFormatter';
import TableCell from '@/components/Table/TableCell/TableCell';

interface PaymentScheduleRowProps {
  line: PaymentScheduleLine;
}

export default function PaymentScheduleRow({
  line,
}: PaymentScheduleRowProps): React.JSX.Element {
  return (
    <tr>
      <TableCell>{line.period}</TableCell>
      <TableCell>{convertToFrench(line.dueDate)}</TableCell>
      <TableCell className="amount">
        {formatCurrency(line.rentAmount)}
      </TableCell>
      <TableCell className="amount">
        {formatPercentage(line.periodRate)}
      </TableCell>
      <TableCell className="amount">
        {formatPercentage(line.annualReferenceRate)}
      </TableCell>
      <TableCell className="amount interest">
        {formatCurrency(line.financialInterestAmount)}
      </TableCell>
      <TableCell className="amount">
        {formatCurrency(line.repaymentAmount)}
      </TableCell>
      <TableCell className="amount">
        {formatCurrency(line.debtBeginningPeriodAmount)}
      </TableCell>
      <TableCell className="amount balance">
        {formatCurrency(line.debtEndPeriodAmount)}
      </TableCell>
      <TableCell className="amount">
        {formatCurrency(line.actualizedCashFlowAmount)}
      </TableCell>
    </tr>
  );
}
