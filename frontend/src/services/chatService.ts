import api from '@/utils/axios-setup';

export const chatService = {
  /**
   * Send a message to the AI Chat assistant
   * @param message The user's query
   * @returns AI response text
   */
  sendMessage: async (message: string): Promise<string> => {
    try {
      const response = await api.post<{ success: boolean; reply: string; message?: string }>('/chat', {
        message,
      });

      if (response.data.success) {
        return response.data.reply;
      } else {
        throw new Error(response.data.message || 'Lỗi không xác định từ server');
      }
    } catch (error: any) {
      console.error('Chat error:', error);
      throw new Error(
        error.response?.data?.message || 'Có lỗi xảy ra khi gọi AI. Vui lòng thử lại sau.'
      );
    }
  },
};
