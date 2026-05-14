import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

/**
 * ProtectedRoute — chỉ cho phép users đã đăng nhập
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
 * AdminRoute — chỉ cho phép admin truy cập
 * Hỗ trợ cả children (single page) và Outlet (nested routes)
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

  // Nếu không có children thì render Outlet (nested route pattern)
  return children ?? <Outlet />;
}