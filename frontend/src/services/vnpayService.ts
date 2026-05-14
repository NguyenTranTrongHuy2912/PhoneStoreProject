import api from '@/utils/axios-setup';

/**
 * VNPay Service - Giao tiếp với backend VNPay API
 */
export const vnpayService = {
    /**
     * Tạo URL thanh toán VNPay
     */
    createPaymentUrl: async (payload: {
        orderId?: string;
        amount: number;
        orderDescription?: string;
        orderType?: string;
        name?: string;
    }): Promise<{ paymentUrl: string; txnRef: string }> => {
        const response = await api.post<{
            success: boolean;
            paymentUrl: string;
            txnRef: string;
        }>('/vnpay/create-payment-url', payload);
        return response.data;
    },

    /**
     * Xác nhận và lưu đơn hàng sau khi VNPay callback thành công
     */
    confirmOrder: async (payload: {
        items: any[];
        totalAmount: number;
        shippingAddress: string;
        transactionId: string;
        responseCode: string;
        orderInfo?: string;
    }) => {
        const response = await api.post<{ success: boolean; data: any }>(
            '/vnpay/confirm-order',
            payload
        );
        return response.data;
    },
};
