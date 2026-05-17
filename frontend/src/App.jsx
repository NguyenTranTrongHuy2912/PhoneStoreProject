import React, { Suspense, lazy } from 'react';
import './App.css';
import { Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import { useCheckAuth } from '@/hooks/useAuth';

// Pages — Customer (Lazy loaded)
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ProductListPage = lazy(() => import('./pages/ProductListPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage'));
const VnpayReturnPage = lazy(() => import('./pages/VnpayReturnPage'));
const OrderHistoryPage = lazy(() => import('./pages/OrderHistoryPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Pages — Admin (Lazy loaded)
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
const AdminProductPage = lazy(() => import('./pages/AdminProductPage'));
const AdminOrderPage = lazy(() => import('./pages/AdminOrderPage'));
const AdminUsersPage = lazy(() => import('./pages/AdminUsersPage'));
const AdminCategoryPage = lazy(() => import('./pages/AdminCategoryPage'));

import ToastContainer from './components/common/ToastContainer';
import ErrorBoundary from './components/common/ErrorBoundary';

// Routes
import ProtectedRoute, { AdminRoute } from './components/auth/ProtectedRoute';
import Layout from './components/common/Layout';

/**
 * Loading Fallback for Suspense
 */
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-gray-500 font-medium">Đang tải...</div>
      </div>
    </div>
  );
}

function AdminShell() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </ErrorBoundary>
  );
}

function App() {
  useCheckAuth();

  return (
    <>
      <ScrollToTop />
      {/* Toast notifications visible across all layouts */}
      <ToastContainer />

      <Routes>
        {/* ── Customer routes ────────────────────────────── */}
        <Route element={<Layout />}>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />

          {/* Protected (customer) */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-success/:orderId"
            element={
              <ProtectedRoute>
                <OrderSuccessPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout/vnpay-return"
            element={
              <ProtectedRoute>
                <VnpayReturnPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrderHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* 404 — also uses customer layout */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* ── Admin routes — completely separate shell ────── */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminShell />
            </AdminRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="products" element={<AdminProductPage />} />
          <Route path="orders" element={<AdminOrderPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="categories" element={<AdminCategoryPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;