import './PaymentScheduleForm.scss';
import { convertToISO } from '../../../utils/formatter/DateFormatter';
import { PaymentScheduleFormService } from '@/containers/PaymentSchedule/Form/services/PaymentScheduleFormService';
import { PaymentScheduleFormProps } from './types/PaymentScheduleFormProps';
import { usePaymentScheduleForm } from './hooks/usePaymentScheduleForm';
import FormInput from '@/components/Form/FormInput/FormInput';
import FormSelect from '@/components/Form/FormSelect/FormSelect';
import {
  PERIODICITY_OPTIONS,
  FORM_LABELS,
  SUBMIT_BUTTON_LABELS,
} from './constants/formConfig';

export default function PaymentScheduleForm({
  onSubmit,
  loading,
  initialData,
  onDataChange,
}: PaymentScheduleFormProps): React.JSX.Element {
  const { formData, errors, isFormValid, handleChange, handleSubmit } =
    usePaymentScheduleForm({
      initialData,
      onDataChange,
      onSubmit: data => {
        const request = PaymentScheduleFormService.transformToRequest(data);
        void onSubmit(request);
      },
    });

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <h2>Sélectionnez vos conditions initiales</h2>

      <div className="form-row">
        <FormInput
          id="firstPaymentDate"
          name="firstPaymentDate"
          label={FORM_LABELS.firstPaymentDate}
          type="date"
          value={convertToISO(formData.firstPaymentDate)}
          onChange={handleChange}
          disabled={loading}
          error={errors.firstPaymentDate}
        />

        <FormSelect
          id="periodicity"
          name="periodicity"
          label={FORM_LABELS.periodicity}
          value={formData.periodicity}
          options={PERIODICITY_OPTIONS}
          onChange={handleChange}
          disabled={loading}
          error={errors.periodicity}
        />

        <FormInput
          id="contractDuration"
          name="contractDuration"
          label={FORM_LABELS.contractDuration}
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
          label={FORM_LABELS.assetValue}
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
          label={FORM_LABELS.rentAmount}
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
          label={FORM_LABELS.purchaseOptionValue}
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
            {loading
              ? SUBMIT_BUTTON_LABELS.loading
              : SUBMIT_BUTTON_LABELS.default}
          </button>
        </div>
      </div>
    </form>
  );
}
