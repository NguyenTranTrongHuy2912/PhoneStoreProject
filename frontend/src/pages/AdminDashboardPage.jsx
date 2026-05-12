import React, { useMemo } from 'react';
import { HiOutlineChartBar, HiOutlineCube, HiOutlineReceiptTax, HiOutlineUsers } from 'react-icons/hi';
import { useFetch } from '@/hooks/useFetch';
import { productService } from '@/services/productService';
import { orderService } from '@/services/orderService';
import { userService } from '@/services/userService';
import { formatPrice } from '@/lib/formatters';
import AdminLayout from '@/components/admin/AdminLayout';

function AdminDashboardPage() {
  const { data: productData } = useFetch(['admin-products'], () => productService.getAll());
  const { data: orderData } = useFetch(['admin-orders'], () => orderService.getAll());
  const { data: userData } = useFetch(['admin-users'], () => userService.getAllUsers());

  const products = productData?.data || [];
  const orders = orderData?.data || [];
  const users = userData?.data || [];

  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  }, [orders]);

  return (
    <AdminLayout title="Admin Dashboard" subtitle="Tong quan hoat dong cua cua hang">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-2">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-sm font-semibold">Doanh thu</span>
              <HiOutlineChartBar className="text-xl" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{formatPrice(totalRevenue)}</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-2">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-sm font-semibold">Don hang</span>
              <HiOutlineReceiptTax className="text-xl" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{orders.length}</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-2">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-sm font-semibold">San pham</span>
              <HiOutlineCube className="text-xl" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{products.length}</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-2">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-sm font-semibold">Nguoi dung</span>
              <HiOutlineUsers className="text-xl" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{users.length}</div>
          </div>
        </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Don hang moi nhat</h2>
        <div className="space-y-3 text-sm text-gray-600">
          {orders.slice(0, 5).map((order) => (
            <div key={order._id} className="flex items-center justify-between">
              <span>{order._id}</span>
              <span className="font-semibold text-gray-900">{formatPrice(order.totalAmount)}</span>
            </div>
          ))}
          {orders.length === 0 && <div className="text-gray-400">Chua co don hang.</div>}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboardPage;