import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { HiOutlineCheckCircle } from 'react-icons/hi';
import { useFetch } from '@/hooks/useFetch';
import { orderService } from '@/services/orderService';
import { formatPrice } from '@/lib/formatters';

function OrderSuccessPage() {
  const { orderId } = useParams();
  const { data: order, isLoading } = useFetch(
    ['order', orderId],
    () => orderService.getById(orderId),
    { enabled: Boolean(orderId) }
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[900px] mx-auto px-10 py-16 space-y-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center space-y-4">
          <HiOutlineCheckCircle className="text-5xl text-green-500 mx-auto" />
          <h1 className="text-2xl font-bold text-gray-900">Dat hang thanh cong</h1>
          <p className="text-gray-500">Don hang cua ban dang duoc xu ly.</p>
          <p className="text-sm text-gray-400">Ma don: {orderId}</p>
        </div>

        {isLoading && (
          <div className="text-center text-gray-500">Dang tai thong tin don hang...</div>
        )}

        {order && (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Tong quan don hang</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>So san pham</span>
                <span>{order.items.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Tong tien</span>
                <span>{formatPrice(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Trang thai</span>
                <span>{order.status}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/orders"
            className="inline-flex items-center justify-center border border-gray-200 px-6 py-3 rounded-full text-sm font-semibold text-gray-700 hover:text-blue-600"
          >
            Xem don hang
          </Link>
          <Link
            to="/products"
            className="inline-flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-full"
          >
            Tiep tuc mua sam
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccessPage;