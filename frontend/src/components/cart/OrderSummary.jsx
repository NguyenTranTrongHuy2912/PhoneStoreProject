import React from 'react';
import { formatPrice } from '@/lib/formatters';

function OrderSummary({ items, subtotal, onCheckout, buttonLabel = 'Thanh toan' }) {
  const shippingFee = subtotal > 0 ? 0 : 0;
  const total = subtotal + shippingFee;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
      <h3 className="text-base font-bold text-gray-900">Tong don hang</h3>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center justify-between">
          <span>Tam tinh</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Phi giao hang</span>
          <span>{shippingFee === 0 ? 'Mien phi' : formatPrice(shippingFee)}</span>
        </div>
        <div className="flex items-center justify-between font-semibold text-gray-900">
          <span>Tong cong</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      <div className="text-xs text-gray-500">{items} san pham</div>

      {onCheckout && (
        <button
          type="button"
          onClick={onCheckout}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-full transition-colors"
        >
          {buttonLabel}
        </button>
      )}
    </div>
  );
}

export default OrderSummary;