import { useState } from 'react';
import PaymentScheduleForm from '../containers/PaymentSchedule/Form/PaymentScheduleForm';
import PaymentScheduleTable from '../containers/PaymentSchedule/Table/PaymentScheduleTable';
import Toast from '../components/Toast/Toast';
import { paymentScheduleApi } from '../services/api';
import {
  PaymentScheduleRequest,
  FormData,
  PaymentScheduleResponse,
} from '../types/payment.types';
import './App.scss';

function App(): React.JSX.Element {
  const [schedule, setSchedule] = useState<PaymentScheduleResponse | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    periodicity: 'Trimestriel',
    contractDuration: '48',
    assetValue: '150000',
    purchaseOptionValue: '1500',
    firstPaymentDate: '17/09/2025',
    rentAmount: '10000',
  });

  const handleSubmit = async (
    request: PaymentScheduleRequest
  ): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const result = await paymentScheduleApi.calculateSchedule(request);
      setSchedule(result as unknown as PaymentScheduleResponse);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Une erreur est survenue lors du calcul de l'échéancier";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>
          Calculateur d&apos;échéancier d'un contrat de location-financement
        </h1>
      </header>

      <main className="app-main">
        <div className="main-layout">
          <div className="form-section">
            <PaymentScheduleForm
              onSubmit={handleSubmit}
              loading={loading}
              initialData={formData}
              onDataChange={setFormData}
            />
          </div>

          <div className="table-section">
            {schedule ? (
              <PaymentScheduleTable schedule={schedule} />
            ) : (
              <div className="placeholder">
                <div className="placeholder-icon">📊</div>
                <h3>Echéancier</h3>
                <p>
                  Remplissez le formulaire et cliquez sur "Calculer
                  l'échéancier" pour voir les résultats
                </p>
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
