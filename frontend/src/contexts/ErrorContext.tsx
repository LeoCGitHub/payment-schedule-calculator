import { useState, ReactNode } from 'react';
import { ErrorContext } from './errorContextTypes';

/**
 * Error Provider Component
 * Provides global error state management for the application
 */
export function ErrorProvider({
  children,
}: {
  children: ReactNode;
}): React.JSX.Element {
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  return (
    <ErrorContext.Provider value={{ error, setError, clearError }}>
      {children}
    </ErrorContext.Provider>
  );
}
