/**
 * Error message keys for i18n
 * These keys map to the translation files (en.json, fr.json)
 */
export const ERROR_KEYS = {
  CONTRACT_DURATION_REQUIRED: 'errors.contractDuration.required',
  CONTRACT_DURATION_CONSISTENCY: 'errors.contractDuration.consistency',
  ASSET_AMOUNT_REQUIRED: 'errors.assetAmount.required',
  ASSET_AMOUNT_CONSISTENCY: 'errors.assetAmount.consistency',
  RENT_AMOUNT_REQUIRED: 'errors.rentAmount.required',
  RENT_AMOUNT_CONSISTENCY: 'errors.rentAmount.consistency',
  FIRST_PAYMENT_DATE_REQUIRED: 'errors.firstPaymentDate.required',
  PURCHASE_OPTION_VALUE_REQUIRED: 'errors.purchaseOptionAmount.required',
} as const;

export type ErrorKey = (typeof ERROR_KEYS)[keyof typeof ERROR_KEYS];
