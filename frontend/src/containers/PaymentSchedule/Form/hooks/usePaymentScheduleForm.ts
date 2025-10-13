import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { PaymentScheduleFormData } from '../types/PaymentScheduleFormData';
import { PaymentScheduleFormErrors } from '../types/PaymentScheduleFormErrors';
import { PaymentScheduleFormService } from '@/containers/PaymentSchedule/Form/services/PaymentScheduleFormService';
import { convertFromISO } from '@/utils/formatter/DateFormatter';
import { translateError } from '@/i18n/translateError';

// Map i18next language code to locale
const getLocale = (language: string): string => {
  return language === 'en' ? 'en-US' : 'fr-FR';
};

interface UsePaymentScheduleFormProps {
  initialData?: PaymentScheduleFormData;
  onDataChange?: (data: PaymentScheduleFormData) => void;
  onSubmit: (data: PaymentScheduleFormData) => void;
}

interface UsePaymentScheduleFormReturn {
  formData: PaymentScheduleFormData;
  errors: PaymentScheduleFormErrors;
  isFormValid: boolean;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export function usePaymentScheduleForm({
  initialData,
  onDataChange,
  onSubmit,
}: UsePaymentScheduleFormProps): UsePaymentScheduleFormReturn {
  const { t, i18n } = useTranslation();
  const locale = getLocale(i18n.language);

  const [formData, setFormData] = useState<PaymentScheduleFormData>(
    initialData || PaymentScheduleFormService.getDefaultFormData()
  );

  const [errors, setErrors] = useState<PaymentScheduleFormErrors>({});

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

    // Convert date from ISO format to locale format
    if (name === 'firstPaymentDate' && value) {
      processedValue = convertFromISO(value, locale);
    }

    const newFormData: PaymentScheduleFormData = {
      ...formData,
      [name]: processedValue,
    };

    setFormData(newFormData);

    if (onDataChange) {
      onDataChange(newFormData);
    }

    // Validate field on change
    validateField(name, processedValue, newFormData);
  };

  const validateField = (
    name: string,
    value: string,
    currentFormData: PaymentScheduleFormData
  ): void => {
    const newErrors: PaymentScheduleFormErrors = { ...errors };
    const error = PaymentScheduleFormService.validateField(
      name,
      value,
      currentFormData
    );

    if (error) {
      newErrors[name as keyof PaymentScheduleFormErrors] = translateError(
        error,
        t
      );
    } else {
      delete newErrors[name as keyof PaymentScheduleFormErrors];
    }

    // When periodicity or contractDuration changes, re-validate the other field
    if (name === 'periodicity' && currentFormData.contractDuration) {
      const durationError = PaymentScheduleFormService.validateField(
        'contractDuration',
        currentFormData.contractDuration,
        currentFormData
      );
      if (durationError) {
        newErrors.contractDuration = translateError(durationError, t);
      } else {
        delete newErrors.contractDuration;
      }
    } else if (name === 'contractDuration' && currentFormData.periodicity) {
      const periodicityError = PaymentScheduleFormService.validateField(
        'periodicity',
        currentFormData.periodicity,
        currentFormData
      );
      if (periodicityError) {
        newErrors.periodicity = translateError(periodicityError, t);
      } else {
        delete newErrors.periodicity;
      }
    }

    setErrors(newErrors);
  };

  const validate = (): boolean => {
    const rawErrors = PaymentScheduleFormService.validateForm(formData);
    // Translate all errors
    const translatedErrors: PaymentScheduleFormErrors = {};
    Object.entries(rawErrors).forEach(([key, value]) => {
      if (value) {
        translatedErrors[key as keyof PaymentScheduleFormErrors] =
          translateError(value, t);
      }
    });
    setErrors(translatedErrors);
    return Object.keys(translatedErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit(formData);
  };

  const isFormValid = PaymentScheduleFormService.isFormValid(formData, errors);

  return {
    formData,
    errors,
    isFormValid,
    handleChange,
    handleSubmit,
  };
}
