import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';
import { useFetch, useMutate } from '@/hooks/useFetch';
import { userService } from '@/services/userService';
import { profileSchema } from '@/lib/zod-schemas';
import { formatPhoneNumber } from '@/lib/formatters';

function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const { addNotification } = useNotificationStore();

  const { data: profile } = useFetch(
    ['profile', user?._id],
    () => userService.getProfile(user._id),
    { enabled: Boolean(user?._id) }
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullname: user?.fullname || '',
      phone: user?.phone || '',
      avatar: user?.avatar || '',
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        fullname: profile.fullname || '',
        phone: profile.phone || '',
        avatar: profile.avatar || '',
      });
    }
  }, [profile, reset]);

  const updateProfileMutation = useMutate(
    (payload) => userService.updateProfile(user._id, payload),
    [],
    (updated) => {
      setUser(updated);
      addNotification({ type: 'success', message: 'Cap nhat thong tin thanh cong' });
    },
    () => {
      addNotification({ type: 'error', message: 'Khong the cap nhat thong tin' });
    }
  );

  const handleUpdate = (data) => {
    updateProfileMutation.mutate({
      fullname: data.fullname,
      phone: data.phone,
      avatar: data.avatar,
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[1000px] mx-auto px-10 py-10 space-y-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Thong tin ca nhan</h1>
              <p className="text-sm text-gray-500">Cap nhat thong tin tai khoan cua ban.</p>
            </div>
            {profile?.phone && (
              <div className="text-sm text-gray-500">{formatPhoneNumber(profile.phone)}</div>
            )}
          </div>

          <form onSubmit={handleSubmit(handleUpdate)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Ho va ten</label>
                <input
                  {...register('fullname')}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {errors.fullname && (
                  <p className="text-xs text-red-500">{errors.fullname.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">So dien thoai</label>
                <input
                  {...register('phone')}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {errors.phone && (
                  <p className="text-xs text-red-500">{errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700">Email</label>
                <input
                  value={profile?.email || user?.email || ''}
                  disabled
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm bg-gray-50 text-gray-500"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700">Avatar URL</label>
                <input
                  {...register('avatar')}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || updateProfileMutation.isPending}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-full transition-colors disabled:opacity-60"
            >
              {updateProfileMutation.isPending ? 'Dang cap nhat...' : 'Luu thay doi'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;