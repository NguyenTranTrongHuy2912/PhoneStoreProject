import { z } from 'zod';

/**
 * ✅ Zod Validation Schemas
 * Toàn bộ schemas để validate forms
 */

// ========== Auth Schemas ==========
export const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải ít nhất 6 ký tự'),
});

export const registerSchema = z.object({
  fullname: z.string().min(3, 'Tên phải ít nhất 3 ký tự').trim(),
  email: z.string().email('Email không hợp lệ').toLowerCase(),
  password: z.string().min(6, 'Mật khẩu phải ít nhất 6 ký tự'),
  confirmPassword: z.string().min(6, 'Xác nhận mật khẩu phải ít nhất 6 ký tự'),
  phone: z.string().regex(/^\d{10}$/, 'Số điện thoại phải 10 chữ số'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu không trùng khớp',
  path: ['confirmPassword'],
});

export const profileSchema = z.object({
  fullname: z.string().min(3, 'Tên phải ít nhất 3 ký tự'),
  phone: z.string().regex(/^\d{10}$/, 'Số điện thoại phải 10 chữ số'),
  avatar: z.string().optional(),
});

// ========== Product Schemas ==========
export const productSchema = z.object({
  name: z.string().min(3, 'Tên sản phẩm phải ít nhất 3 ký tự'),
  brand: z.string().min(2, 'Thương hiệu phải ít nhất 2 ký tự'),
  category: z.string().min(1, 'Vui lòng chọn danh mục'),
  description: z.string().min(10, 'Mô tả phải ít nhất 10 ký tự'),
  price: z.number().min(0.01, 'Giá phải lớn hơn 0'),
  stock: z.number().int().min(0, 'Kho hàng phải lớn hơn hoặc bằng 0'),
  images: z.array(z.string().url()).min(1, 'Phải có ít nhất 1 hình ảnh'),
  specifications: z.record(z.string(), z.string()).optional(),
});

// ========== Review Schemas ==========
export const reviewSchema = z.object({
  rating: z.number().min(1, 'Đánh giá phải từ 1 đến 5').max(5, 'Đánh giá phải từ 1 đến 5'),
  comment: z.string().min(5, 'Bình luận phải ít nhất 5 ký tự').max(500, 'Bình luận tối đa 500 ký tự'),
});

// ========== Cart & Order Schemas ==========
export const addressSchema = z.object({
  street: z.string().min(5, 'Địa chỉ phải ít nhất 5 ký tự'),
  city: z.string().min(2, 'Thành phố phải ít nhất 2 ký tự'),
  state: z.string().min(2, 'Tỉnh phải ít nhất 2 ký tự'),
  country: z.string().min(2, 'Quốc gia phải ít nhất 2 ký tự'),
});

export const checkoutSchema = z.object({
  shippingAddress: addressSchema,
  paymentMethod: z.enum(['credit_card', 'debit_card', 'paypal', 'bank_transfer']),
  billingAddressSameAsShipping: z.boolean(),
});

// ========== Filter Schemas ==========
export const filterSchema = z.object({
  brand: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  search: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

// ========== Type Exports ==========
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
export type ReviewFormData = z.infer<typeof reviewSchema>;
export type AddressFormData = z.infer<typeof addressSchema>;
export type CheckoutFormData = z.infer<typeof checkoutSchema>;
export type FilterFormData = z.infer<typeof filterSchema>;
