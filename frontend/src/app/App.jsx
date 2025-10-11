import { useState } from 'react';
import PaymentScheduleForm from '../components/PaymentScheduleForm';
import PaymentScheduleTable from '../components/PaymentScheduleTable';
import Toast from '../components/Toast';
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
    purchaseOptionValue: '1500',
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
        <h1>Calculateur d&apos;échéancier de paiement d'un contrat bail</h1>
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
                <h3>Tableau d'amortissement</h3>
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

      {/* <footer className="app-footer">
        <p>© 2025 Payment Schedule Calculator</p>
      </footer> */}
    </div>
  );
}

export default App;
