import React from 'react';
import { HiOutlineCheckCircle, HiOutlineExclamation, HiOutlineInformationCircle, HiOutlineXCircle } from 'react-icons/hi';
import { useNotificationStore } from '@/store/notificationStore';

const iconMap = {
  success: HiOutlineCheckCircle,
  error: HiOutlineXCircle,
  warning: HiOutlineExclamation,
  info: HiOutlineInformationCircle,
};

const colorMap = {
  success: 'text-green-600 border-green-200 bg-green-50',
  error: 'text-red-600 border-red-200 bg-red-50',
  warning: 'text-amber-600 border-amber-200 bg-amber-50',
  info: 'text-blue-600 border-blue-200 bg-blue-50',
};

function ToastContainer() {
  const { notifications, removeNotification } = useNotificationStore();

  return (
    <div className="fixed top-6 right-6 z-[999] flex flex-col gap-3">
      {notifications.map((notification) => {
        const Icon = iconMap[notification.type] || HiOutlineInformationCircle;
        const color = colorMap[notification.type] || colorMap.info;
        return (
          <div
            key={notification.id}
            className={`min-w-[260px] max-w-[340px] border rounded-xl px-4 py-3 shadow-lg ${color}`}
          >
            <div className="flex items-start gap-3">
              <Icon className="text-xl" />
              <div className="flex-1 text-sm font-semibold">
                {notification.message}
              </div>
              <button
                type="button"
                onClick={() => removeNotification(notification.id)}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                x
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ToastContainer;
