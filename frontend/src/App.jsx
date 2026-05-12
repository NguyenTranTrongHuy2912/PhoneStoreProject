import { useEffect } from 'react'
import './App.css'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useCheckAuth } from '@/hooks/useAuth';

// Pages
import HomePage from './pages/HomePage';   
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';



import RegisterPage from './pages/RegisterPage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminProductPage from './pages/AdminProductPage';
import AdminOrderPage from './pages/AdminOrderPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminCategoryPage from './pages/AdminCategoryPage';

// Routes
import ProtectedRoute, { AdminRoute } from './components/auth/ProtectedRoute';


function App() {
  useCheckAuth();
  const [count, setCount] = useState(0)

  return (
    <div className="app-container flex flex-col min-h-screen">
      <Navbar />  

      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          {/* Thêm các route khác ở đây */}
          {/* <Route path="/register" element={<RegisterPage />} /> */}
           <Route path="/register" element={<RegisterPage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />

          {/* Protected Routes */}
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

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <AdminRoute>
                <AdminProductPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <AdminOrderPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsersPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <AdminRoute>
                <AdminCategoryPage />
              </AdminRoute>
            }
          />


        </Routes>

        {/* Khu vực test hiển thị ProductCard */}
        <div className="p-10 flex justify-center bg-gray-50">
          <ProductCard product={mockProduct} />
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default App