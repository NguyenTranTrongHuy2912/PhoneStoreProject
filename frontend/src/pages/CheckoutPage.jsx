import React from 'react';
import { useNavigate } from 'react-router-dom';
import CheckoutForm from '@/components/cart/CheckoutForm';
import OrderSummary from '@/components/cart/OrderSummary';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';
import { orderService } from '@/services/orderService';
import { vnpayService } from '@/services/vnpayService';
import { useMutate } from '@/hooks/useFetch';
import { PAYMENT_METHODS } from '@/lib/constants';

const formatAddress = (address) => {
  const parts = [address.street, address.city, address.state, address.country]
    .filter(Boolean);
  return parts.join(', ') || 'Địa chỉ không hợp lệ';
};

function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getTotalPrice, getTotalItems, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const { addNotification } = useNotificationStore();

  // ── Đặt hàng thông thường (COD / thẻ / paypal…) ──
  const createOrderMutation = useMutate(
    orderService.create,
    [],
    (order) => {
      clearCart();
      navigate(`/order-success/${order._id}`);
    },
    () => {
      addNotification({ type: 'error', message: 'Không thể tạo đơn hàng. Vui lòng thử lại.' });
    }
  );

  // ── Xử lý submit thông thường ──
  const handleSubmit = (data) => {
    if (!user) {
      addNotification({ type: 'warning', message: 'Vui lòng đăng nhập để thanh toán' });
      return;
    }
    if (items.length === 0) {
      addNotification({ type: 'warning', message: 'Giỏ hàng đang trống' });
      return;
    }

    const payload = {
      items: items.map((item) => ({
        productId: item.productId,
        name: item.product?.name || 'Sản phẩm',
        quantity: item.quantity,
        price: item.price,
        sku: item.sku || item.product?.variants?.[0]?.sku || '',
      })),
      totalAmount: getTotalPrice(),
      shippingAddress: formatAddress(data.shippingAddress),
      paymentMethod: data.paymentMethod,
    };

    createOrderMutation.mutate(payload);
  };

  // ── Xử lý thanh toán VNPay ──
  const handleVnpaySubmit = async (data) => {
    if (!user) {
      addNotification({ type: 'warning', message: 'Vui lòng đăng nhập để thanh toán' });
      return;
    }
    if (items.length === 0) {
      addNotification({ type: 'warning', message: 'Giỏ hàng đang trống' });
      return;
    }

    try {
      // Lưu thông tin giỏ hàng vào sessionStorage để dùng sau khi VNPay callback
      const pendingOrder = {
        items: items.map((item) => ({
          productId: item.productId,
          name: item.product?.name || 'Sản phẩm',
          quantity: item.quantity,
          price: item.price,
          sku: item.sku || item.product?.variants?.[0]?.sku || '',
        })),
        totalAmount: getTotalPrice(),
        shippingAddress: formatAddress(data.shippingAddress),
      };
      sessionStorage.setItem('vnpay_pending_order', JSON.stringify(pendingOrder));

      // Gọi backend tạo URL thanh toán
      const result = await vnpayService.createPaymentUrl({
        amount: getTotalPrice(),
        orderDescription: `Thanh toan don hang tai PhoneStore`,
        name: user.fullname || user.email || 'KhachHang',
        orderType: 'billpayment',
      });

      if (result.paymentUrl) {
        // Chuyển hướng sang cổng thanh toán VNPay
        window.location.href = result.paymentUrl;
      } else {
        addNotification({ type: 'error', message: 'Không thể tạo URL thanh toán VNPay' });
      }
    } catch (err) {
      console.error('[VNPay] Lỗi khi tạo URL:', err);
      addNotification({ type: 'error', message: 'Lỗi kết nối VNPay. Vui lòng thử lại.' });
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-[1200px] mx-auto px-10 py-16 text-center space-y-6">
          <div className="text-2xl font-bold text-gray-800">Giỏ hàng đang trống</div>
          <p className="text-gray-500">Hãy thêm sản phẩm trước khi thanh toán.</p>
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="inline-flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3 rounded-full"
          >
            Quay lại mua sắm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[1200px] mx-auto px-10 py-10 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        <CheckoutForm
          onSubmit={handleSubmit}
          onVnpaySubmit={handleVnpaySubmit}
          isSubmitting={createOrderMutation.isPending}
        />
        <OrderSummary
          items={getTotalItems()}
          subtotal={getTotalPrice()}
          buttonLabel="Xác nhận thanh toán"
        />
      </div>
    </div>
  );
}

export default CheckoutPage;