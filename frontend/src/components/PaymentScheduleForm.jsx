import { useState, useEffect } from 'react';
import './PaymentScheduleForm.css';

export default function PaymentScheduleForm({
  onSubmit,
  loading,
  initialData,
  onDataChange,
}) {
  const [formData, setFormData] = useState(
    initialData || {
      periodicity: 'Trimestriel',
      contractDuration: '48',
      assetValue: '150000',
      purchaseOptionValue: '1500',
      firstPaymentDate: '17/09/2025',
      rentAmount: '10000',
    }
  );

  const [errors, setErrors] = useState({});

  // Synchroniser avec initialData si fourni
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = e => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: value,
    };

    setFormData(newFormData);

    // Notifier le composant parent du changement
    if (onDataChange) {
      onDataChange(newFormData);
    }

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (
      !formData.contractDuration ||
      parseInt(formData.contractDuration) <= 0
    ) {
      newErrors.contractDuration = 'La durée contractuelle est requise';
    }

    if (!formData.assetValue || parseFloat(formData.assetValue) <= 0) {
      newErrors.assetValue = "La valeur de l'actif doit être supérieure à 0";
    }

    if (!formData.rentAmount || parseFloat(formData.rentAmount) <= 0) {
      newErrors.rentAmount = 'Le montant du loyer doit être supérieur à 0';
    }

    if (!formData.firstPaymentDate) {
      newErrors.firstPaymentDate =
        'La date de la première échéance est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const periodicityMap = {
      Mensuel: 1,
      Trimestriel: 3,
      Semestriel: 6,
      Annuel: 12,
    };

    const request = {
      periodicity: periodicityMap[formData.periodicity] || 3,
      contractDuration: parseInt(formData.contractDuration),
      assetValue: parseFloat(formData.assetValue),
      purchaseOptionValue: parseFloat(formData.purchaseOptionValue || 0),
      firstPaymentDate: formData.firstPaymentDate,
      rentAmount: parseFloat(formData.rentAmount),
    };

    onSubmit(request);
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <h2>Sélectionnez vos conditions initiales</h2>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="firstPaymentDate">Date de la première échéance</label>
          <input
            type="text"
            id="firstPaymentDate"
            name="firstPaymentDate"
            value={formData.firstPaymentDate}
            onChange={handleChange}
            placeholder="JJ/MM/AAAA"
            disabled={loading}
          />
          {errors.firstPaymentDate && (
            <span className="error">{errors.firstPaymentDate}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="periodicity">Périodicité</label>
          <select
            id="periodicity"
            name="periodicity"
            value={formData.periodicity}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="Mensuel">Mensuel</option>
            <option value="Trimestriel">Trimestriel</option>
            <option value="Semestriel">Semestriel</option>
            <option value="Annuel">Annuel</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="contractDuration">
            Durée contractuelle (en mois)
          </label>
          <input
            type="number"
            id="contractDuration"
            name="contractDuration"
            value={formData.contractDuration}
            onChange={handleChange}
            min="1"
            disabled={loading}
          />
          {errors.contractDuration && (
            <span className="error">{errors.contractDuration}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="assetValue">Valeur de l&apos;actif</label>
          <input
            type="number"
            id="assetValue"
            name="assetValue"
            value={formData.assetValue}
            onChange={handleChange}
            step="0.01"
            min="0"
            disabled={loading}
          />
          {errors.assetValue && (
            <span className="error">{errors.assetValue}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="purchaseOptionValue">
            Valeur de l&apos;option d&apos;achat
          </label>
          <input
            type="number"
            id="purchaseOptionValue"
            name="purchaseOptionValue"
            value={formData.purchaseOptionValue}
            onChange={handleChange}
            step="0.01"
            min="0"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="rentAmount">Montant du loyer (fixe)</label>
          <input
            type="number"
            id="rentAmount"
            name="rentAmount"
            value={formData.rentAmount}
            onChange={handleChange}
            step="0.01"
            min="0"
            disabled={loading}
          />
          {errors.rentAmount && (
            <span className="error">{errors.rentAmount}</span>
          )}
        </div>

        <div className="form-group">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Calcul en cours...' : "Calculer l'échéancier"}
          </button>
        </div>
      </div>
    </form>
  );
}
