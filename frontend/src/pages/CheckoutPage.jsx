import React from 'react';
import { useNavigate } from 'react-router-dom';
import CheckoutForm from '@/components/cart/CheckoutForm';
import OrderSummary from '@/components/cart/OrderSummary';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';
import { orderService } from '@/services/orderService';
import { useMutate } from '@/hooks/useFetch';

const formatAddress = (address) => {
  const parts = [address.street, address.city, address.state, address.country]
    .filter(Boolean); // Lọc bỏ các giá trị null/undefined/rỗng
  return parts.join(', ') || 'Địa chỉ không hợp lệ';
};

function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getTotalPrice, getTotalItems, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const { addNotification } = useNotificationStore();

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

  const handleSubmit = (data) => {
    if (!user) {
      addNotification({ type: 'warning', message: 'Vui lòng đăng nhập để thanh toán' });
      return;
    }
    if (items.length === 0) {
      addNotification({ type: 'warning', message: 'Giỏ hàng đang trống' });
      return;
    }

    // Lưu ý: userId KHÔNG cần gửi trong body vì backend lấy từ JWT token
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


  if (items.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-[1200px] mx-auto px-10 py-16 text-center space-y-6">
          <div className="text-2xl font-bold text-gray-800">Gio hang dang trong</div>
          <p className="text-gray-500">Hay them san pham truoc khi thanh toan.</p>
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="inline-flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3 rounded-full"
          >
            Quay lai mua sam
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[1200px] mx-auto px-10 py-10 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        <CheckoutForm onSubmit={handleSubmit} isSubmitting={createOrderMutation.isPending} />
        <OrderSummary
          items={getTotalItems()}
          subtotal={getTotalPrice()}
          buttonLabel="Xac nhan thanh toan"
        />
      </div>
    </div>
  );
}

export default CheckoutPage;