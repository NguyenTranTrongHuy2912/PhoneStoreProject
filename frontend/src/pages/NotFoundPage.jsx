import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50">
      <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center space-y-4">
        <div className="text-5xl font-black text-gray-900">404</div>
        <p className="text-sm text-gray-500">Khong tim thay trang ban dang truy cap.</p>
        <Link
          to="/"
          className="inline-flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-full"
        >
          Ve trang chu
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
