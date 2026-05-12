import dayjs from 'dayjs';
import 'dayjs/locale/vi';

dayjs.locale('vi');

/**
 * ✅ Format Helpers
 * Hàm format dữ liệu để hiển thị
 */

/**
 * Format price to VND currency
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};

/**
 * Format simple number with thousand separators
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('vi-VN').format(num);
};

/**
 * Format date to Vietnamese format
 */
export const formatDate = (date: string | Date, format: string = 'DD/MM/YYYY'): string => {
  return dayjs(date).format(format);
};

/**
 * Format date with time
 */
export const formatDateTime = (date: string | Date): string => {
  return dayjs(date).format('DD/MM/YYYY HH:mm');
};

/**
 * Format relative time (e.g., "2 ngày trước")
 */
export const formatRelativeTime = (date: string | Date): string => {
  return dayjs(date).fromNow();
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Format percent
 */
export const formatPercent = (value: number, decimals: number = 0): string => {
  return (value * 100).toFixed(decimals) + '%';
};

/**
 * Format product slug
 */
export const formatSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Format product name (capitalize first letter of each word)
 */
export const formatProductName = (name: string): string => {
  return name
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Format phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  // Format: 0386 xxx xxx
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length !== 10) return phone;
  
  return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
};

/**
 * Format email (obfuscate for privacy)
 */
export const formatEmailObfuscated = (email: string): string => {
  const [name, domain] = email.split('@');
  const obfuscated = name.slice(0, 2) + '*'.repeat(Math.max(0, name.length - 4)) + name.slice(-2);
  return `${obfuscated}@${domain}`;
};

/**
 * Format address for display
 */
export const formatAddress = (address: {
  street: string;
  city: string;
  state: string;
  country: string;
}): string => {
  return `${address.street}, ${address.city}, ${address.state}, ${address.country}`;
};

/**
 * Format order ID (with prefix)
 */
export const formatOrderId = (id: string): string => {
  return `#${id.slice(-8).toUpperCase()}`;
};

/**
 * Format rating (with stars)
 */
export const formatRating = (rating: number, totalReviews: number): string => {
  return `${rating.toFixed(1)} ⭐ (${totalReviews} đánh giá)`;
};

/**
 * Format product discount
 */
export const formatDiscount = (original: number, current: number): string => {
  const discount = ((original - current) / original) * 100;
  return `-${discount.toFixed(0)}%`;
};

/**
 * Truncate text
 */
export const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
};

/**
 * Format description (preserve line breaks)
 */
export const formatDescription = (text: string): string => {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join('<br/>');
};

/**
 * Format badge color for status
 */
export const getStatusBadgeColor = (status: string): string => {
  const statusMap: Record<string, string> = {
    'Processing': 'warning',
    'Shipped': 'info',
    'Delivered': 'success',
    'Cancelled': 'danger',
    'active': 'success',
    'inactive': 'secondary',
    'pending': 'warning',
  };
  
  return statusMap[status] || 'secondary';
};

/**
 * Format badge label for status
 */
export const getStatusBadgeLabel = (status: string): string => {
  const labelMap: Record<string, string> = {
    'Processing': 'Đang xử lý',
    'Shipped': 'Đã gửi hàng',
    'Delivered': 'Đã giao',
    'Cancelled': 'Đã hủy',
    'active': 'Hoạt động',
    'inactive': 'Không hoạt động',
    'pending': 'Đang chờ xử lý',
  };
  
  return labelMap[status] || status;
};
