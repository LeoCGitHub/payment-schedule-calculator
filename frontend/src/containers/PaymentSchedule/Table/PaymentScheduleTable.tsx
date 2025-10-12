import './PaymentScheduleTable.scss';
import {
  formatCurrency,
  formatPercentage,
} from '../../../utils/formatter/NumberFormatter';
import { convertToFrench } from '../../../utils/formatter/DateFormatter';
import {
  PaymentScheduleResponse,
  PaymentScheduleLine,
} from '../../../types/payment.types';

export interface PaymentScheduleTableProps {
  schedule: PaymentScheduleResponse | null;
}

export default function PaymentScheduleTable({
  schedule,
}: PaymentScheduleTableProps): React.JSX.Element | null {
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
                <th>Période</th>
                <th>Date d'échéance</th>
                <th>Loyer</th>
                <th>Taux</th>
                <th>Taux annuel</th>
                <th>Intérêts financiers</th>
                <th>Remboursement</th>
                <th>Dette début période</th>
                <th>Dette fin période</th>
                <th>Flux actualisés</th>
              </tr>
            </thead>
            <tbody>
              {schedule.paymentScheduleLines.map(
                (paymentScheduleLine: PaymentScheduleLine) => (
                  <tr key={paymentScheduleLine.period}>
                    <td>{paymentScheduleLine.period}</td>
                    <td>{convertToFrench(paymentScheduleLine.dueDate)}</td>
                    <td className="amount">
                      {formatCurrency(paymentScheduleLine.rentAmount)}
                    </td>
                    <td className="amount">
                      {formatPercentage(paymentScheduleLine.periodRate)}
                    </td>
                    <td className="amount">
                      {formatPercentage(
                        paymentScheduleLine.annualReferenceRate
                      )}
                    </td>
                    <td className="amount interest">
                      {formatCurrency(
                        paymentScheduleLine.financialInterestAmount
                      )}
                    </td>
                    <td className="amount">
                      {formatCurrency(paymentScheduleLine.repaymentAmount)}
                    </td>
                    <td className="amount">
                      {formatCurrency(
                        paymentScheduleLine.debtBeginningPeriodAmount
                      )}
                    </td>
                    <td className="amount balance">
                      {formatCurrency(paymentScheduleLine.debtEndPeriodAmount)}
                    </td>
                    <td className="amount">
                      {formatCurrency(
                        paymentScheduleLine.actualizedCashFlowAmount
                      )}
                    </td>
                  </tr>
                )
              )}
              <tr key="purchaseOption">
                <td colSpan={2}>Option d'achat</td>
                <td className="amount">
                  {formatCurrency(
                    schedule.purchaseOptionTotals.purchaseOptionAmount
                  )}
                </td>
                <td className="amount">-</td>
                <td className="amount">-</td>
                <td className="amount">-</td>
                <td className="amount">
                  {formatCurrency(
                    schedule.purchaseOptionTotals.purchaseOptionAmount
                  )}
                </td>
                <td className="amount">-</td>
                <td className="amount">-</td>
                <td className="amount">
                  {formatCurrency(
                    schedule.purchaseOptionTotals.actualizedPurchaseOptionAmount
                  )}
                </td>
              </tr>
              <tr key="paymentTotals" className="summary-inline-item">
                <td colSpan={2} className="summary-inline-label highlight">
                  Total
                </td>
                <td className="amount summary-inline-value highlight">
                  {formatCurrency(schedule.paymentScheduleTotals.totalAmount)}
                </td>
                <td className="amount">-</td>
                <td className="amount">-</td>
                <td className="amount summary-inline-value highlight">
                  {formatCurrency(
                    schedule.paymentScheduleTotals.totalInterestAmount
                  )}
                </td>
                <td className="amount summary-inline-value highlight">
                  {formatCurrency(
                    schedule.paymentScheduleTotals.totalRepaymentAmount
                  )}
                </td>
                <td className="amount">-</td>
                <td className="amount">-</td>
                <td className="amount summary-inline-value highlight">
                  {formatCurrency(
                    schedule.paymentScheduleTotals
                      .totalActualizedCashFlowsAmount
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
