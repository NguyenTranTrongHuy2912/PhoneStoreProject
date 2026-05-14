import React, { useMemo } from 'react';
import {
  HiOutlineChartBar,
  HiOutlineCube,
  HiOutlineReceiptTax,
  HiOutlineUsers,
} from 'react-icons/hi';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useFetch } from '@/hooks/useFetch';
import { productService } from '@/services/productService';
import { orderService } from '@/services/orderService';
import { userService } from '@/services/userService';
import { formatPrice, formatDate } from '@/lib/formatters';
import { ORDER_STATUS } from '@/lib/constants';
import AdminLayout from '@/components/admin/AdminLayout';
import StatsCard from '@/components/admin/StatsCard';
import StatusBadge from '@/components/admin/StatusBadge';

// Donut chart colors
const STATUS_COLORS = {
  [ORDER_STATUS.PROCESSING]: '#f59e0b',
  [ORDER_STATUS.SHIPPED]:    '#3b82f6',
  [ORDER_STATUS.DELIVERED]:  '#10b981',
  [ORDER_STATUS.CANCELLED]:  '#ef4444',
};

// Custom tooltip for AreaChart
const RevenueTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-sm">
        <p className="font-semibold text-gray-700 mb-1">{label}</p>
        <p className="text-indigo-600 font-bold">{formatPrice(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

function AdminDashboardPage() {
  const { data: productData, isLoading: prodLoading } = useFetch(
    ['admin-products'],
    () => productService.getAll()
  );
  const { data: orderData, isLoading: orderLoading } = useFetch(
    ['admin-orders'],
    () => orderService.getAll()
  );
  const { data: userData, isLoading: userLoading } = useFetch(
    ['admin-users'],
    () => userService.getAllUsers()
  );

  const products = productData?.data || [];
  const orders   = orderData?.data   || [];
  const users    = userData?.data    || [];

  // ── KPI calculations ─────────────────────────────────────
  const totalRevenue = useMemo(
    () => orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
    [orders]
  );

  // ── Revenue by day (last 14 days) ────────────────────────
  const revenueByDay = useMemo(() => {
    const map = {};
    const today = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = formatDate(d, 'DD/MM');
      map[key] = 0;
    }
    orders.forEach((o) => {
      const key = formatDate(o.createdAt, 'DD/MM');
      if (key in map) map[key] += o.totalAmount || 0;
    });
    return Object.entries(map).map(([date, revenue]) => ({ date, revenue }));
  }, [orders]);

  // ── Orders by status ────────────────────────────────────
  const ordersByStatus = useMemo(() => {
    const statusLabels = {
      [ORDER_STATUS.PROCESSING]: 'Đang xử lý',
      [ORDER_STATUS.SHIPPED]:    'Đã gửi',
      [ORDER_STATUS.DELIVERED]:  'Đã giao',
      [ORDER_STATUS.CANCELLED]:  'Đã hủy',
    };
    return Object.values(ORDER_STATUS).map((status) => ({
      name:  statusLabels[status],
      value: orders.filter((o) => o.status === status).length,
      status,
    })).filter((d) => d.value > 0);
  }, [orders]);

  // ── Recent orders (last 8) ────────────────────────────────
  const recentOrders = useMemo(
    () => [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8),
    [orders]
  );

  const isLoading = prodLoading || orderLoading || userLoading;

  return (
    <AdminLayout title="Dashboard" subtitle="Tổng quan hoạt động của cửa hàng">
      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          icon={HiOutlineChartBar}
          label="Tổng doanh thu"
          value={formatPrice(totalRevenue)}
          color="blue"
          loading={isLoading}
        />
        <StatsCard
          icon={HiOutlineReceiptTax}
          label="Tổng đơn hàng"
          value={orders.length.toLocaleString('vi')}
          color="amber"
          loading={isLoading}
        />
        <StatsCard
          icon={HiOutlineCube}
          label="Sản phẩm"
          value={products.length.toLocaleString('vi')}
          color="emerald"
          loading={isLoading}
        />
        <StatsCard
          icon={HiOutlineUsers}
          label="Người dùng"
          value={users.length.toLocaleString('vi')}
          color="violet"
          loading={isLoading}
        />
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Revenue AreaChart */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="mb-5">
            <h2 className="text-base font-bold text-gray-900">Doanh thu 14 ngày qua</h2>
            <p className="text-xs text-gray-400 mt-0.5">Theo ngày</p>
          </div>
          {isLoading ? (
            <div className="h-52 bg-gray-50 rounded-xl animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={revenueByDay} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  tickLine={false}
                  axisLine={false}
                  interval={1}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) =>
                    v >= 1_000_000
                      ? `${(v / 1_000_000).toFixed(0)}M`
                      : v >= 1_000
                      ? `${(v / 1_000).toFixed(0)}K`
                      : v
                  }
                  width={45}
                />
                <Tooltip content={<RevenueTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fill="url(#revenueGrad)"
                  dot={false}
                  activeDot={{ r: 5, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Orders PieChart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="mb-5">
            <h2 className="text-base font-bold text-gray-900">Đơn hàng theo trạng thái</h2>
            <p className="text-xs text-gray-400 mt-0.5">Phân bổ hiện tại</p>
          </div>
          {isLoading ? (
            <div className="h-52 bg-gray-50 rounded-xl animate-pulse" />
          ) : ordersByStatus.length === 0 ? (
            <div className="h-52 flex items-center justify-center text-gray-400 text-sm">
              Chưa có đơn hàng
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={ordersByStatus}
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {ordersByStatus.map((entry) => (
                    <Cell
                      key={entry.status}
                      fill={STATUS_COLORS[entry.status] || '#94a3b8'}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} đơn`, name]}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ── Recent Orders Table ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">Đơn hàng gần đây</h2>
          <span className="text-xs text-gray-400">{recentOrders.length} đơn hàng mới nhất</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 uppercase tracking-wide border-b border-gray-50">
                <th className="px-6 py-3 text-left font-semibold">Mã đơn</th>
                <th className="px-6 py-3 text-left font-semibold">Khách hàng</th>
                <th className="px-6 py-3 text-left font-semibold">Ngày đặt</th>
                <th className="px-6 py-3 text-left font-semibold">Trạng thái</th>
                <th className="px-6 py-3 text-right font-semibold">Tổng tiền</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-3.5 font-mono text-xs text-gray-500">
                    #{order._id.slice(-8).toUpperCase()}
                  </td>
                  <td className="px-6 py-3.5 font-medium text-gray-800">
                    {order.userId?.fullname || 'Khách hàng'}
                  </td>
                  <td className="px-6 py-3.5 text-gray-500">
                    {formatDate(order.createdAt, 'DD/MM/YYYY')}
                  </td>
                  <td className="px-6 py-3.5">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-3.5 text-right font-bold text-gray-900">
                    {formatPrice(order.totalAmount)}
                  </td>
                </tr>
              ))}
              {!isLoading && recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                    Chưa có đơn hàng nào.
                  </td>
                </tr>
              )}
              {isLoading && (
                <tr>
                  <td colSpan={5} className="px-6 py-6">
                    <div className="space-y-2">
                      {[1,2,3].map(i => (
                        <div key={i} className="h-4 bg-gray-100 rounded animate-pulse" />
                      ))}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboardPage;