import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { isAuthenticated, currentUser } = useAuth();

  if (!isAuthenticated) {
    const isSessionClosed = localStorage.getItem('sessionClosed') === 'true';
    if (isSessionClosed) {
      return <Navigate to="/session-closed" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && currentUser?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
