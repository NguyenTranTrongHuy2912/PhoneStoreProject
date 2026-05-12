import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

/**
 * ✅ ProtectedRoute Component
 * Chỉ cho phép users đã authenticated truy cập
 */
function ProtectedRoute({ children }) {
  const { user, token } = useAuthStore();
  const isAuthenticated = !!token && !!user;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;

/**
 * ✅ AdminRoute Component
 * Chỉ cho phép admins truy cập
 */
export function AdminRoute({ children }) {
  const { user, token } = useAuthStore();
  const isAdmin = user?.role === 'admin';
  const isAuthenticated = !!token && !!user;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}