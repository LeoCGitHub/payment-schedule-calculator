import { useTranslation } from 'react-i18next';
import './LanguageSelector.scss';

const LANGUAGES = [
  { code: 'fr', label: 'language.fr' },
  { code: 'en', label: 'language.en' },
];

export const LanguageSelector = () => {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (languageCode: string) => {
    void i18n.changeLanguage(languageCode);
  };

  return (
    <div className="language-selector">
      <label htmlFor="language-select" className="language-selector__label">
        {t('language.selector')}:
      </label>
      <select
        id="language-select"
        className="language-selector__select"
        value={i18n.language}
        onChange={e => handleLanguageChange(e.target.value)}
      >
        {LANGUAGES.map(lang => (
          <option key={lang.code} value={lang.code}>
            {t(lang.label)}
          </option>
        ))}
      </select>
    </div>
  );
};
