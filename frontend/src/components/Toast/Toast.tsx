import { useEffect } from 'react';
import './Toast.scss';

export type ToastType = 'error' | 'success' | 'info';

export interface ToastProps {
  message: string;
  type?: ToastType;
  onClose?: () => void;
  duration?: number;
}

export default function Toast({
  message,
  type = 'error',
  onClose,
  duration = 5000,
}: ToastProps): React.JSX.Element | null {
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!message) return null;

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-content">
        <span className="toast-icon">
          {type === 'error' && '❌'}
          {type === 'success' && '✅'}
          {type === 'info' && 'ℹ️'}
        </span>
        <span className="toast-message">{message}</span>
      </div>
      {onClose && (
        <button className="toast-close" onClick={onClose} aria-label="Fermer">
          ×
        </button>
      )}
    </div>
  );
}
