import React, { useState, useMemo, useCallback } from 'react';
import { HiOutlineSearch, HiChevronDown, HiChevronUp } from 'react-icons/hi';
import { useFetch, useMutate, useDebounce } from '@/hooks/useFetch';
import { orderService } from '@/services/orderService';
import { useNotificationStore } from '@/store/notificationStore';
import { formatDate, formatDateTime, formatPrice } from '@/lib/formatters';
import { ORDER_STATUS } from '@/lib/constants';
import AdminLayout from '@/components/admin/AdminLayout';
import StatusBadge from '@/components/admin/StatusBadge';
import Pagination from '@/components/admin/Pagination';

const PAGE_SIZE = 10;

const STATUS_OPTIONS = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: ORDER_STATUS.PROCESSING, label: 'Đang xử lý' },
  { value: ORDER_STATUS.SHIPPED,    label: 'Đã gửi hàng' },
  { value: ORDER_STATUS.DELIVERED,  label: 'Đã giao' },
  { value: ORDER_STATUS.CANCELLED,  label: 'Đã hủy' },
];

function AdminOrderPage() {
  const { addNotification } = useNotificationStore();
  const { data, isLoading, isError } = useFetch(['admin-orders'], () => orderService.getAll());
  const orders = data?.data || [];

  const [search, setSearch]         = useState('');
  const [statusFilter, setStatus]   = useState('');
  const [page, setPage]             = useState(1);
  const [expanded, setExpanded]     = useState(null);

  const debouncedSearch = useDebounce(search, 300);

  const updateMutation = useMutate(
    ({ orderId, status }) => orderService.updateStatus(orderId, status),
    [['admin-orders']],
    () => addNotification({ type: 'success', message: 'Đã cập nhật trạng thái' }),
    () => addNotification({ type: 'error',   message: 'Không thể cập nhật trạng thái' })
  );

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        !debouncedSearch ||
        o._id.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        o.userId?.fullname?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        o.userId?.email?.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchStatus = !statusFilter || o.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [orders, debouncedSearch, statusFilter]);

  const sorted = useMemo(
    () => [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [filtered]
  );

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paginated  = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilterChange = useCallback(() => setPage(1), []);

  const toggleExpand = (id) => setExpanded((prev) => (prev === id ? null : id));

  return (
    <AdminLayout title="Quản lý đơn hàng" subtitle="Cập nhật trạng thái và theo dõi đơn hàng">
      {/* ── Filters ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); handleFilterChange(); }}
              placeholder="Tìm theo mã đơn, tên khách hàng..."
              className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatus(e.target.value); handleFilterChange(); }}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 min-w-[170px]"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <div className="flex items-center text-sm text-gray-400 ml-auto">
            {filtered.length} đơn hàng
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading && (
          <div className="p-6 space-y-3">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        )}
        {isError && (
          <div className="px-6 py-10 text-center text-red-500 text-sm">Không thể tải đơn hàng.</div>
        )}
        {!isLoading && !isError && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wide">
                  <th className="px-6 py-3 text-left font-semibold w-8" />
                  <th className="px-6 py-3 text-left font-semibold">Mã đơn</th>
                  <th className="px-6 py-3 text-left font-semibold">Khách hàng</th>
                  <th className="px-6 py-3 text-left font-semibold">Ngày đặt</th>
                  <th className="px-6 py-3 text-left font-semibold">SP</th>
                  <th className="px-6 py-3 text-left font-semibold">Tổng tiền</th>
                  <th className="px-6 py-3 text-left font-semibold">Trạng thái</th>
                  <th className="px-6 py-3 text-left font-semibold">Cập nhật</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((order) => (
                  <React.Fragment key={order._id}>
                    <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      {/* Expand toggle */}
                      <td className="pl-6 py-3.5">
                        <button
                          onClick={() => toggleExpand(order._id)}
                          className="p-1 rounded-lg text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 transition-colors"
                        >
                          {expanded === order._id
                            ? <HiChevronUp className="text-base" />
                            : <HiChevronDown className="text-base" />}
                        </button>
                      </td>
                      <td className="px-6 py-3.5 font-mono text-xs text-gray-500">
                        #{order._id.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-6 py-3.5">
                        <div>
                          <p className="font-medium text-gray-800">
                            {order.userId?.fullname || 'Khách hàng'}
                          </p>
                          <p className="text-xs text-gray-400">{order.userId?.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-gray-500 text-xs">
                        {formatDateTime(order.createdAt)}
                      </td>
                      <td className="px-6 py-3.5 text-gray-500">
                        {order.items?.length || 0}
                      </td>
                      <td className="px-6 py-3.5 font-bold text-gray-900">
                        {formatPrice(order.totalAmount)}
                      </td>
                      <td className="px-6 py-3.5">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-3.5">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateMutation.mutate({ orderId: order._id, status: e.target.value })
                          }
                          className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        >
                          {Object.values(ORDER_STATUS).map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>

                    {/* Expandable row — order items */}
                    {expanded === order._id && (
                      <tr className="bg-indigo-50/30">
                        <td colSpan={8} className="px-8 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Items list */}
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Sản phẩm</p>
                              <div className="space-y-2">
                                {order.items?.map((item, i) => (
                                  <div key={i} className="flex items-center gap-3 bg-white rounded-xl px-4 py-2.5 border border-gray-100">
                                    <span className="text-sm font-medium text-gray-800 flex-1">
                                      {item.productId?.name || item.productId || 'Sản phẩm'}
                                    </span>
                                    {item.variant && (
                                      <span className="text-xs text-gray-400">
                                        {[item.variant.color, item.variant.storage].filter(Boolean).join(' / ')}
                                      </span>
                                    )}
                                    <span className="text-xs text-gray-500">×{item.quantity}</span>
                                    <span className="text-sm font-semibold text-indigo-600 ml-2">
                                      {formatPrice((item.variant?.price || 0) * item.quantity)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Shipping address */}
                            {order.shippingAddress && (
                              <div>
                                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Địa chỉ giao hàng</p>
                                <div className="bg-white rounded-xl px-4 py-3 border border-gray-100 text-sm text-gray-600 space-y-0.5">
                                  <p className="font-medium text-gray-800">{order.shippingAddress.street}</p>
                                  <p>{order.shippingAddress.city}{order.shippingAddress.state ? `, ${order.shippingAddress.state}` : ''}</p>
                                  <p>{order.shippingAddress.country}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-14 text-center text-gray-400">
                      Không tìm thấy đơn hàng nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-50">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminOrderPage;