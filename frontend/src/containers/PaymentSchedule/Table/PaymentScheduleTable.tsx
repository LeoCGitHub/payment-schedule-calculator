import { PaymentScheduleResponse } from '@/types/payment-schedule/response/PaymentScheduleResponse';
import { useTranslation } from 'react-i18next';
import './PaymentScheduleTable.scss';
import PaymentScheduleRow from './components/PaymentScheduleRow';
import PurchaseOptionRow from './components/PurchaseOptionRow';
import TotalsRow from './components/TotalsRow';
import { TABLE_COLUMNS } from './constants/tableConfig';

export interface PaymentScheduleTableProps {
  schedule: PaymentScheduleResponse | null;
}

export default function PaymentScheduleTable({
  schedule,
}: PaymentScheduleTableProps): React.JSX.Element | null {
  const { t } = useTranslation();

  if (!schedule) {
    return null;
  }

  return (
    <div className="schedule-container">
      <div className="schedule-table-wrapper">
        <div className="table-responsive">
          <table className="schedule-table">
            <thead>
              <tr>
                {TABLE_COLUMNS.map(column => (
                  <th key={column.key} className={column.className}>
                    {t(`table.headers.${column.key}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {schedule.paymentScheduleLines.map(line => (
                <PaymentScheduleRow key={line.period} line={line} />
              ))}
            </tbody>
            <tfoot>
              <PurchaseOptionRow
                purchaseOptionTotals={schedule.purchaseOptionTotals}
              />
              <TotalsRow totals={schedule.paymentScheduleTotals} />
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
