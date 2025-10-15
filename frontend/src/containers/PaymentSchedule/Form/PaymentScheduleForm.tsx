import './PaymentScheduleForm.scss';
import { useTranslation } from 'react-i18next';
import { PaymentScheduleFormService } from '@/containers/PaymentSchedule/Form/services/PaymentScheduleFormService';
import { PaymentScheduleFormProps } from './types/PaymentScheduleFormProps';
import { usePaymentScheduleForm } from './hooks/usePaymentScheduleForm';
import FormInput from '@/components/Form/FormInput/FormInput';
import FormSelect from '@/components/Form/FormSelect/FormSelect';
import { PERIODICITY_OPTIONS } from './constants/formConfig';

export default function PaymentScheduleForm({
  onSubmit,
  loading,
  initialData,
  onDataChange,
  rateNegativ,
  onReset,
}: PaymentScheduleFormProps): React.JSX.Element {
  const { t } = useTranslation();

  const {
    formData,
    errors,
    isFormValid,
    handleReset,
    handleChange,
    handleSubmit,
  } = usePaymentScheduleForm({
    initialData,
    onDataChange,
    onSubmit: data => {
      const request = PaymentScheduleFormService.transformToRequest(data);
      void onSubmit(request);
    },
  });

  const combinedReset = () => {
    handleReset();
    onReset();
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <h2>{t('form.title')}</h2>

      <div className="form-row">
        <FormInput
          id="firstPaymentDate"
          name="firstPaymentDate"
          label={t('form.firstPaymentDate.label')}
          placeholder={t('form.firstPaymentDate.placeholder')}
          type="date"
          value={formData.firstPaymentDate}
          onChange={handleChange}
          disabled={loading}
          error={errors.firstPaymentDate}
        />

        <FormSelect
          id="periodicity"
          name="periodicity"
          label={t('form.periodicity.label')}
          value={formData.periodicity}
          options={PERIODICITY_OPTIONS}
          onChange={handleChange}
          disabled={loading}
          error={errors.periodicity}
        />

        <FormInput
          id="contractDuration"
          name="contractDuration"
          label={t('form.contractDuration.label')}
          placeholder={t('form.contractDuration.placeholder')}
          type="number"
          value={formData.contractDuration}
          onChange={handleChange}
          disabled={loading}
          error={errors.contractDuration}
          min="1"
        />

        <FormInput
          id="assetAmount"
          name="assetAmount"
          label={t('form.assetAmount.label')}
          placeholder={t('form.assetAmount.placeholder')}
          type="number"
          value={formData.assetAmount}
          onChange={handleChange}
          disabled={loading}
          error={errors.assetAmount}
          min="0"
          step="1"
        />

        <FormInput
          id="rentAmount"
          name="rentAmount"
          label={t('form.rentAmount.label')}
          placeholder={t('form.rentAmount.placeholder')}
          type="number"
          value={formData.rentAmount}
          onChange={handleChange}
          disabled={loading}
          error={errors.rentAmount}
          min="0"
          step="1"
        />

        <FormInput
          id="purchaseOptionAmount"
          name="purchaseOptionAmount"
          label={t('form.purchaseOptionAmount.label')}
          placeholder={t('form.purchaseOptionAmount.placeholder')}
          type="number"
          value={formData.purchaseOptionAmount}
          onChange={handleChange}
          disabled={loading}
          error={errors.purchaseOptionAmount}
          min="0"
          step="1"
        />

        {rateNegativ ? (
          <div className="form-input-with-beta-flag">
            <div className="flag-beta">{t('form.marginalDebtRate.flag')}</div>
            <FormInput
              id="marginalDebtRate"
              name="marginalDebtRate"
              label={t('form.marginalDebtRate.label')}
              placeholder={t('form.marginalDebtRate.placeholder')}
              type="number"
              value={formData.marginalDebtRate || ''}
              onChange={handleChange}
              disabled={loading}
              error={errors.marginalDebtRate}
              min="0"
              max="100"
              step="0.1"
            />
          </div>
        ) : null}

        <div className="form-group footer-button">
          <button
            type="button"
            className="reset-btn"
            disabled={loading}
            onClick={combinedReset}
          >
            {t('form.reset')}
          </button>
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
