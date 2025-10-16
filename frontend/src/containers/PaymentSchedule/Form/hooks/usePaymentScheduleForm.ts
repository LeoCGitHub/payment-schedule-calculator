import {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
  useCallback,
} from 'react';
import { useTranslation } from 'react-i18next';
import { PaymentScheduleFormData } from '../types/PaymentScheduleFormData';
import { PaymentScheduleFormErrors } from '../types/PaymentScheduleFormErrors';
import { PaymentScheduleFormService } from '@/containers/PaymentSchedule/Form/services/PaymentScheduleFormService';
import { DEFAULT_FORM_DATA } from '../constants/formConfig';

interface UsePaymentScheduleFormProps {
  initialData?: PaymentScheduleFormData;
  onDataChange?: (data: PaymentScheduleFormData) => void;
  onSubmit: (data: PaymentScheduleFormData) => void;
}

interface UsePaymentScheduleFormReturn {
  formData: PaymentScheduleFormData;
  errors: PaymentScheduleFormErrors;
  isFormValid: boolean;
  handleReset: () => void;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export function usePaymentScheduleForm({
  initialData,
  onDataChange,
  onSubmit,
}: UsePaymentScheduleFormProps): UsePaymentScheduleFormReturn {
  const { t } = useTranslation();

  const [formData, setFormData] = useState<PaymentScheduleFormData>(
    initialData || DEFAULT_FORM_DATA
  );
  const [errors, setErrors] = useState<PaymentScheduleFormErrors>({});

  const validateFields = useCallback(
    (
      fieldName: keyof PaymentScheduleFormData,
      currentFormData: PaymentScheduleFormData,
      newErrors: PaymentScheduleFormErrors
    ) => {
      const error = PaymentScheduleFormService.validateField(
        fieldName,
        currentFormData[fieldName]!,
        currentFormData
      );
      if (error) {
        newErrors[fieldName] = error;
      } else {
        delete newErrors[fieldName];
      }
    },
    []
  );

  const revalidateDependentFields = useCallback(
    (
      currentField: keyof PaymentScheduleFormData,
      fieldName: keyof PaymentScheduleFormData,
      dependantName: keyof PaymentScheduleFormData,
      currentFormData: PaymentScheduleFormData,
      newErrors: PaymentScheduleFormErrors
    ) => {
      if (currentField === fieldName && currentFormData[dependantName]) {
        validateFields(dependantName, currentFormData, newErrors);
      } else if (currentField === dependantName && currentFormData[fieldName]) {
        validateFields(fieldName, currentFormData, newErrors);
      }
    },
    [validateFields]
  );

  const validateField = useCallback(
    (name: string, currentFormData: PaymentScheduleFormData): void => {
      const newErrors: PaymentScheduleFormErrors = { ...errors };

      validateFields(
        name as keyof PaymentScheduleFormData,
        currentFormData,
        newErrors
      );

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

      revalidateDependentFields(
        name as keyof PaymentScheduleFormData,
        'assetAmount',
        'purchaseOptionAmount',
        currentFormData,
        newErrors
      );

      setErrors(newErrors);
    },
    [errors, setErrors, validateFields, revalidateDependentFields]
  );

  const validate = useCallback((): boolean => {
    const rawErrors = PaymentScheduleFormService.validateForm(formData);
    const translatedErrors: PaymentScheduleFormErrors = {};

    Object.entries(rawErrors).forEach(([key, value]) => {
      if (value) {
        translatedErrors[key as keyof PaymentScheduleFormErrors] = t(value);
      }
    });
    setErrors(translatedErrors);

    return Object.keys(translatedErrors).length === 0;
  }, [formData, setErrors, t]);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setErrors({});
    }
  }, [initialData]);

  const handleReset = () => {
    setFormData(DEFAULT_FORM_DATA);
    setErrors({});
  };

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
      const { name, value } = e.target;

      let processedValue = value;

      if (name === 'marginalDebtRate' && parseInt(value) > 100) {
        processedValue = '100';
      }

      setFormData(prevFormData => {
        const newFormData: PaymentScheduleFormData = {
          ...prevFormData,
          [name]: processedValue,
        };

        if (onDataChange) {
          onDataChange(newFormData);
        }

        validateField(name, newFormData);

        return newFormData;
      });
    },
    [onDataChange, validateField]
  );

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>): void => {
      e.preventDefault();

      if (!validate()) {
        return;
      }

      const dataToSubmit = { ...formData };

      onSubmit(dataToSubmit);
    },
    [formData, onSubmit, validate]
  );

  const isFormValid = PaymentScheduleFormService.isFormValid(formData, errors);

  return {
    formData,
    errors,
    isFormValid,
    handleReset,
    handleChange,
    handleSubmit,
  };
}
