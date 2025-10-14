import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PaymentScheduleForm from '../containers/PaymentSchedule/Form/PaymentScheduleForm';
import PaymentScheduleTable from '../containers/PaymentSchedule/Table/PaymentScheduleTable';
import Toast from '../components/Toast/Toast';
import { LanguageSelector } from '../components/LanguageSelector/LanguageSelector';
import { paymentScheduleApiService } from '../api/PaymentScheduleApi';
import './App.scss';
import { PaymentScheduleResponse } from '@/types/payment-schedule/response/PaymentScheduleResponse';
import { PaymentScheduleRequest } from '@/types/payment-schedule/request/PaymentScheduleRequest';

function App(): React.JSX.Element {
  const { t } = useTranslation();
  const [schedule, setSchedule] = useState<PaymentScheduleResponse | null>(
    null
  );
  const [rateNegativ, setRateNegativ] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (
    request: PaymentScheduleRequest
  ): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const result = await paymentScheduleApiService.calculateSchedule(request);
      setSchedule(result as unknown as PaymentScheduleResponse);
      setRateNegativ(result.paymentScheduleTotals.totalInterestAmount < 0);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : t('errors.general');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__content">
          <h1>{t('app.title')}</h1>
          <LanguageSelector />
        </div>
      </header>

      <main className="app-main">
        <div className="main-layout">
          <div className="form-section">
            <PaymentScheduleForm
              onSubmit={handleSubmit}
              loading={loading}
              rateNegativ={rateNegativ}
            />
          </div>

          <div className="table-section">
            {schedule ? (
              <PaymentScheduleTable
                schedule={schedule}
                rateNegativ={rateNegativ}
              />
            ) : (
              <div className="placeholder">
                <div className="placeholder-icon">📊</div>
                <h3>{t('table.title')}</h3>
                <p>{t('app.subtitle')}</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {error && (
        <Toast
          message={error}
          type="error"
          onClose={() => setError(null)}
          duration={5000}
        />
      )}
    </div>
  );
}

export default App;
