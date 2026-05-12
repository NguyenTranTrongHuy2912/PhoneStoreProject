import api from '@/utils/axios-setup';
import { 
  User, 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse 
} from '@/types';

/**
 * ✅ Authentication Service
 * Handles: login, register, logout, profile
 */

export const authService = {
  /**
   * Đăng nhập user
   * @param credentials - Email và password
   * @returns JWT token + user info
   */
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/users/login', credentials);
    return response.data;
  },

  /**
   * Đăng ký user mới
   * @param userData - Fullname, email, password, phone
   * @returns JWT token + user info
   */
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/users/register', userData);
    return response.data;
  },

  /**
   * Lấy thông tin cá nhân
   * @param userId - ID người dùng
   * @returns User info (phải có JWT token)
   */
  getProfile: async (userId: string): Promise<User> => {
    const response = await api.get<{ success: boolean; data: User }>(
      `/users/profile/${userId}`
    );
    return response.data.data;
  },

  /**
   * Cập nhật profile
   * @param userId - ID người dùng
   * @param data - Dữ liệu cần cập nhật
   * @returns Updated user info
   */
  updateProfile: async (userId: string, data: Partial<User>): Promise<User> => {
    const response = await api.put<{ success: boolean; data: User }>(
      `/users/${userId}`,
      data
    );
    return response.data.data;
  },

  /**
   * Đăng xuất
   * - Xóa token ở localStorage
   * - Axios interceptor sẽ handle redirect
   */
  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};
