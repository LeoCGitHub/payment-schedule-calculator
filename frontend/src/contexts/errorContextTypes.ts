import { createContext } from 'react';

export interface ErrorContextType {
  error: string | null;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const ErrorContext = createContext<ErrorContextType | undefined>(
  undefined
);
