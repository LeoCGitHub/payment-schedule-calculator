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

    if (name === 'firstPaymentDate' && value) {
      processedValue = convertFromISO(value, locale);
    }

    if (name === 'marginalDebtRate' && parseInt(value) > 100) {
      processedValue = '100';
    }

    const newFormData: PaymentScheduleFormData = {
      ...formData,
      [name]: processedValue,
    };

    setFormData(newFormData);

    if (onDataChange) {
      onDataChange(newFormData);
    }

    validateField(name, newFormData);
  };

  const validateField = (
    name: string,
    currentFormData: PaymentScheduleFormData
  ): void => {
    const newErrors: PaymentScheduleFormErrors = { ...errors };

    validateFieldWithTranslation(
      name as keyof PaymentScheduleFormData,
      currentFormData,
      newErrors
    );
    //  TODO LCG bug here on dynamic langage change, faut recharger page

    revalidateDependentFields(
      name as keyof PaymentScheduleFormData,
      'periodicity',
      'contractDuration',
      currentFormData,
      newErrors
    );

    revalidateDependentFields(
      name as keyof PaymentScheduleFormData,
      'assetAmount',
      'rentAmount',
      currentFormData,
      newErrors
    );

    setErrors(newErrors);
  };

  const validate = (): boolean => {
    const rawErrors = PaymentScheduleFormService.validateForm(formData);
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

  const validateFieldWithTranslation = (
    fieldName: keyof PaymentScheduleFormData,
    currentFormData: PaymentScheduleFormData,
    newErrors: PaymentScheduleFormErrors
  ) => {
    const error = PaymentScheduleFormService.validateField(
      fieldName,
      currentFormData[fieldName],
      currentFormData
    );
    if (error) {
      newErrors[fieldName] = translateError(error, t);
    } else {
      delete newErrors[fieldName];
    }
  };

  const revalidateDependentFields = (
    currentField: keyof PaymentScheduleFormData,
    fieldName: keyof PaymentScheduleFormData,
    dependantName: keyof PaymentScheduleFormData,
    currentFormData: PaymentScheduleFormData,
    newErrors: PaymentScheduleFormErrors
  ) => {
    if (currentField === fieldName && currentFormData[dependantName]) {
      validateFieldWithTranslation(dependantName, currentFormData, newErrors);
    } else if (currentField === dependantName && currentFormData[fieldName]) {
      validateFieldWithTranslation(fieldName, currentFormData, newErrors);
    }
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
