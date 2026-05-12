import React, { useMemo, useState } from 'react';
import { HiOutlinePencilAlt, HiOutlineTag, HiOutlineTrash } from 'react-icons/hi';
import { useFetch, useMutate } from '@/hooks/useFetch';
import { categoryService } from '@/services/categoryService';
import { useNotificationStore } from '@/store/notificationStore';
import AdminLayout from '@/components/admin/AdminLayout';

function AdminCategoryPage() {
  const { addNotification } = useNotificationStore();
  const { data, isLoading, isError } = useFetch(['admin-categories'], () => categoryService.getAll());
  const categories = data?.data || [];

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [parentId, setParentId] = useState('');
  const [editingId, setEditingId] = useState('');

  const selectableParents = useMemo(() => {
    return categories.filter((category) => category._id !== editingId);
  }, [categories, editingId]);

  const createMutation = useMutate(
    (payload) => categoryService.create(payload),
    [['admin-categories']],
    () => {
      addNotification({ type: 'success', message: 'Da tao danh muc' });
      setName('');
      setSlug('');
      setParentId('');
    },
    () => addNotification({ type: 'error', message: 'Khong the tao danh muc' })
  );

  const updateMutation = useMutate(
    ({ categoryId, payload }) => categoryService.update(categoryId, payload),
    [['admin-categories']],
    () => {
      addNotification({ type: 'success', message: 'Da cap nhat danh muc' });
      setEditingId('');
      setName('');
      setSlug('');
      setParentId('');
    },
    () => addNotification({ type: 'error', message: 'Khong the cap nhat danh muc' })
  );

  const deleteMutation = useMutate(
    (categoryId) => categoryService.delete(categoryId),
    [['admin-categories']],
    () => addNotification({ type: 'success', message: 'Da xoa danh muc' }),
    () => addNotification({ type: 'error', message: 'Khong the xoa danh muc' })
  );

  const handleDelete = (category) => {
    const confirmed = window.confirm(`Xoa danh muc "${category.name}"?`);
    if (!confirmed) return;
    deleteMutation.mutate(category._id);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name.trim()) {
      addNotification({ type: 'warning', message: 'Vui long nhap ten danh muc' });
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

  const startEdit = (category) => {
    setEditingId(category._id);
    setName(category.name || '');
    setSlug(category.slug || '');
    setParentId(category.parent_id?._id || '');
  };

  const cancelEdit = () => {
    setEditingId('');
    setName('');
    setSlug('');
    setParentId('');
  };

  return (
    <AdminLayout title="Quan ly danh muc" subtitle="Tao moi, cap nhat va xoa danh muc">
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-base font-bold text-gray-900 mb-4">
            {editingId ? 'Chinh sua danh muc' : 'Tao danh muc moi'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Ten danh muc</label>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Dien thoai"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Slug (tu dong neu bo trong)</label>
              <input
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="dien-thoai"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Danh muc cha</label>
              <select
                value={parentId}
                onChange={(event) => setParentId(event.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm"
              >
                <option value="">Khong co</option>
                {selectableParents.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-3">
              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-full"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {editingId
                    ? updateMutation.isPending
                      ? 'Dang cap nhat...'
                      : 'Cap nhat'
                    : createMutation.isPending
                      ? 'Dang tao...'
                      : 'Tao danh muc'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="border border-gray-200 px-6 py-3 rounded-full text-sm font-semibold text-gray-600"
                  >
                    Huy
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

      {isLoading && <div className="text-gray-500">Dang tai danh muc...</div>}
      {isError && <div className="text-red-500">Khong the tai danh muc.</div>}

      <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-base font-bold text-gray-900 mb-4">Danh muc hien co</h2>
          <div className="space-y-3 text-sm text-gray-700">
            {categories.map((category) => (
              <div key={category._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <div className="font-semibold text-gray-900">{category.name}</div>
                  <div className="text-xs text-gray-500">Slug: {category.slug}</div>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>{category.parent_id?.name ? `Cha: ${category.parent_id.name}` : 'Danh muc goc'}</span>
                  <button
                    type="button"
                    onClick={() => startEdit(category)}
                    className="inline-flex items-center gap-1 text-blue-500 hover:text-blue-600"
                  >
                    <HiOutlinePencilAlt /> Sua
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(category)}
                    className="inline-flex items-center gap-1 text-red-500 hover:text-red-600"
                  >
                    <HiOutlineTrash /> Xoa
                  </button>
                </div>
              </div>
            ))}
            {categories.length === 0 && !isLoading && !isError && (
              <div className="text-gray-400">Chua co danh muc.</div>
            )}
          </div>
      </div>
    </AdminLayout>
  );
}

export default AdminCategoryPage;
