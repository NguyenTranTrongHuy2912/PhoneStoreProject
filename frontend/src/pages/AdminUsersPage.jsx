import React from 'react';
import { HiOutlineTrash, HiOutlineUsers } from 'react-icons/hi';
import { useFetch, useMutate } from '@/hooks/useFetch';
import { userService } from '@/services/userService';
import { formatDateTime } from '@/lib/formatters';
import { useNotificationStore } from '@/store/notificationStore';
import { useAuthStore } from '@/store/authStore';
import AdminLayout from '@/components/admin/AdminLayout';

function AdminUsersPage() {
  const { addNotification } = useNotificationStore();
  const { user: currentUser } = useAuthStore();
  const { data, isLoading, isError } = useFetch(['admin-users'], () => userService.getAllUsers());
  const users = data?.data || [];

  const roleMutation = useMutate(
    ({ userId, role }) => userService.updateRole(userId, role),
    [['admin-users']],
    () => addNotification({ type: 'success', message: 'Da cap nhat role' }),
    () => addNotification({ type: 'error', message: 'Khong the cap nhat role' })
  );

  const deleteMutation = useMutate(
    (userId) => userService.deleteUser(userId),
    [['admin-users']],
    () => addNotification({ type: 'success', message: 'Da xoa nguoi dung' }),
    () => addNotification({ type: 'error', message: 'Khong the xoa nguoi dung' })
  );

  const handleDelete = (user) => {
    if (currentUser?._id === user._id) {
      addNotification({ type: 'warning', message: 'Khong the tu xoa tai khoan' });
      return;
    }
    const confirmed = window.confirm(`Xoa nguoi dung "${user.fullname}"?`);
    if (!confirmed) return;
    deleteMutation.mutate(user._id);
  };

  return (
    <AdminLayout title="Quan ly nguoi dung" subtitle="Cap nhat role va quan ly tai khoan">
      {isLoading && <div className="text-gray-500">Dang tai nguoi dung...</div>}
      {isError && <div className="text-red-500">Khong the tai nguoi dung.</div>}

      <div className="bg-white border border-gray-200 rounded-2xl p-6 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-gray-500">
              <tr className="text-left">
                <th className="py-3">Ten</th>
                <th className="py-3">Email</th>
                <th className="py-3">So dien thoai</th>
                <th className="py-3">Role</th>
                <th className="py-3">Ngay tao</th>
                <th className="py-3 text-right">Hanh dong</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {users.map((user) => (
                <tr key={user._id} className="border-t border-gray-100">
                  <td className="py-3 font-semibold text-gray-900">{user.fullname}</td>
                  <td className="py-3">{user.email}</td>
                  <td className="py-3">{user.phone || '-'}</td>
                  <td className="py-3">
                    <select
                      value={user.role}
                      onChange={(event) =>
                        roleMutation.mutate({ userId: user._id, role: event.target.value })
                      }
                      disabled={currentUser?._id === user._id}
                      className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    >
                      <option value="customer">customer</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="py-3">{formatDateTime(user.createdAt)}</td>
                  <td className="py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleDelete(user)}
                      className={`inline-flex items-center gap-1 ${
                        currentUser?._id === user._id
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-red-500 hover:text-red-600'
                      }`}
                      disabled={currentUser?._id === user._id}
                    >
                      <HiOutlineTrash /> Xoa
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && !isLoading && !isError && (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-gray-400">
                    Chua co nguoi dung.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
      </div>
    </AdminLayout>
  );
}

export default AdminUsersPage;
