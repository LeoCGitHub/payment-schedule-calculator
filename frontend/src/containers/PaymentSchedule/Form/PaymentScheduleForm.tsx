import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import './PaymentScheduleForm.scss';
import {
  convertToFrench,
  convertToISO,
} from '../../../utils/formatter/DateFormatter';
import {
  FormData,
  FormErrors,
  PaymentScheduleRequest,
} from '../../../types/payment.types';

export interface PaymentScheduleFormProps {
  onSubmit: (request: PaymentScheduleRequest) => void;
  loading: boolean;
  initialData?: FormData;
  onDataChange?: (data: FormData) => void;
}

export default function PaymentScheduleForm({
  onSubmit,
  loading,
  initialData,
  onDataChange,
}: PaymentScheduleFormProps): React.JSX.Element {
  const [formData, setFormData] = useState<FormData>(
    initialData || {
      periodicity: 'Trimestriel',
      contractDuration: '48',
      assetValue: '150000',
      purchaseOptionValue: '1500',
      firstPaymentDate: '17/09/2025',
      rentAmount: '10000',
    }
  );

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;

    let processedValue = value;

    if (name === 'firstPaymentDate' && value) {
      processedValue = convertToFrench(value);
    }

    const newFormData: FormData = {
      ...formData,
      [name]: processedValue,
    };

    setFormData(newFormData);

    if (onDataChange) {
      onDataChange(newFormData);
    }

    validateField(name, processedValue);
  };

  const validateField = (name: string, value: string): void => {
    const newErrors: FormErrors = { ...errors };

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
      case 'purchaseOptionValue':
        if (!value) {
          newErrors.purchaseOptionValue =
            "Le montant de l'option d'achat est requis";
        } else {
          delete newErrors.purchaseOptionValue;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

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

    if (!formData.purchaseOptionValue) {
      newErrors.purchaseOptionValue =
        "Le montant de l'option d'achat est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = (): boolean => {
    return (
      !!formData.contractDuration &&
      parseInt(formData.contractDuration) > 0 &&
      !!formData.assetValue &&
      parseFloat(formData.assetValue) > 0 &&
      !!formData.rentAmount &&
      parseFloat(formData.rentAmount) > 0 &&
      !!formData.firstPaymentDate &&
      Object.keys(errors).length === 0
    );
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const periodicityMap: Record<string, number> = {
      Mensuel: 1,
      Trimestriel: 3,
      Semestriel: 6,
      Annuel: 12,
    };

    const request: PaymentScheduleRequest = {
      periodicity: periodicityMap[formData.periodicity] || 3,
      contractDuration: parseInt(formData.contractDuration),
      assetAmount: parseFloat(formData.assetValue),
      purchaseOptionAmount: parseFloat(formData.purchaseOptionValue),
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
          <label htmlFor="purchaseOptionValue">
            Valeur de l&apos;option d&apos;achat
          </label>
          <input
            type="number"
            id="purchaseOptionValue"
            name="purchaseOptionValue"
            value={formData.purchaseOptionValue}
            onChange={handleChange}
            step="1"
            min="0"
            disabled={loading}
            className={errors.assetValue ? 'input-error' : ''}
          />
          {errors.purchaseOptionValue && (
            <span className="error">{errors.purchaseOptionValue}</span>
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
