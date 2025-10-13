import { TFunction } from 'i18next';

/**
 * Translates validation error messages
 * Maps English error messages from the service to translation keys
 */
export function translateError(error: string, t: TFunction): string {
  if (error === 'Contract duration is required') {
    return t('errors.contractDuration.required');
  }

  // Check for consistency error pattern
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

  // Asset value errors
  if (error === 'Asset value must be greater than 0') {
    return t('errors.assetAmount.required');
  }

  // Rent amount errors
  if (error === 'Asset amount must be greater than Rent amount') {
    return t('errors.assetAmount.consistency');
  }

  // Rent amount errors
  if (error === 'Rent amount must be greater than 0') {
    return t('errors.rentAmount.required');
  }

  // Rent amount errors
  if (error === 'Rent amount must be lower than Asset amount') {
    return t('errors.rentAmount.consistency');
  }

  // First payment date errors
  if (error === 'First payment date is required') {
    return t('errors.firstPaymentDate.required');
  }

  // Purchase option value errors
  if (error === 'Purchase option amount is required') {
    return t('errors.purchaseOptionValue.required');
  }

  // Default: return original error if no translation found
  return error;
}
