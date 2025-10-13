/**
 * Format date string according to locale
 * @param dateString - Date in format dd/MM/yyyy or MM/dd/yyyy
 * @param locale - Locale code (fr-FR or en-US)
 * @returns Formatted date string
 */
export const formatDate = (dateString: string, locale: string = 'fr-FR') => {
  if (!dateString) return '';

  let date: Date;

  // Parse date based on format (dd/MM/yyyy or MM/dd/yyyy)
  if (dateString.includes('/')) {
    const parts = dateString.split('/');
    if (locale === 'en-US') {
      // MM/dd/yyyy format
      const [month, day, year] = parts;
      date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    } else {
      // dd/MM/yyyy format
      const [day, month, year] = parts;
      date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }
  } else {
    // ISO format yyyy-MM-dd
    date = new Date(dateString);
  }

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

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

  let date: Date;

  // Parse date
  if (dateString.includes('/')) {
    const parts = dateString.split('/');
    if (parts[2].length === 4) {
      // Already in dd/MM/yyyy or MM/dd/yyyy
      if (locale === 'en-US') {
        const [first, second, year] = parts;
        // Could be dd/MM/yyyy, need to convert to MM/dd/yyyy
        if (parseInt(first) > 12) {
          // First part is day
          return `${second.padStart(2, '0')}/${first.padStart(2, '0')}/${year}`;
        }
        return dateString;
      } else {
        const [first, second, year] = parts;
        // Could be MM/dd/yyyy, need to convert to dd/MM/yyyy
        if (parseInt(first) <= 12 && parseInt(second) > 12) {
          // First part is month, second is day
          return `${second.padStart(2, '0')}/${first.padStart(2, '0')}/${year}`;
        }
        return dateString;
      }
    }
  }

  // ISO format
  const [year, month, day] = dateString.split('-');
  if (locale === 'en-US') {
    return `${month}/${day}/${year}`;
  }
  return `${day}/${month}/${year}`;
};

/**
 * Convert date to ISO format (yyyy-MM-dd)
 * @param dateStr - Date in dd/MM/yyyy or MM/dd/yyyy format
 * @param locale - Locale to determine input format
 * @returns Date in ISO format
 */
export const convertToISO = (dateStr: string, locale: string = 'fr-FR') => {
  if (!dateStr) return '';
  if (dateStr.includes('-') && dateStr.split('-')[0].length === 4)
    return dateStr; // Already in ISO format

  const parts = dateStr.split('/');
  if (parts.length !== 3) return dateStr;

  if (locale === 'en-US') {
    // MM/dd/yyyy to yyyy-MM-dd
    const [month, day, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  } else {
    // dd/MM/yyyy to yyyy-MM-dd
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
};

/**
 * Convert ISO date to locale format
 * @param dateStr - Date in yyyy-MM-dd format
 * @param locale - Target locale
 * @returns Date in locale format (dd/MM/yyyy or MM/dd/yyyy)
 */
export const convertFromISO = (dateStr: string, locale: string = 'fr-FR') => {
  if (!dateStr) return '';
  if (dateStr.includes('/')) return dateStr;

  const [year, month, day] = dateStr.split('-');

  if (locale === 'en-US') {
    return `${month}/${day}/${year}`;
  }
  return `${day}/${month}/${year}`;
};

// Backward compatibility
export const convertToFrench = (dateStr: string) =>
  convertFromISO(dateStr, 'fr-FR');
