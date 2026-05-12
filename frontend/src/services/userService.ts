import api from '@/utils/axios-setup';
import { User } from '@/types';

/**
 * ✅ User Service
 * Handles: user profile operations
 */

export const userService = {
  /**
   * Lấy profile
   */
  getProfile: async (userId: string): Promise<User> => {
    const response = await api.get<{ success: boolean; data: User }>(
      `/users/profile/${userId}`
    );
    return response.data.data;
  },

  /**
   * Cập nhật profile
   */
  updateProfile: async (userId: string, data: Partial<User>): Promise<User> => {
    const response = await api.put<{ success: boolean; data: User }>(
      `/users/${userId}`,
      data
    );
    return response.data.data;
  },

  /**
   * Lấy tất cả users (Admin Only)
   */
  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  /**
   * Cập nhật role người dùng (Admin Only)
   */
  updateRole: async (userId: string, role: 'customer' | 'admin') => {
    const response = await api.put(`/users/${userId}/role`, { role });
    return response.data;
  },

  /**
   * Xóa người dùng (Admin Only)
   */
  deleteUser: async (userId: string): Promise<void> => {
    await api.delete(`/users/${userId}`);
  },
};
