/**
 * Format number as currency according to locale
 * Always uses EUR currency, but formats according to locale conventions
 * @param currency - Number to format
 * @param locale - Locale code (fr-FR or en-US)
 * @returns Formatted currency string in EUR
 */
export const formatCurrency = (currency: number, locale: string = 'fr-FR') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
  }).format(currency);
};

/**
 * Format number as percentage according to locale
 * @param percent - Number to format (0.1234 = 12.34%)
 * @param locale - Locale code (fr-FR or en-US)
 * @returns Formatted percentage string
 */
export const formatPercentage = (percent: number, locale: string = 'fr-FR') => {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 3,
  }).format(percent);
};
