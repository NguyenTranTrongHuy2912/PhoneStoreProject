import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { HiOutlineSearch, HiOutlineHeart, HiOutlineShoppingCart, HiOutlineSparkles } from 'react-icons/hi';

function Navbar() {
  const navigate = useNavigate();
  const navItems = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Mobiles', path: '/mobiles' },
    { name: 'Laptops', path: '/laptops' },
    { name: 'Apple', path: '/apple' },
    { name: 'Samsung', path: '/samsung' },
    { name: 'Xiaomi', path: '/xiaomi' },
    { name: 'Accessories', path: '/accessories' },
    { name: 'Deals', path: '/deals' },
  ];

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
            <div className="relative cursor-pointer group">
              <HiOutlineShoppingCart className="text-2xl group-hover:text-blue-500 transition-colors" />
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                0
              </span>
            </div>
          </div>
          <div className="h-6 w-[1px] bg-gray-200 hidden sm:block"></div>
          <div className="flex items-center gap-4">
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
          </div>
        </div>
      </div>

      {/* Tầng 2: Navigation Links */}
      <div className="border-t border-gray-100 overflow-x-auto no-scrollbar">
        <div className="max-w-[1440px] mx-auto px-10 flex items-center justify-between">
          <div className="flex gap-12">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  text-base font-bold py-5 transition-all relative flex items-center
                  ${isActive
                    ? 'text-blue-600 after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600'
                    : 'text-gray-500 hover:text-blue-500'}
                `}
              >
                {item.name}
              </NavLink>
            ))}
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