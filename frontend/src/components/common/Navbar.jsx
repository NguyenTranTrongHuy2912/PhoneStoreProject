import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { HiOutlineSearch, HiOutlineHeart, HiOutlineShoppingCart, HiOutlineSparkles, HiOutlineUser, HiOutlineLogout } from 'react-icons/hi';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useAuth } from '@/hooks/useAuth';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const { logout } = useAuth();
  const { items: cartItems } = useCartStore();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navItems = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Mobiles', path: '/products?category=mobile', key: 'category-mobile' },
    { name: 'Laptops', path: '/products?category=laptop', key: 'category-laptop' },
    { name: 'Apple', path: '/products?brand=apple', key: 'brand-apple' },
    { name: 'Samsung', path: '/products?brand=samsung', key: 'brand-samsung' },
    { name: 'Xiaomi', path: '/products?brand=xiaomi', key: 'brand-xiaomi' },
    { name: 'Accessories', path: '/products?category=accessories', key: 'category-accessories' },
    { name: 'Deals', path: '/products?deals=true', key: 'deals' },
  ];

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  /**
   * Check if nav item is active based on current location
   */
  const isNavItemActive = (item) => {
    if (item.path === '/') {
      return location.pathname === '/';
    }

    // Extract query params from item path
    const [path, queryString] = item.path.split('?');
    
    if (location.pathname !== path) {
      return false;
    }

    if (!queryString) {
      return location.search === '';
    }

    // Parse query params
    const itemParams = new URLSearchParams(queryString);
    const currentParams = new URLSearchParams(location.search);

    // Check if all query params match
    for (const [key, value] of itemParams) {
      if (currentParams.get(key) !== value) {
        return false;
      }
    }

    return true;
  };

  return (
    <nav className="w-full border-b border-gray-200 bg-white sticky top-0 z-50">
      {/* Tầng 1: Main Header */}
      <div className="max-w-[1440px] mx-auto px-10 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-blue-600 shrink-0">
          <img src="/favicon.svg" alt="Logo" className="w-8 h-8" />
          <span>PhoneStore</span>
        </Link>

        {/* Thanh Tìm kiếm AI */}
        <div className="flex-1 max-w-2xl mx-12 relative hidden lg:block">
          <div className="relative flex items-center">
            <HiOutlineSearch className="absolute left-4 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Tìm kiếm bằng AI: 'Điện thoại chụp ảnh đẹp dưới 15 triệu'..."
              className="w-full pl-12 pr-28 py-2.5 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-sm"
            />
            <button className="absolute right-1.5 bg-blue-500 hover:bg-blue-600 text-white px-5 py-1.5 rounded-full text-sm font-medium transition-colors">
              AI Search
            </button>
          </div>
        </div>

        {/* Action Icons & Auth */}
        <div className="flex items-center gap-8 shrink-0">
          <div className="flex items-center gap-5 text-gray-600">
            <HiOutlineHeart className="text-2xl cursor-pointer hover:text-blue-500 transition-colors" />
            <div
              className="relative cursor-pointer group"
              onClick={() => navigate('/cart')}
            >
              <HiOutlineShoppingCart className="text-2xl group-hover:text-blue-500 transition-colors" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {cartItems.length}
                </span>
              )}
            </div>
          </div>
          <div className="h-6 w-[1px] bg-gray-200 hidden sm:block"></div>
          <div className="flex items-center gap-4">
<<<<<<< HEAD
            {user ? (
              // Authenticated user menu
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <HiOutlineUser className="text-2xl" />
                  <span className="hidden sm:inline text-sm font-semibold">{user.fullname}</span>
                </button>

                {/* User Menu Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <HiOutlineUser size={18} />
                      <span>Thông tin cá nhân</span>
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <HiOutlineShoppingCart size={18} />
                      <span>Đơn hàng của tôi</span>
                    </Link>

                    {user.role === 'admin' && (
                      <>
                        <div className="border-t border-gray-200 my-2"></div>
                        <Link
                          to="/admin/dashboard"
                          className="flex items-center gap-3 px-4 py-2 text-blue-600 hover:bg-blue-50 transition-colors font-semibold"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <HiOutlineSparkles size={18} />
                          <span>Admin Panel</span>
                        </Link>
                      </>
                    )}

                    <div className="border-t border-gray-200 my-2"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <HiOutlineLogout size={18} />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Not authenticated
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="text-blue-500 text-sm font-semibold px-5 py-2.5 rounded-full border border-blue-500 hover:bg-blue-50 transition-colors active:scale-95"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="bg-blue-500 text-white text-sm font-semibold px-7 py-2.5 rounded-full hover:bg-blue-600 shadow-md transition-all active:scale-95"
                >
                  Đăng ký
                </button>
              </>
            )}
=======
            <button
              onClick={() => navigate('/login')}
              className="text-blue-500 text-sm font-semibold px-5 py-2.5 rounded-full border border-blue-500 hover:bg-blue-50 transition-colors active:scale-95"
            >
              Đăng nhập
            </button>
            <button
              onClick={() => navigate('/register')}
              className="bg-blue-500 text-white text-sm font-semibold px-7 py-2.5 rounded-full hover:bg-blue-600 shadow-md transition-all active:scale-95"
            >
              Đăng ký
            </button>
>>>>>>> 56e53788fee1d870ad1f1f8b8c1fd6a95d478060
          </div>
        </div>
      </div>

      {/* Tầng 2: Navigation Links */}
      <div className="border-t border-gray-100 overflow-x-auto no-scrollbar">
        <div className="max-w-[1440px] mx-auto px-10 flex items-center justify-between">
          <div className="flex gap-12">
            {navItems.map((item) => {
              const isActive = isNavItemActive(item);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    text-base font-bold py-5 transition-all relative flex items-center
                    ${isActive
                      ? 'text-blue-600 after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600'
                      : 'text-gray-500 hover:text-blue-500'}
                  `}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-gray-700 font-extrabold cursor-pointer hover:text-blue-600 transition-colors py-5">
            <HiOutlineSparkles className="text-blue-400 text-xl" />
            <span className="text-base uppercase tracking-wide"> AI Gợi ý</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;