import './App.css';
import { Routes, Route, Outlet, useLocation } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import { useCheckAuth } from '@/hooks/useAuth';

// Pages — Customer
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import VnpayReturnPage from './pages/VnpayReturnPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

// Pages — Admin
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminProductPage from './pages/AdminProductPage';
import AdminOrderPage from './pages/AdminOrderPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminCategoryPage from './pages/AdminCategoryPage';

// Common
import ToastContainer from './components/common/ToastContainer';
import ErrorBoundary from './components/common/ErrorBoundary';

// Route guards
import ProtectedRoute, { AdminRoute } from './components/auth/ProtectedRoute';
import ScrollToTop from './components/common/ScrollToTop';

/**
 * CustomerLayout — wraps all customer-facing pages with Navbar + Footer
 */
function CustomerLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}

/**
 * AdminShell — admin pages render their own AdminLayout (dark sidebar)
 * NO Navbar / Footer here — completely separate shell
 */
function AdminShell() {
  return (
    <ErrorBoundary>
      <Outlet />
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
        <Route element={<CustomerLayout />}>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
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