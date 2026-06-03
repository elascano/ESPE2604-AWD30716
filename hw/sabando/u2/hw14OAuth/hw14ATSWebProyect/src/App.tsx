import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/routing/ProtectedRoute';

import LandingPage from './pages/Landing/Landing';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';
import SessionClosedPage from './pages/Auth/SessionClosedPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import SriConnectionPage from './pages/SriConnection/SriConnectionPage';
import InvoicesDownloadPage from './pages/Invoices/InvoicesDownloadPage';
import InvoicesManagePage from './pages/Invoices/InvoicesManagePage';
import AtsGeneratePage from './pages/ATS/AtsGeneratePage';
import AtsValidatePage from './pages/ATS/AtsValidatePage';
import AtsExportPage from './pages/ATS/AtsExportPage';
import TraceabilityPage from './pages/Traceability/TraceabilityPage';
import SupportPage from './pages/Support/SupportPage';
import ProfilePage from './pages/Profile/ProfilePage';
import AdminDashboardPage from './pages/Admin/AdminDashboardPage';
import AdminUsersPage from './pages/Admin/AdminUsersPage';
import AdminAuditPage from './pages/Admin/AdminAuditPage';
import AdminSettingsPage from './pages/Admin/AdminSettingsPage';

import './styles/global.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/session-closed" element={<SessionClosedPage />} />

          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/sri-connection" element={<ProtectedRoute><SriConnectionPage /></ProtectedRoute>} />
          <Route path="/invoices/download" element={<ProtectedRoute><InvoicesDownloadPage /></ProtectedRoute>} />
          <Route path="/invoices/manage" element={<ProtectedRoute><InvoicesManagePage /></ProtectedRoute>} />
          <Route path="/ats/generate" element={<ProtectedRoute><AtsGeneratePage /></ProtectedRoute>} />
          <Route path="/ats/validate" element={<ProtectedRoute><AtsValidatePage /></ProtectedRoute>} />
          <Route path="/ats/export" element={<ProtectedRoute><AtsExportPage /></ProtectedRoute>} />
          <Route path="/traceability" element={<ProtectedRoute><TraceabilityPage /></ProtectedRoute>} />
          <Route path="/support" element={<ProtectedRoute><SupportPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

          <Route path="/admin/dashboard" element={<ProtectedRoute requireAdmin><AdminDashboardPage /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute requireAdmin><AdminUsersPage /></ProtectedRoute>} />
          <Route path="/admin/audit" element={<ProtectedRoute requireAdmin><AdminAuditPage /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute requireAdmin><AdminSettingsPage /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
