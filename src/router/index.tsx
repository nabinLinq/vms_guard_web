import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

// Feature Pages
import { LoginPage } from '../features/auth/LoginPage/LoginPage';
import { ForgotPasswordPage } from '../features/auth/ForgotPasswordPage/ForgotPasswordPage';
import { OtpVerificationPage } from '../features/auth/OtpVerificationPage/OtpVerificationPage';
import { ResetPasswordPage } from '../features/auth/ResetPasswordPage/ResetPasswordPage';

import { DashboardLayout } from '../features/dashboard/DashboardLayout/DashboardLayout';
import { VisitDetailPage } from '../features/visits/VisitDetailPage/VisitDetailPage';
import { WalkInPage } from '../features/walkin/WalkInPage/WalkInPage';
import { NoticesPage } from '../features/notices/NoticesPage/NoticesPage';
import { ScannerPage } from '../features/scanner/ScannerPage/ScannerPage';
import { GuardProfilePage } from '../features/profile/GuardProfilePage/GuardProfilePage';
import { ChangePasswordPage } from '../features/profile/ChangePasswordPage/ChangePasswordPage';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/otp-verification" element={<OtpVerificationPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />} />
        <Route path="/dashboard/scan" element={<ScannerPage />} />
        <Route path="/dashboard/visit/:id" element={<VisitDetailPage />} />
        <Route path="/dashboard/walkin" element={<WalkInPage />} />
        <Route path="/dashboard/profile" element={<GuardProfilePage />} />
        <Route path="/dashboard/change-password" element={<ChangePasswordPage />} />
        <Route path="/dashboard/notices" element={<NoticesPage />} />
      </Route>
    </Routes>
  );
}
