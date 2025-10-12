import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { PaymentScheduleFormData } from '../types/PaymentScheduleFormData';
import { PaymentScheduleFormErrors } from '../types/PaymentScheduleFormErrors';
import { PaymentScheduleFormService } from '@/containers/PaymentSchedule/Form/services/PaymentScheduleFormService';
import { convertToFrench } from '@/utils/formatter/DateFormatter';

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

    // Convert date from ISO format to French format
    if (name === 'firstPaymentDate' && value) {
      processedValue = convertToFrench(value);
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
    validateField(name, processedValue);
  };

  const validateField = (name: string, value: string): void => {
    const newErrors: PaymentScheduleFormErrors = { ...errors };
    const error = PaymentScheduleFormService.validateField(name, value);

    if (error) {
      newErrors[name as keyof PaymentScheduleFormErrors] = error;
    } else {
      delete newErrors[name as keyof PaymentScheduleFormErrors];
    }

    setErrors(newErrors);
  };

  const validate = (): boolean => {
    const newErrors = PaymentScheduleFormService.validateForm(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
