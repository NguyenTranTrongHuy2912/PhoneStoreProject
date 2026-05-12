import React from 'react';
import { useFetch, useMutate } from '@/hooks/useFetch';
import { orderService } from '@/services/orderService';
import { useNotificationStore } from '@/store/notificationStore';
import { formatDateTime, formatPrice, getStatusBadgeLabel } from '@/lib/formatters';
import { ORDER_STATUS } from '@/lib/constants';
import AdminLayout from '@/components/admin/AdminLayout';

function AdminOrderPage() {
  const { addNotification } = useNotificationStore();
  const { data, isLoading, isError } = useFetch(['admin-orders'], () => orderService.getAll());
  const updateMutation = useMutate(
    ({ orderId, status }) => orderService.updateStatus(orderId, status),
    [['admin-orders']],
    () => addNotification({ type: 'success', message: 'Da cap nhat trang thai' }),
    () => addNotification({ type: 'error', message: 'Khong the cap nhat trang thai' })
  );

  const orders = data?.data || [];

  return (
    <AdminLayout title="Quan ly don hang" subtitle="Cap nhat trang thai va theo doi don">
      {isLoading && <div className="text-gray-500">Dang tai don hang...</div>}
      {isError && <div className="text-red-500">Khong the tai don hang.</div>}

      <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-gray-500">Ma don: {order._id}</div>
                  <div className="text-sm text-gray-400">{formatDateTime(order.createdAt)}</div>
                  <div className="text-sm text-gray-600">
                    Khach hang: {order.userId?.fullname || 'Khach hang'}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="text-lg font-bold text-gray-900">
                    {formatPrice(order.totalAmount)}
                  </div>
                  <div className="text-sm text-blue-600 font-semibold">
                    {getStatusBadgeLabel(order.status)}
                  </div>
                  <select
                    value={order.status}
                    onChange={(event) =>
                      updateMutation.mutate({ orderId: order._id, status: event.target.value })
                    }
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  >
                    {Object.values(ORDER_STATUS).map((status) => (
                      <option key={status} value={status}>
                        {getStatusBadgeLabel(status)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-600">{order.items.length} san pham</div>
            </div>
          ))}
          {orders.length === 0 && !isLoading && !isError && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center text-gray-400">
              Chua co don hang.
            </div>
          )}
      </div>
    </AdminLayout>
  );
}

export default AdminOrderPage;