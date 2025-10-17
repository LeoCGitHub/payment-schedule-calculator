import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PaymentScheduleForm from './Form/PaymentScheduleForm';
import PaymentScheduleTable from './Table/PaymentScheduleTable';
import { paymentScheduleApiService } from '../../api/PaymentScheduleApi';
import { useError } from '../../hooks/useError';
import { PaymentScheduleResponse } from '@/types/payment-schedule/response/PaymentScheduleResponse';
import { PaymentScheduleRequest } from '@/types/payment-schedule/request/PaymentScheduleRequest';

function PaymentSchedulePage(): React.JSX.Element {
  const { t } = useTranslation();
  const { setError } = useError();
  const [schedule, setSchedule] = useState<PaymentScheduleResponse | null>(
    null
  );
  const [IBRNeeded, setIBRNeeded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (
    request: PaymentScheduleRequest
  ): Promise<void> => {
    setLoading(true);
    setError(null);
    setIBRNeeded(false);

    try {
      const result = await paymentScheduleApiService.calculateSchedule(request);
      setSchedule(result as unknown as PaymentScheduleResponse);
      setIBRNeeded(result.ibrNeeded);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : t('errors.general');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSchedule(null);
    setIBRNeeded(false);
    setError(null);
  };

  return (
    <div className="main-layout">
      <div className="form-section">
        <PaymentScheduleForm
          onSubmit={handleSubmit}
          onReset={handleReset}
          loading={loading}
          IBRNeeded={IBRNeeded}
        />
      </div>

      <div className="table-section">
        {schedule ? (
          <PaymentScheduleTable schedule={schedule} IBRNeeded={IBRNeeded} />
        ) : (
          <div className="placeholder">
            <div className="placeholder-icon">📊</div>
            <h3>{t('placeholder.title')}</h3>
            <p>{t('placeholder.subtitle')}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentSchedulePage;
