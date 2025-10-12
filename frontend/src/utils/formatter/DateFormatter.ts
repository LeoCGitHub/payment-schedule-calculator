export const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

// Convert dd/MM/yyyy to yyyy-MM-dd
export const convertToISO = (dateStr: string) => {
  if (!dateStr) return '';
  if (dateStr.includes('-')) return dateStr; // Already in ISO format
  const [day, month, year] = dateStr.split('/');

  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

// Convert yyyy-MM-dd to dd/MM/yyyy
export const convertToFrench = (dateStr: string) => {
  if (!dateStr) return '';
  if (dateStr.includes('/')) return dateStr;
  const [year, month, day] = dateStr.split('-');

  return `${day}/${month}/${year}`;
};
