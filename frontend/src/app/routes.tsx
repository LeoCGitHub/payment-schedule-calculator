import { Routes, Route, Navigate } from 'react-router-dom';
import PaymentSchedulePage from '../pages/PaymentSchedule/PaymentSchedulePage';

/**
 * Application routes configuration
 * Defines all available routes and redirections
 */
export function AppRoutes(): React.JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<PaymentSchedulePage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
