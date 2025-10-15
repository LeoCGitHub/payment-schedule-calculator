import { PaymentScheduleResponse } from '@/types/payment-schedule/response/PaymentScheduleResponse';
import { useTranslation } from 'react-i18next';
import './PaymentScheduleTable.scss';
import PaymentScheduleRow from './components/PaymentScheduleRow';
import PurchaseOptionRow from './components/PurchaseOptionRow';
import TotalsRow from './components/TotalsRow';
import { IBR_COLUMNS, IRR_COLUMNS, TableColumn } from './constants/tableConfig';
import PaymentScheduleWarning from './components/PaymentScheduleWarning';

export interface PaymentScheduleTableProps {
  schedule: PaymentScheduleResponse | null;
  IBRNeeded: boolean;
}

export default function PaymentScheduleTable({
  schedule,
  IBRNeeded,
}: PaymentScheduleTableProps): React.JSX.Element | null {
  const { t } = useTranslation();

  if (!schedule) {
    return null;
  }

  const finalColumns: TableColumn[] = IBRNeeded
    ? [...IRR_COLUMNS, ...IBR_COLUMNS]
    : IRR_COLUMNS;

  return (
    <div className="schedule-container">
      {IBRNeeded ? <PaymentScheduleWarning /> : null}
      <div className="schedule-table-wrapper">
        <div className="table-responsive">
          <table className="schedule-table">
            <thead>
              <tr>
                {finalColumns.map(column => (
                  <th key={column.key} className={column.className}>
                    {t(`table.headers.${column.key}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {schedule.paymentScheduleLines.map(line => (
                <PaymentScheduleRow
                  key={line.period}
                  line={line}
                  IBRNeeded={IBRNeeded}
                />
              ))}
            </tbody>
            <tfoot>
              <PurchaseOptionRow
                purchaseOptionTotals={schedule.purchaseOptionTotals}
                IBRNeeded={IBRNeeded}
              />
              <TotalsRow
                totals={schedule.paymentScheduleTotals}
                IBRNeeded={IBRNeeded}
              />
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
