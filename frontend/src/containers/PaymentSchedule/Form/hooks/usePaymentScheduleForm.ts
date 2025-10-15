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
import { translateError } from '@/i18n/translateError';
import { DEFAULT_FORM_DATA } from '../constants/formConfig';

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
  handleReset: () => void;
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
    initialData || DEFAULT_FORM_DATA
  );
  const [errors, setErrors] = useState<PaymentScheduleFormErrors>({});

  const validateFieldWithTranslation = useCallback(
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
        newErrors[fieldName] = translateError(error, t);
      } else {
        delete newErrors[fieldName];
      }
    },
    [t]
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
        validateFieldWithTranslation(dependantName, currentFormData, newErrors);
      } else if (currentField === dependantName && currentFormData[fieldName]) {
        validateFieldWithTranslation(fieldName, currentFormData, newErrors);
      }
    },
    [validateFieldWithTranslation]
  );

  const validateField = useCallback(
    (name: string, currentFormData: PaymentScheduleFormData): void => {
      const newErrors: PaymentScheduleFormErrors = { ...errors };

      validateFieldWithTranslation(
        name as keyof PaymentScheduleFormData,
        currentFormData,
        newErrors
      );
      //TODO LCG bug here ocdn dynamic langage change, faut recharger page

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
    },
    [errors, setErrors, validateFieldWithTranslation, revalidateDependentFields]
  );

  const validate = useCallback((): boolean => {
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
    [locale, onDataChange, validateField]
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
