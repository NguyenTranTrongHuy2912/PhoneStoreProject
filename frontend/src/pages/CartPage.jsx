import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartItem from '@/components/cart/CartItem';
import OrderSummary from '@/components/cart/OrderSummary';
import { useCartStore } from '@/store/cartStore';

function CartPage() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, getTotalPrice, getTotalItems } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-[1200px] mx-auto px-10 py-16 text-center space-y-6">
          <div className="text-2xl font-bold text-gray-800">Giỏ hàng đang trống</div>
          <p className="text-gray-500">Hãy thêm một vài sản phẩm vào giỏ hàng của bạn.</p>
          <Link
            to="/products"
            className="inline-flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3 rounded-full"
          >
            Mua sắm ngay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[1200px] mx-auto px-10 py-10 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Giỏ hàng của bạn</h1>
            <span className="text-sm text-gray-500">{items.length} sản phẩm</span>
          </div>

          {items.map((item) => (
            <CartItem
              key={item.productId}
              item={item}
              onIncrease={() => updateQuantity(item.productId, item.quantity + 1)}
              onDecrease={() => updateQuantity(item.productId, item.quantity - 1)}
              onRemove={() => removeItem(item.productId)}
            />
          ))}
        </div>

        <OrderSummary
          items={getTotalItems()}
          subtotal={getTotalPrice()}
          onCheckout={() => navigate('/checkout')}
          buttonLabel="Tiến hành thanh toán"
        />
      </div>
    </div>
  );
}

export default CartPage;