import React, { useMemo, useState } from 'react';
import { HiOutlinePencilAlt, HiOutlineTrash, HiOutlinePlus, HiX } from 'react-icons/hi';
import { useFetch, useMutate } from '@/hooks/useFetch';
import { categoryService } from '@/services/categoryService';
import { useNotificationStore } from '@/store/notificationStore';
import AdminLayout from '@/components/admin/AdminLayout';
import ConfirmModal from '@/components/admin/ConfirmModal';

function AdminCategoryPage() {
  const { addNotification } = useNotificationStore();
  const { data, isLoading, isError } = useFetch(['admin-categories'], () => categoryService.getAll());
  const categories = data?.data || [];

  const [name, setName]       = useState('');
  const [slug, setSlug]       = useState('');
  const [parentId, setParentId] = useState('');
  const [editingId, setEditingId] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const selectableParents = useMemo(
    () => categories.filter((c) => c._id !== editingId),
    [categories, editingId]
  );

  const createMutation = useMutate(
    (payload) => categoryService.create(payload),
    [['admin-categories']],
    () => {
      addNotification({ type: 'success', message: 'Đã tạo danh mục' });
      setName(''); setSlug(''); setParentId('');
    },
    () => addNotification({ type: 'error', message: 'Không thể tạo danh mục' })
  );

  const updateMutation = useMutate(
    ({ categoryId, payload }) => categoryService.update(categoryId, payload),
    [['admin-categories']],
    () => {
      addNotification({ type: 'success', message: 'Đã cập nhật danh mục' });
      cancelEdit();
    },
    () => addNotification({ type: 'error', message: 'Không thể cập nhật danh mục' })
  );

  const deleteMutation = useMutate(
    (categoryId) => categoryService.delete(categoryId),
    [['admin-categories']],
    () => { addNotification({ type: 'success', message: 'Đã xóa danh mục' }); setDeleteTarget(null); },
    () =>   addNotification({ type: 'error',   message: 'Không thể xóa danh mục' })
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      addNotification({ type: 'warning', message: 'Vui lòng nhập tên danh mục' });
      return;
    }
    const payload = {
      name: name.trim(),
      slug: slug.trim() || undefined,
      parent_id: parentId && parentId !== editingId ? parentId : null,
    };
    if (editingId) {
      updateMutation.mutate({ categoryId: editingId, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const startEdit = (cat) => {
    setEditingId(cat._id);
    setName(cat.name || '');
    setSlug(cat.slug || '');
    setParentId(cat.parent_id?._id || '');
  };

  const cancelEdit = () => {
    setEditingId(''); setName(''); setSlug(''); setParentId('');
  };

  const isBusy = createMutation.isPending || updateMutation.isPending;

  return (
    <AdminLayout
      title="Quản lý danh mục"
      subtitle="Tạo mới, cập nhật và xóa danh mục sản phẩm"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Form ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-gray-900">
              {editingId ? '✏️ Chỉnh sửa danh mục' : '➕ Tạo danh mục mới'}
            </h2>
            {editingId && (
              <button
                onClick={cancelEdit}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                title="Hủy chỉnh sửa"
              >
                <HiX />
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Tên danh mục <span className="text-red-500">*</span>
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Điện thoại"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-shadow"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Slug <span className="text-gray-400 font-normal">(tự động nếu bỏ trống)</span>
              </label>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="dien-thoai"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-shadow font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Danh mục cha</label>
              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">Không có (danh mục gốc)</option>
                {selectableParents.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={isBusy}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-60 shadow-sm"
            >
              {!editingId && <HiOutlinePlus />}
              {isBusy
                ? 'Đang lưu...'
                : editingId
                ? 'Cập nhật danh mục'
                : 'Tạo danh mục'}
            </button>
          </form>
        </div>

        {/* ── List ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-bold text-gray-900 mb-4">
            Danh mục hiện có
            <span className="ml-2 text-sm text-gray-400 font-normal">({categories.length})</span>
          </h2>

          {isLoading && (
            <div className="space-y-2">
              {[1,2,3].map(i => (
                <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          )}
          {isError && <p className="text-red-500 text-sm">Không thể tải danh mục.</p>}

          <div className="space-y-2">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-colors ${
                  editingId === cat._id
                    ? 'border-indigo-300 bg-indigo-50'
                    : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{cat.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-mono text-gray-400">{cat.slug}</span>
                    {cat.parent_id?.name && (
                      <span className="text-xs text-gray-400">• Cha: {cat.parent_id.name}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => startEdit(cat)}
                    className="p-2 rounded-lg text-indigo-500 hover:bg-indigo-100 transition-colors"
                    title="Chỉnh sửa"
                  >
                    <HiOutlinePencilAlt className="text-base" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(cat)}
                    className="p-2 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                    title="Xóa"
                  >
                    <HiOutlineTrash className="text-base" />
                  </button>
                </div>
              </div>
            ))}
            {categories.length === 0 && !isLoading && !isError && (
              <p className="text-center text-gray-400 py-8 text-sm">Chưa có danh mục nào.</p>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteMutation.mutate(deleteTarget._id)}
        title="Xóa danh mục"
        message={`Bạn có chắc muốn xóa danh mục "${deleteTarget?.name}"?`}
        confirmLabel="Xóa danh mục"
        loading={deleteMutation.isPending}
      />
    </AdminLayout>
  );
}

export default AdminCategoryPage;
