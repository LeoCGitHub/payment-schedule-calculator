import './PaymentScheduleForm.scss';
import { useTranslation } from 'react-i18next';
import { convertToISO } from '../../../utils/formatter/DateFormatter';
import { PaymentScheduleFormService } from '@/containers/PaymentSchedule/Form/services/PaymentScheduleFormService';
import { PaymentScheduleFormProps } from './types/PaymentScheduleFormProps';
import { usePaymentScheduleForm } from './hooks/usePaymentScheduleForm';
import FormInput from '@/components/Form/FormInput/FormInput';
import FormSelect from '@/components/Form/FormSelect/FormSelect';
import { FormSelectOption } from '@/components/Form/FormSelect/FormSelect';

// Map i18next language code to locale
const getLocale = (language: string): string => {
  return language === 'en' ? 'en-US' : 'fr-FR';
};

export default function PaymentScheduleForm({
  onSubmit,
  loading,
  initialData,
  onDataChange,
}: PaymentScheduleFormProps): React.JSX.Element {
  const { t, i18n } = useTranslation();
  const locale = getLocale(i18n.language);

  const { formData, errors, isFormValid, handleChange, handleSubmit } =
    usePaymentScheduleForm({
      initialData,
      onDataChange,
      onSubmit: data => {
        const request = PaymentScheduleFormService.transformToRequest(data);
        void onSubmit(request);
      },
    });

  const periodicityOptions: FormSelectOption[] = [
    { value: 'Mensuel', label: t('form.periodicity.Mensuel') },
    { value: 'Trimestriel', label: t('form.periodicity.Trimestriel') },
    { value: 'Semestriel', label: t('form.periodicity.Semestriel') },
    { value: 'Annuel', label: t('form.periodicity.Annuel') },
  ];

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <h2>{t('form.title')}</h2>

      <div className="form-row">
        <FormInput
          id="firstPaymentDate"
          name="firstPaymentDate"
          label={t('form.firstPaymentDate.label')}
          type="date"
          value={convertToISO(formData.firstPaymentDate, locale)}
          onChange={handleChange}
          disabled={loading}
          error={errors.firstPaymentDate}
        />

        <FormSelect
          id="periodicity"
          name="periodicity"
          label={t('form.periodicity.label')}
          value={formData.periodicity}
          options={periodicityOptions}
          onChange={handleChange}
          disabled={loading}
          error={errors.periodicity}
        />

        <FormInput
          id="contractDuration"
          name="contractDuration"
          label={t('form.contractDuration.label')}
          type="number"
          value={formData.contractDuration}
          onChange={handleChange}
          disabled={loading}
          error={errors.contractDuration}
          min="1"
        />

        <FormInput
          id="assetValue"
          name="assetValue"
          label={t('form.assetValue.label')}
          type="number"
          value={formData.assetValue}
          onChange={handleChange}
          disabled={loading}
          error={errors.assetValue}
          min="0"
          step="1"
        />

        <FormInput
          id="rentAmount"
          name="rentAmount"
          label={t('form.rentAmount.label')}
          type="number"
          value={formData.rentAmount}
          onChange={handleChange}
          disabled={loading}
          error={errors.rentAmount}
          min="0"
          step="1"
        />

        <FormInput
          id="purchaseOptionValue"
          name="purchaseOptionValue"
          label={t('form.purchaseOptionValue.label')}
          type="number"
          value={formData.purchaseOptionValue}
          onChange={handleChange}
          disabled={loading}
          error={errors.purchaseOptionValue}
          min="0"
          step="1"
        />

        <div className="form-group">
          <button
            type="submit"
            className="submit-btn"
            disabled={loading || !isFormValid}
          >
            {loading ? t('form.submit') + '...' : t('form.submit')}
          </button>
        </div>
      </div>
    </form>
  );
}
