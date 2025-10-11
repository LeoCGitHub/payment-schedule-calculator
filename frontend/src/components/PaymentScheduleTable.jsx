import './PaymentScheduleTable.css';

export default function PaymentScheduleTable({ schedule }) {
  if (!schedule) {
    return null;
  }

  const formatCurrency = value => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  };

  const formatDate = dateString => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const formatPercentage = value => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(value);
  };

  return (
    <div className="schedule-container">
      <div className="schedule-table-wrapper">
        <div className="table-header">
          <h3>Échéancier détaillé</h3>
          <div className="summary-inline">
            <div className="summary-inline-item">
              <span className="summary-inline-label">Montant total:</span>
              <span className="summary-inline-value">
                {formatCurrency(schedule.totalAmount)}
              </span>
            </div>
            <div className="summary-inline-item">
              <span className="summary-inline-label">Principal:</span>
              <span className="summary-inline-value">
                {formatCurrency(schedule.totalPrincipal)}
              </span>
            </div>
            <div className="summary-inline-item">
              <span className="summary-inline-label">Intérêts totaux:</span>
              <span className="summary-inline-value highlight">
                {formatCurrency(schedule.totalInterest)}
              </span>
            </div>
          </div>
        </div>
        <div className="table-responsive">
          <table className="schedule-table">
            <thead>
              <tr>
                <th>Période</th>
                <th>Date d'échéance</th>
                <th>Dette début période</th>
                {/* <th>Nouvelle dette</th> */}
                <th>Remboursement</th>
                <th>Dette fin période</th>
                <th>Taux</th>
                <th>Intérêts financiers</th>
                <th>Loyer</th>
                <th>Taux annuel de référence</th>
                <th>Flux actualisés</th>
              </tr>
            </thead>
            <tbody>
              {schedule.payments.map(payment => (
                <tr key={payment.period}>
                  <td>{payment.period}</td>
                  <td>{formatDate(payment.dueDate)}</td>
                  <td className="amount">
                    {formatCurrency(payment.debtBeginningPeriod)}
                  </td>
                  {/* <td className="amount">
                    {formatCurrency(payment.newDebtPerMonth)}
                  </td> */}
                  <td className="amount">
                    {formatCurrency(payment.repayment)}
                  </td>
                  <td className="amount balance">
                    {formatCurrency(payment.debtEndPeriod)}
                  </td>
                  <td className="amount">
                    {formatPercentage(payment.periodRate)}
                  </td>
                  <td className="amount interest">
                    {formatCurrency(payment.financialInterest)}
                  </td>
                  <td className="amount">{formatCurrency(payment.rent)}</td>
                  <td className="amount">
                    {formatPercentage(payment.annualReferenceRate)}
                  </td>
                  <td className="amount">
                    {formatCurrency(payment.discountedCashFlow)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
