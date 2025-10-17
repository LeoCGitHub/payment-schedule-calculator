import { FormSelectOption } from '@/components/Form/FormSelect/FormSelect';
import { t } from 'i18next';
import { PaymentScheduleFormData } from '../types/PaymentScheduleFormData';
export const PERIODICITY_OPTIONS: FormSelectOption[] = [
  { value: '1', label: t('form.periodicity.monthly') },
  { value: '3', label: t('form.periodicity.quarterly') },
  { value: '6', label: t('form.periodicity.semiAnnual') },
  { value: '12', label: t('form.periodicity.annual') },
];
export const DEFAULT_FORM_DATA: PaymentScheduleFormData = {
  periodicity: '3',
  contractDuration: '48',
  assetAmount: '150000',
  purchaseOptionAmount: '1500',
  firstPaymentDate: '2025-07-15',
  rentAmount: '10000',
  marginalDebtRate: undefined,
};
