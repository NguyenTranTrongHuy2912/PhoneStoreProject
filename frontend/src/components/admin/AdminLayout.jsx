import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  HiOutlineChartBar,
  HiOutlineCube,
  HiOutlineReceiptTax,
  HiOutlineUsers,
  HiOutlineTag,
  HiOutlineLogout,
  HiOutlineHome,
  HiMenuAlt2,
  HiX,
} from 'react-icons/hi';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';

const navItems = [
  { label: 'Dashboard',   path: '/admin/dashboard',   icon: HiOutlineChartBar },
  { label: 'Đơn hàng',   path: '/admin/orders',      icon: HiOutlineReceiptTax },
  { label: 'Sản phẩm',   path: '/admin/products',    icon: HiOutlineCube },
  { label: 'Người dùng', path: '/admin/users',        icon: HiOutlineUsers },
  { label: 'Danh mục',   path: '/admin/categories',  icon: HiOutlineTag },
];

function AdminLayout({ title, subtitle, children, actions }) {
  const { user, logout } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    addNotification({ type: 'success', message: 'Đã đăng xuất' });
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-5 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg">
            <span className="text-white font-black text-sm">PS</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">PhoneStore</p>
            <p className="text-indigo-300 text-xs">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-500 text-white shadow-md shadow-indigo-900/30'
                    : 'text-indigo-200 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon className="text-lg flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/10 space-y-1">
        <NavLink
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-indigo-200 hover:bg-white/10 hover:text-white transition-all"
        >
          <HiOutlineHome className="text-lg" />
          <span>Về trang chủ</span>
        </NavLink>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-indigo-200 hover:bg-red-500/20 hover:text-red-300 transition-all"
        >
          <HiOutlineLogout className="text-lg" />
          <span>Đăng xuất</span>
        </button>

        {/* User info */}
        <div className="flex items-center gap-3 px-3 py-3 mt-1 rounded-xl bg-white/5">
          <div className="w-8 h-8 rounded-full bg-indigo-400 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">
              {user?.fullname?.charAt(0)?.toUpperCase() || 'A'}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold truncate">{user?.fullname || 'Admin'}</p>
            <p className="text-indigo-300 text-[10px] truncate">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-gradient-to-b from-indigo-950 via-indigo-900 to-indigo-950 flex-shrink-0 fixed top-0 left-0 h-full z-30">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative w-60 bg-gradient-to-b from-indigo-950 via-indigo-900 to-indigo-950 flex flex-col z-50">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-indigo-300 hover:text-white p-1"
            >
              <HiX className="text-xl" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100"
            >
              <HiMenuAlt2 className="text-xl" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">{title}</h1>
              {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
