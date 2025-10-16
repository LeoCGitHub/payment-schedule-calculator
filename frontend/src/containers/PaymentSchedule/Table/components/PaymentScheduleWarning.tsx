import React from 'react';
import { useTranslation } from 'react-i18next';

export default function PaymentScheduleWarning(): React.JSX.Element {
  const { t } = useTranslation();
  const reasonsLines = t('table.warning.reasons').split('\n');
  const solutionsLines = t('table.warning.solutionsToCheck').split('\n');

  return (
    <div role="alert" className="payment-schedule-warning">
      <h2>{t('table.warning.title')}</h2>
      <p>{t('table.warning.subtitle')}</p>
      <section>
        <h3>{t('table.warning.reasonsLabel')}</h3>
        <ul>
          {reasonsLines.map((ligne, i) => (
            <li key={i}>{ligne}</li>
          ))}
        </ul>
      </section>
      <section>
        <h3>{t('table.warning.solutionsLabel')}</h3>
        <ul>
          {' '}
          {solutionsLines.map((ligne, i) => (
            <li key={i}>{ligne}</li>
          ))}
        </ul>
        <h4>{t('table.warning.solutions')}</h4>
      </section>
    </div>
  );
}
