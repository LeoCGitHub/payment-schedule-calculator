import { useState, useEffect } from 'react';
import './PaymentScheduleForm.css';
import {
  convertToFrench,
  convertToISO,
} from '../../../utils/formatter/DateFormatter';

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
      purchaseOptionAmount: '1500',
      firstPaymentDate: '17/09/2025',
      rentAmount: '10000',
    }
  );

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = e => {
    const { name, value } = e.target;

    let processedValue = value;

    if (name === 'firstPaymentDate' && value) {
      processedValue = convertToFrench(value);
    }

    const newFormData = {
      ...formData,
      [name]: processedValue,
    };

    setFormData(newFormData);

    if (onDataChange) {
      onDataChange(newFormData);
    }

    validateField(name, processedValue);
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'contractDuration':
        if (!value || parseInt(value) <= 0) {
          newErrors.contractDuration = 'La durée contractuelle est requise';
        } else {
          delete newErrors.contractDuration;
        }
        break;
      case 'assetValue':
        if (!value || parseFloat(value) <= 0) {
          newErrors.assetValue =
            "La valeur de l'actif doit être supérieure à 0";
        } else {
          delete newErrors.assetValue;
        }
        break;
      case 'rentAmount':
        if (!value || parseFloat(value) <= 0) {
          newErrors.rentAmount = 'Le montant du loyer doit être supérieur à 0';
        } else {
          delete newErrors.rentAmount;
        }
        break;
      case 'firstPaymentDate':
        if (!value) {
          newErrors.firstPaymentDate =
            'La date de la première échéance est requise';
        } else {
          delete newErrors.firstPaymentDate;
        }
        break;
      case 'purchaseOptionAmount':
        if (!value) {
          newErrors.purchaseOptionAmount =
            "Le montant de l'option d'achat est requis";
        } else {
          delete newErrors.purchaseOptionAmount;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
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

    if (!formData.purchaseOptionAmount) {
      newErrors.purchaseOptionAmount =
        "Le montant de l'option d'achat est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = () => {
    return (
      formData.contractDuration &&
      parseInt(formData.contractDuration) > 0 &&
      formData.assetValue &&
      parseFloat(formData.assetValue) > 0 &&
      formData.rentAmount &&
      parseFloat(formData.rentAmount) > 0 &&
      formData.firstPaymentDate &&
      formData.purchaseOptionAmount &&
      Object.keys(errors).length === 0
    );
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
      purchaseOptionAmount: parseFloat(formData.purchaseOptionAmount),
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
            type="date"
            id="firstPaymentDate"
            name="firstPaymentDate"
            value={convertToISO(formData.firstPaymentDate)}
            onChange={handleChange}
            disabled={loading}
            className={errors.firstPaymentDate ? 'input-error' : ''}
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
            className={errors.contractDuration ? 'input-error' : ''}
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
            step="1"
            min="0"
            disabled={loading}
            className={errors.assetValue ? 'input-error' : ''}
          />
          {errors.assetValue && (
            <span className="error">{errors.assetValue}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="rentAmount">
            Montant du loyer (fixe et payé à terme échu)
          </label>
          <input
            type="number"
            id="rentAmount"
            name="rentAmount"
            value={formData.rentAmount}
            onChange={handleChange}
            step="1"
            min="0"
            disabled={loading}
            className={errors.rentAmount ? 'input-error' : ''}
          />
          {errors.rentAmount && (
            <span className="error">{errors.rentAmount}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="purchaseOptionAmount">
            Valeur de l&apos;option d&apos;achat
          </label>
          <input
            type="number"
            id="purchaseOptionAmount"
            name="purchaseOptionAmount"
            value={formData.purchaseOptionAmount}
            onChange={handleChange}
            step="1"
            min="0"
            disabled={loading}
            className={errors.assetValue ? 'input-error' : ''}
          />
          {errors.purchaseOptionAmount && (
            <span className="error">{errors.purchaseOptionAmount}</span>
          )}
        </div>

        <div className="form-group">
          <button
            type="submit"
            className="submit-btn"
            disabled={loading || !isFormValid()}
          >
            {loading ? 'Calcul en cours...' : "Calculer l'échéancier"}
          </button>
        </div>
      </div>
    </form>
  );
}
