import api from '@/utils/axios-setup';
import { Order, CreateOrderRequest, PaginatedResponse } from '@/types';

/**
 * ✅ Order Service
 * Handles: create, list, detail, update status
 */

export const orderService = {
  /**
   * Lấy tất cả đơn hàng (Admin)
   */
  getAll: async (): Promise<PaginatedResponse<Order>> => {
    const response = await api.get<PaginatedResponse<Order>>('/orders');
    return response.data;
  },
  /**
   * Tạo đơn hàng mới
   */
  create: async (orderData: CreateOrderRequest): Promise<Order> => {
    const response = await api.post<{ success: boolean; data: Order }>(
      '/orders',
      orderData
    );
    return response.data.data;
  },

  /**
   * Lấy đơn hàng theo ID
   */
  getById: async (orderId: string): Promise<Order> => {
    const response = await api.get<{ success: boolean; data: Order }>(
      `/orders/${orderId}`
    );
    return response.data.data;
  },

  /**
   * Lấy danh sách đơn hàng của user hiện tại
   */
  getUserOrders: async (userId: string): Promise<PaginatedResponse<Order>> => {
    const response = await api.get<PaginatedResponse<Order>>(`/orders/user/${userId}`);
    return response.data;
  },

  /**
   * Cập nhật trạng thái đơn hàng (Admin Only)
   */
  updateStatus: async (
    orderId: string,
    status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'
  ): Promise<Order> => {
    const response = await api.put<{ success: boolean; data: Order }>(
      `/orders/${orderId}/status`,
      { status }
    );
    return response.data.data;
  },
};
