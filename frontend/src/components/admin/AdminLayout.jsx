import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HiOutlineChartBar,
  HiOutlineCube,
  HiOutlineReceiptTax,
  HiOutlineUsers,
  HiOutlineTag,
} from 'react-icons/hi';

const navItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: HiOutlineChartBar },
  { label: 'Orders', path: '/admin/orders', icon: HiOutlineReceiptTax },
  { label: 'Products', path: '/admin/products', icon: HiOutlineCube },
  { label: 'Users', path: '/admin/users', icon: HiOutlineUsers },
  { label: 'Categories', path: '/admin/categories', icon: HiOutlineTag },
];

function AdminLayout({ title, subtitle, children }) {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-8 py-10 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
        <aside className="bg-white border border-gray-200 rounded-2xl p-5 h-fit">
          <div className="text-sm uppercase tracking-wide text-gray-400">Admin</div>
          <nav className="mt-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`
                  }
                >
                  <Icon className="text-lg" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </aside>

        <section className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>

          <div className="space-y-6">{children}</div>
        </section>
      </div>
    </div>
  );
}

export default AdminLayout;
