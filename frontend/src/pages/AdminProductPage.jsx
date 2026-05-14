import React, { useState, useMemo, useCallback } from 'react';
import { HiOutlineTrash, HiOutlinePencilAlt, HiOutlinePlus, HiOutlineSearch } from 'react-icons/hi';
import { useFetch, useMutate, useDebounce } from '@/hooks/useFetch';
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';
import { useNotificationStore } from '@/store/notificationStore';
import { formatPrice } from '@/lib/formatters';
import AdminLayout from '@/components/admin/AdminLayout';
import ProductFormModal from '@/components/admin/ProductFormModal';
import ConfirmModal from '@/components/admin/ConfirmModal';
import Pagination from '@/components/admin/Pagination';

const PAGE_SIZE = 10;

const getMinPrice = (product) => {
  if (!product?.variants?.length) return null;
  const prices = product.variants.map((v) => v.price).filter((p) => typeof p === 'number' && p > 0);
  return prices.length > 0 ? Math.min(...prices) : null;
};

function AdminProductPage() {
  const { addNotification } = useNotificationStore();

  // ── Data ──────────────────────────────────────────────────
  const { data, isLoading, isError } = useFetch(['admin-products'], () => productService.getAll());
  const { data: catData } = useFetch(['admin-categories'], () => categoryService.getAll());

  const products   = data?.data   || [];
  const categories = catData?.data || [];

  // ── Local state ───────────────────────────────────────────
  const [search, setSearch]       = useState('');
  const [brandFilter, setBrand]   = useState('');
  const [catFilter, setCat]       = useState('');
  const [page, setPage]           = useState(1);

  const [formOpen, setFormOpen]   = useState(false);
  const [editing, setEditing]     = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const debouncedSearch = useDebounce(search, 300);

  // ── Mutations ─────────────────────────────────────────────
  const createMutation = useMutate(
    (payload) => productService.create(payload),
    [['admin-products']],
    () => { addNotification({ type: 'success', message: 'Đã tạo sản phẩm' }); setFormOpen(false); },
    () =>   addNotification({ type: 'error',   message: 'Không thể tạo sản phẩm' })
  );

  const updateMutation = useMutate(
    ({ id, payload }) => productService.update(id, payload),
    [['admin-products']],
    () => { addNotification({ type: 'success', message: 'Đã cập nhật sản phẩm' }); setFormOpen(false); setEditing(null); },
    () =>   addNotification({ type: 'error',   message: 'Không thể cập nhật sản phẩm' })
  );

  const deleteMutation = useMutate(
    (id) => productService.delete(id),
    [['admin-products']],
    () => { addNotification({ type: 'success', message: 'Đã xóa sản phẩm' }); setDeleteTarget(null); },
    () =>   addNotification({ type: 'error',   message: 'Không thể xóa sản phẩm' })
  );

  // ── Distinct brands for filter ────────────────────────────
  const brands = useMemo(
    () => [...new Set(products.map((p) => p.brand).filter(Boolean))].sort(),
    [products]
  );

  // ── Filtered list ─────────────────────────────────────────
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        !debouncedSearch ||
        p.name?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        p.brand?.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchBrand = !brandFilter || p.brand === brandFilter;
      const catName =
        typeof p.category === 'object' ? p.category?.name || p.category?.slug || '' : p.category || '';
      const catId = typeof p.category === 'object' ? p.category?._id || '' : p.category || '';
      const matchCat = !catFilter || catId === catFilter || catName === catFilter;
      return matchSearch && matchBrand && matchCat;
    });
  }, [products, debouncedSearch, brandFilter, catFilter]);

  const totalPages  = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated   = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilterChange = useCallback(() => setPage(1), []);

  const handleSubmit = (payload) => {
    if (editing) {
      updateMutation.mutate({ id: editing._id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const openEdit = (product) => {
    setEditing(product);
    setFormOpen(true);
  };

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  return (
    <AdminLayout
      title="Quản lý sản phẩm"
      subtitle="Thêm, chỉnh sửa và xóa sản phẩm"
      actions={
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
        >
          <HiOutlinePlus className="text-base" />
          Thêm sản phẩm
        </button>
      }
    >
      {/* ── Filters ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); handleFilterChange(); }}
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          {/* Brand filter */}
          <select
            value={brandFilter}
            onChange={(e) => { setBrand(e.target.value); handleFilterChange(); }}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 min-w-[140px]"
          >
            <option value="">Tất cả thương hiệu</option>
            {brands.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>

          {/* Category filter */}
          <select
            value={catFilter}
            onChange={(e) => { setCat(e.target.value); handleFilterChange(); }}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 min-w-[140px]"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>

          {/* Stats */}
          <div className="flex items-center text-sm text-gray-400 ml-auto">
            {filtered.length} sản phẩm
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading && (
          <div className="p-6 space-y-3">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        )}
        {isError && (
          <div className="px-6 py-10 text-center text-red-500 text-sm">
            Không thể tải danh sách sản phẩm.
          </div>
        )}
        {!isLoading && !isError && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wide">
                  <th className="px-6 py-3 text-left font-semibold">Sản phẩm</th>
                  <th className="px-6 py-3 text-left font-semibold">Thương hiệu</th>
                  <th className="px-6 py-3 text-left font-semibold">Danh mục</th>
                  <th className="px-6 py-3 text-left font-semibold">Biến thể</th>
                  <th className="px-6 py-3 text-left font-semibold">Giá từ</th>
                  <th className="px-6 py-3 text-right font-semibold">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((product) => {
                  const thumb = product.images?.[0];
                  const minPrice = getMinPrice(product);
                  const catLabel =
                    typeof product.category === 'object'
                      ? product.category?.name || '—'
                      : product.category || '—';
                  return (
                    <tr key={product._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          {thumb ? (
                            <img
                              src={thumb}
                              alt={product.name}
                              className="w-10 h-10 rounded-lg object-cover border border-gray-100 flex-shrink-0"
                              onError={(e) => { e.target.src='https://placehold.co/40x40/f1f5f9/94a3b8?text=?'; }}
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0 flex items-center justify-center text-gray-300 text-lg">📱</div>
                          )}
                          <span className="font-semibold text-gray-900 line-clamp-2 max-w-[200px]">
                            {product.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-gray-500">{product.brand || '—'}</td>
                      <td className="px-6 py-3.5 text-gray-500">{catLabel}</td>
                      <td className="px-6 py-3.5 text-gray-500">{product.variants?.length || 0} phiên bản</td>
                      <td className="px-6 py-3.5 font-semibold text-indigo-600">
                        {minPrice ? formatPrice(minPrice) : <span className="text-gray-400 font-normal">Liên hệ</span>}
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEdit(product)}
                            className="p-2 rounded-lg text-indigo-500 hover:bg-indigo-50 transition-colors"
                            title="Chỉnh sửa"
                          >
                            <HiOutlinePencilAlt className="text-base" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(product)}
                            className="p-2 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                            title="Xóa"
                          >
                            <HiOutlineTrash className="text-base" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-14 text-center text-gray-400">
                      {debouncedSearch || brandFilter || catFilter
                        ? 'Không tìm thấy sản phẩm phù hợp.'
                        : 'Chưa có sản phẩm nào.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-50">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      <ProductFormModal
        isOpen={formOpen}
        onClose={() => { setFormOpen(false); setEditing(null); }}
        onSubmit={handleSubmit}
        product={editing}
        loading={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteMutation.mutate(deleteTarget._id)}
        title="Xóa sản phẩm"
        message={`Bạn có chắc muốn xóa "${deleteTarget?.name}"? Hành động này không thể hoàn tác.`}
        confirmLabel="Xóa sản phẩm"
        loading={deleteMutation.isPending}
      />
    </AdminLayout>
  );
}

export default AdminProductPage;