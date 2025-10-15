/**
 * Format date in short format (dd/MM/yyyy or MM/dd/yyyy)
 * @param dateString - Date string in various formats
 * @param locale - Locale code (fr-FR or en-US)
 * @returns Date in short format based on locale
 */
export const formatDateShort = (
  dateString: string,
  locale: string = 'fr-FR'
): string => {
  if (!dateString) return '';

  if (dateString.includes('/')) {
    const parts = dateString.split('/');
    if (parts[2].length === 4) {
      if (locale === 'en-US') {
        const [first, second, year] = parts;
        if (parseInt(first) > 12) {
          return `${second.padStart(2, '0')}/${first.padStart(2, '0')}/${year}`;
        }
        return dateString;
      } else {
        const [first, second, year] = parts;
        if (parseInt(first) <= 12 && parseInt(second) > 12) {
          return `${second.padStart(2, '0')}/${first.padStart(2, '0')}/${year}`;
        }
        return dateString;
      }
    }
  }

  const [year, month, day] = dateString.split('-');
  if (locale === 'en-US') {
    return `${month}/${day}/${year}`;
  }
  return `${day}/${month}/${year}`;
};
