import api from '@/utils/axios-setup';
import { 
  Product, 
  CreateProductRequest, 
  ProductFilter,
  PaginatedResponse 
} from '@/types';

/**
 * ✅ Product Service
 * Handles: list, search, detail, create, update, delete
 */

export const productService = {
  /**
   * Lấy danh sách sản phẩm với filter/search
   */
  getAll: async (filters?: ProductFilter): Promise<PaginatedResponse<Product>> => {
    const params = new URLSearchParams();
    if (filters?.brand) params.append('brand', filters.brand);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    
    const response = await api.get<PaginatedResponse<Product>>(
      `/products?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Tìm kiếm sản phẩm theo keyword
   */
  search: async (keyword: string): Promise<PaginatedResponse<Product>> => {
    const response = await api.get<PaginatedResponse<Product>>(
      `/products/search/${encodeURIComponent(keyword)}`
    );
    return response.data;
  },

  /**
   * Lấy chi tiết sản phẩm
   */
  getById: async (productId: string): Promise<Product> => {
    const response = await api.get<{ success: boolean; data: Product }>(
      `/products/${productId}`
    );
    return response.data.data;
  },

  /**
   * Tạo sản phẩm mới (Admin Only)
   */
  create: async (data: CreateProductRequest): Promise<Product> => {
    const response = await api.post<{ success: boolean; data: Product }>(
      '/products',
      data
    );
    return response.data.data;
  },

  /**
   * Cập nhật sản phẩm (Admin Only)
   */
  update: async (productId: string, data: Partial<CreateProductRequest>): Promise<Product> => {
    const response = await api.put<{ success: boolean; data: Product }>(
      `/products/${productId}`,
      data
    );
    return response.data.data;
  },

  /**
   * Xóa sản phẩm (Admin Only)
   */
  delete: async (productId: string): Promise<void> => {
    await api.delete(`/products/${productId}`);
  },
};
