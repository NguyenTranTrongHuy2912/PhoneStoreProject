import React from 'react';
import { HiOutlineTrash } from 'react-icons/hi';
import { useFetch, useMutate } from '@/hooks/useFetch';
import { productService } from '@/services/productService';
import { useNotificationStore } from '@/store/notificationStore';
import { formatPrice } from '@/lib/formatters';
import AdminLayout from '@/components/admin/AdminLayout';

const getDisplayPrice = (product) => {
  if (product?.variants?.length) {
    const prices = product.variants
      .map((variant) => variant.price)
      .filter((price) => typeof price === 'number' && price > 0);
    if (prices.length > 0) {
      return Math.min(...prices);
    }
  }
  return 0;
};

function AdminProductPage() {
  const { addNotification } = useNotificationStore();
  const { data, isLoading, isError } = useFetch(['admin-products'], () => productService.getAll());
  const deleteMutation = useMutate(
    (productId) => productService.delete(productId),
    [['admin-products']],
    () => addNotification({ type: 'success', message: 'Da xoa san pham' }),
    () => addNotification({ type: 'error', message: 'Khong the xoa san pham' })
  );

  const products = data?.data || [];

  return (
    <AdminLayout title="Quan ly san pham" subtitle="Quan ly danh sach va xoa san pham khong su dung">
      {isLoading && <div className="text-gray-500">Dang tai san pham...</div>}
      {isError && <div className="text-red-500">Khong the tai san pham.</div>}

      <div className="bg-white border border-gray-200 rounded-2xl p-6 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-gray-500">
              <tr className="text-left">
                <th className="py-3">Ten san pham</th>
                <th className="py-3">Thuong hieu</th>
                <th className="py-3">Danh muc</th>
                <th className="py-3">Gia</th>
                <th className="py-3 text-right">Hanh dong</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {products.map((product) => (
                <tr key={product._id} className="border-t border-gray-100">
                  <td className="py-3 font-semibold text-gray-900">{product.name}</td>
                  <td className="py-3">{product.brand}</td>
                  <td className="py-3">
                    {typeof product.category === 'string'
                      ? product.category
                      : product.category?.name || product.category?.slug}
                  </td>
                  <td className="py-3 text-blue-600 font-semibold">
                    {getDisplayPrice(product) ? formatPrice(getDisplayPrice(product)) : 'Lien he'}
                  </td>
                  <td className="py-3 text-right">
                    <button
                      type="button"
                      onClick={() => deleteMutation.mutate(product._id)}
                      className="inline-flex items-center gap-1 text-red-500 hover:text-red-600"
                    >
                      <HiOutlineTrash /> Xoa
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-6 text-center text-gray-400">
                    Chua co san pham.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
      </div>
    </AdminLayout>
  );
}

export default AdminProductPage;