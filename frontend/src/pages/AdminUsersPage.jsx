import React, { useState, useMemo, useCallback } from 'react';
import { HiOutlineSearch } from 'react-icons/hi';
import { useFetch, useMutate, useDebounce } from '@/hooks/useFetch';
import { userService } from '@/services/userService';
import { formatDate } from '@/lib/formatters';
import { useNotificationStore } from '@/store/notificationStore';
import { useAuthStore } from '@/store/authStore';
import AdminLayout from '@/components/admin/AdminLayout';
import StatusBadge from '@/components/admin/StatusBadge';
import ConfirmModal from '@/components/admin/ConfirmModal';
import Pagination from '@/components/admin/Pagination';

const PAGE_SIZE = 10;

function AdminUsersPage() {
  const { addNotification } = useNotificationStore();
  const { user: currentUser } = useAuthStore();

  const { data, isLoading, isError } = useFetch(['admin-users'], () => userService.getAllUsers());
  const users = data?.data || [];

  const [search, setSearch]         = useState('');
  const [roleFilter, setRole]       = useState('');
  const [page, setPage]             = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const debouncedSearch = useDebounce(search, 300);

  const roleMutation = useMutate(
    ({ userId, role }) => userService.updateRole(userId, role),
    [['admin-users']],
    () => addNotification({ type: 'success', message: 'Đã cập nhật role' }),
    () => addNotification({ type: 'error',   message: 'Không thể cập nhật role' })
  );

  const deleteMutation = useMutate(
    (userId) => userService.deleteUser(userId),
    [['admin-users']],
    () => { addNotification({ type: 'success', message: 'Đã xóa người dùng' }); setDeleteTarget(null); },
    () =>   addNotification({ type: 'error',   message: 'Không thể xóa người dùng' })
  );

  const handleDelete = (user) => {
    if (currentUser?._id === user._id) {
      addNotification({ type: 'warning', message: 'Không thể tự xóa tài khoản của mình' });
      return;
    }
    setDeleteTarget(user);
  };

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        !debouncedSearch ||
        u.fullname?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        u.email?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        u.phone?.includes(debouncedSearch);
      const matchRole = !roleFilter || u.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [users, debouncedSearch, roleFilter]);

  const handleFilterChange = useCallback(() => setPage(1), []);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <AdminLayout title="Quản lý người dùng" subtitle="Cập nhật vai trò và quản lý tài khoản">
      {/* ── Filters ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); handleFilterChange(); }}
              placeholder="Tìm theo tên, email, số điện thoại..."
              className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => { setRole(e.target.value); handleFilterChange(); }}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="">Tất cả vai trò</option>
            <option value="admin">Admin</option>
            <option value="customer">Khách hàng</option>
          </select>
          <div className="flex items-center text-sm text-gray-400 ml-auto">
            {filtered.length} người dùng
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading && (
          <div className="p-6 space-y-3">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        )}
        {isError && (
          <div className="px-6 py-10 text-center text-red-500 text-sm">Không thể tải người dùng.</div>
        )}
        {!isLoading && !isError && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wide">
                  <th className="px-6 py-3 text-left font-semibold">Người dùng</th>
                  <th className="px-6 py-3 text-left font-semibold">Email</th>
                  <th className="px-6 py-3 text-left font-semibold">Điện thoại</th>
                  <th className="px-6 py-3 text-left font-semibold">Vai trò</th>
                  <th className="px-6 py-3 text-left font-semibold">Ngày tạo</th>
                  <th className="px-6 py-3 text-left font-semibold">Cập nhật vai trò</th>
                  <th className="px-6 py-3 text-right font-semibold">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((user) => {
                  const isSelf = currentUser?._id === user._id;
                  return (
                    <tr key={user._id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${isSelf ? 'bg-indigo-50/30' : ''}`}>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-violet-400 flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-bold">
                              {user.fullname?.charAt(0)?.toUpperCase() || '?'}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {user.fullname}
                              {isSelf && <span className="ml-1.5 text-[10px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full font-semibold">Bạn</span>}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-gray-500">{user.email}</td>
                      <td className="px-6 py-3.5 text-gray-500">{user.phone || '—'}</td>
                      <td className="px-6 py-3.5">
                        <StatusBadge status={user.role} />
                      </td>
                      <td className="px-6 py-3.5 text-gray-400 text-xs">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-3.5">
                        <select
                          value={user.role}
                          onChange={(e) => roleMutation.mutate({ userId: user._id, role: e.target.value })}
                          disabled={isSelf}
                          className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <option value="customer">Khách hàng</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <button
                          onClick={() => handleDelete(user)}
                          disabled={isSelf}
                          className="px-3 py-1.5 text-xs font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-14 text-center text-gray-400">
                      Không tìm thấy người dùng nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-50">
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteMutation.mutate(deleteTarget._id)}
        title="Xóa người dùng"
        message={`Bạn có chắc muốn xóa tài khoản "${deleteTarget?.fullname}"? Hành động này không thể hoàn tác.`}
        confirmLabel="Xóa tài khoản"
        loading={deleteMutation.isPending}
      />
    </AdminLayout>
  );
}

export default AdminUsersPage;
