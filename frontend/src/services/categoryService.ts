import api from '@/utils/axios-setup';
import { Category } from '@/types';

/**
 * ✅ Category Service
 * Handles: list, create categories
 */

export const categoryService = {
  /**
   * Lấy danh sách danh mục
   */
  getAll: async (): Promise<{ success: boolean; data: Category[] }> => {
    const response = await api.get<{ success: boolean; data: Category[] }>(
      '/categories'
    );
    return response.data;
  },

  /**
   * Tạo danh mục (Admin Only)
   */
  create: async (data: { name: string; slug?: string; parent_id?: string | null }): Promise<Category> => {
    const response = await api.post<{ success: boolean; data: Category }>(
      '/categories',
      data
    );
    return response.data.data;
  },

  /**
   * Cập nhật danh mục (Admin Only)
   */
  update: async (
    categoryId: string,
    data: { name?: string; slug?: string; parent_id?: string | null }
  ): Promise<Category> => {
    const response = await api.put<{ success: boolean; data: Category }>(
      `/categories/${categoryId}`,
      data
    );
    return response.data.data;
  },

  /**
   * Xóa danh mục (Admin Only)
   */
  delete: async (categoryId: string): Promise<void> => {
    await api.delete(`/categories/${categoryId}`);
  },
};
