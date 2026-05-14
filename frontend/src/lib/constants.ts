/**
 * ✅ Constants
 * Toàn bộ constants của ứng dụng
 */

// API Config
export const API_CONFIG = {
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
};

// Auth Config
export const AUTH_CONFIG = {
  TOKEN_KEY: 'token',
  USER_KEY: 'user',
  TOKEN_EXPIRY: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

// Product
export const PRODUCT = {
  MIN_NAME_LENGTH: 3,
  MIN_BRAND_LENGTH: 2,
  MIN_DESCRIPTION_LENGTH: 10,
  MIN_PRICE: 0.01,
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
};

// User
export const USER = {
  MIN_FULLNAME_LENGTH: 3,
  MIN_PASSWORD_LENGTH: 6,
  PHONE_LENGTH: 10,
};

// Order Status
export const ORDER_STATUS = {
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
} as const;

export const ORDER_STATUS_BADGE = {
  [ORDER_STATUS.PROCESSING]: 'warning',
  [ORDER_STATUS.SHIPPED]: 'info',
  [ORDER_STATUS.DELIVERED]: 'success',
  [ORDER_STATUS.CANCELLED]: 'danger',
} as const;

// Review
export const REVIEW = {
  MIN_RATING: 1,
  MAX_RATING: 5,
  MIN_COMMENT_LENGTH: 5,
  MAX_COMMENT_LENGTH: 500,
};

// Cache Duration (in minutes)
export const CACHE_DURATION = {
  PRODUCTS: 5,
  CATEGORIES: 30,
  USER_PROFILE: 10,
  ORDERS: 3,
} as const;

// Roles
export const ROLES = {
  ADMIN: 'admin',
  CUSTOMER: 'customer',
} as const;

// Payment Methods
export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  PAYPAL: 'paypal',
  BANK_TRANSFER: 'bank_transfer',
  VNPAY: 'vnpay',
} as const;

export const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHODS.CREDIT_CARD]: 'Thẻ tín dụng',
  [PAYMENT_METHODS.DEBIT_CARD]: 'Thẻ ghi nợ',
  [PAYMENT_METHODS.PAYPAL]: 'PayPal',
  [PAYMENT_METHODS.BANK_TRANSFER]: 'Chuyển khoản ngân hàng',
  [PAYMENT_METHODS.VNPAY]: '💳 Thanh toán VNPay',
} as const;

// Routes
export const ROUTES = {
  // Public
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  CART: '/cart',
  
  // Protected
  CHECKOUT: '/checkout',
  ORDER_SUCCESS: '/order-success/:orderId',
  ORDERS: '/orders',
  ORDER_DETAIL: '/orders/:id',
  PROFILE: '/profile',
  
  // Admin
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_USERS: '/admin/users',
} as const;

// Notification Messages
export const NOTIFICATIONS = {
  // Success
  LOGIN_SUCCESS: 'Đăng nhập thành công',
  REGISTER_SUCCESS: 'Đăng ký thành công',
  LOGOUT_SUCCESS: 'Đã đăng xuất',
  PROFILE_UPDATE_SUCCESS: 'Cập nhật profile thành công',
  PRODUCT_CREATE_SUCCESS: 'Tạo sản phẩm thành công',
  PRODUCT_UPDATE_SUCCESS: 'Cập nhật sản phẩm thành công',
  PRODUCT_DELETE_SUCCESS: 'Xóa sản phẩm thành công',
  REVIEW_CREATE_SUCCESS: 'Bình luận đã được đăng',
  ORDER_CREATE_SUCCESS: 'Đơn hàng được tạo thành công',
  CART_ADD_SUCCESS: 'Thêm vào giỏ hàng thành công',
  CART_REMOVE_SUCCESS: 'Xóa khỏi giỏ hàng thành công',
  IMAGE_UPLOAD_SUCCESS: 'Tải hình ảnh thành công',

  // Error
  LOGIN_ERROR: 'Đăng nhập thất bại',
  REGISTER_ERROR: 'Đăng ký thất bại',
  NETWORK_ERROR: 'Lỗi kết nối mạng',
  SERVER_ERROR: 'Lỗi máy chủ',
  UNAUTHORIZED: 'Bạn không có quyền thực hiện hành động này',
  NOT_FOUND: 'Không tìm thấy tài nguyên',
  INVALID_INPUT: 'Dữ liệu nhập không hợp lệ',
  FILE_TOO_LARGE: 'Tệp quá lớn (tối đa 5MB)',
  INVALID_FILE_TYPE: 'Loại tệp không hợp lệ',

  // Info
  LOADING: 'Đang tải...',
  NO_DATA: 'Không có dữ liệu',
} as const;
