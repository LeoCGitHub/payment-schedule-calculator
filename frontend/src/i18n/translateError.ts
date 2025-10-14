import { TFunction } from 'i18next';

/**
 * Translates validation error messages
 * Maps English error messages from the service to translation keys
 */
export function translateError(error: string, t: TFunction): string {
  if (error === 'Contract duration is required') {
    return t('errors.contractDuration.required');
  }

  const consistencyMatch = error.match(
    /Contract duration must be a multiple of (\d+) months for (\w+) periodicity/
  );
  if (consistencyMatch) {
    const [, months, periodicity] = consistencyMatch;
    return t('errors.contractDuration.consistency', {
      months,
      periodicity: t(`form.periodicity.${periodicity}`),
    });
  }

  if (error === 'Asset value must be greater than 0') {
    return t('errors.assetAmount.required');
  }

  if (error === 'Asset amount must be greater than Rent amount') {
    return t('errors.assetAmount.consistency');
  }

  if (error === 'Rent amount must be greater than 0') {
    return t('errors.rentAmount.required');
  }

  if (error === 'Rent amount must be lower than Asset amount') {
    return t('errors.rentAmount.consistency');
  }

  if (error === 'First payment date is required') {
    return t('errors.firstPaymentDate.required');
  }

  if (error === 'Purchase option amount is required') {
    return t('errors.purchaseOptionAmount.required');
  }

  return error;
}
