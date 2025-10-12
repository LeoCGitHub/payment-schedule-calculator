import { useState } from 'react';
import PaymentScheduleForm from '../containers/PaymentSchedule/Form/PaymentScheduleForm';
import PaymentScheduleTable from '../containers/PaymentSchedule/Table/PaymentScheduleTable';
import Toast from '../components/Toast/Toast';
import { paymentScheduleApi } from '../services/api';
import './App.css';

function App() {
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    periodicity: 'Trimestriel',
    contractDuration: '48',
    assetValue: '150000',
    purchaseOptionAmount: '1500',
    firstPaymentDate: '17/09/2025',
    rentAmount: '10000',
  });

  const handleSubmit = async request => {
    setLoading(true);
    setError(null);

    try {
      const result = await paymentScheduleApi.calculateSchedule(request);
      setSchedule(result);
    } catch (err) {
      setError(
        err.message || "Une erreur est survenue lors du calcul de l'échéancier"
      );
      console.error('Error calculating schedule:', err);
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
