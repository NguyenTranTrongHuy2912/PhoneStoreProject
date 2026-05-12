import React from 'react';
import { HiOutlineReceiptTax } from 'react-icons/hi';
import { useFetch } from '@/hooks/useFetch';
import { useAuthStore } from '@/store/authStore';
import { orderService } from '@/services/orderService';
import { formatDateTime, formatPrice, getStatusBadgeLabel } from '@/lib/formatters';

function OrderHistoryPage() {
  const { user } = useAuthStore();
  const { data, isLoading, isError } = useFetch(
    ['orders', user?._id],
    () => orderService.getUserOrders(user._id),
    { enabled: Boolean(user?._id) }
  );

  const orders = data?.data || [];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[1100px] mx-auto px-10 py-10 space-y-6">
        <div className="flex items-center gap-3 text-gray-900">
          <HiOutlineReceiptTax className="text-2xl text-blue-500" />
          <h1 className="text-2xl font-bold">Lich su don hang</h1>
        </div>

        {isLoading && <div className="text-gray-500">Dang tai don hang...</div>}
        {isError && <div className="text-red-500">Khong the tai don hang.</div>}

        {!isLoading && !isError && orders.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center text-gray-500">
            Ban chua co don hang nao.
          </div>
        )}

        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500">Ma don: {order._id}</p>
                  <p className="text-sm text-gray-400">{formatDateTime(order.createdAt)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-blue-600">
                    {getStatusBadgeLabel(order.status)}
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                {order.items.length} san pham
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OrderHistoryPage;