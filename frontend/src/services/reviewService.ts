import api from '@/utils/axios-setup';
import { Review, CreateReviewRequest, PaginatedResponse } from '@/types';

/**
 * ✅ Review Service
 * Handles: create, list by product, delete
 */

export const reviewService = {
  /**
   * Lấy đánh giá của sản phẩm
   */
  getByProduct: async (productId: string): Promise<PaginatedResponse<Review>> => {
    const response = await api.get<PaginatedResponse<Review>>(
      `/reviews/product/${productId}`
    );
    return response.data;
  },

  /**
   * Tạo đánh giá
   */
  create: async (reviewData: CreateReviewRequest): Promise<Review> => {
    const response = await api.post<{ success: boolean; data: Review }>(
      '/reviews',
      reviewData
    );
    return response.data.data;
  },

  /**
   * Xóa đánh giá
   */
  delete: async (reviewId: string): Promise<void> => {
    await api.delete(`/reviews/${reviewId}`);
  },
};
