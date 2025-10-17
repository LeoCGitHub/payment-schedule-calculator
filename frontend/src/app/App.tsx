import { useTranslation } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';
import Toast from '../components/Toast/Toast';
import { LanguageSelector } from '../components/LanguageSelector/LanguageSelector';
import { ErrorProvider } from '../contexts/ErrorContext';
import { useError } from '../hooks/useError';
import './App.scss';

function AppLayout(): React.JSX.Element {
  const { t } = useTranslation();
  const { error, clearError } = useError();

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__content">
          <h1>{t('app.title')}</h1>
          <LanguageSelector />
        </div>
      </header>

      <main className="app-main">
        <AppRoutes />
      </main>

      {error && (
        <Toast
          message={error}
          type="error"
          onClose={clearError}
          duration={5000}
        />
      )}
    </div>
  );
}

function App(): React.JSX.Element {
  return (
    <BrowserRouter>
      <ErrorProvider>
        <AppLayout />
      </ErrorProvider>
    </BrowserRouter>
  );
}

export default App;
