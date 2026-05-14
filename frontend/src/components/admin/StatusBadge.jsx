import React from 'react';

const STATUS_CONFIG = {
  // Order statuses
  Processing: { label: 'Đang xử lý', cls: 'bg-amber-100 text-amber-700 border-amber-200' },
  Shipped:    { label: 'Đã gửi hàng', cls: 'bg-blue-100 text-blue-700 border-blue-200' },
  Delivered:  { label: 'Đã giao', cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  Cancelled:  { label: 'Đã hủy', cls: 'bg-red-100 text-red-700 border-red-200' },
  // User roles
  admin:      { label: 'Admin', cls: 'bg-violet-100 text-violet-700 border-violet-200' },
  customer:   { label: 'Khách hàng', cls: 'bg-slate-100 text-slate-600 border-slate-200' },
};

/**
 * StatusBadge — color-coded pill for order status / user role
 */
function StatusBadge({ status, size = 'sm' }) {
  const config = STATUS_CONFIG[status] || {
    label: status,
    cls: 'bg-gray-100 text-gray-600 border-gray-200',
  };

  const sizeClass = size === 'xs' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center rounded-full border font-semibold whitespace-nowrap ${sizeClass} ${config.cls}`}
    >
      {config.label}
    </span>
  );
}

export default StatusBadge;
