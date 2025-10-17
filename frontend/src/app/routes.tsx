import PaymentSchedulePage from '@/pages/PaymentSchedule/PaymentSchedulePage';
import { Routes, Route, Navigate } from 'react-router-dom';

export function AppRoutes(): React.JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<PaymentSchedulePage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
