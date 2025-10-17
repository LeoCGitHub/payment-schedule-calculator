import { useContext } from 'react';
import { ErrorContext } from '../contexts/errorContextTypes';

/**
 * Custom hook to use the Error Context
 * @throws Error if used outside of ErrorProvider
 */
export function useError() {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
}
