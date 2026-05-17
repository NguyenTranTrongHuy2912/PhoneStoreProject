import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-12">
      <div className="max-w-3xl w-full bg-white/80 backdrop-blur-sm border border-gray-200 rounded-3xl p-8 sm:p-12 shadow-lg flex flex-col sm:flex-row items-center gap-8">
        <div className="flex-shrink-0">
          <svg className="w-40 h-40 text-indigo-500" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <rect x="6" y="10" width="40" height="44" rx="4" stroke="currentColor" strokeWidth="2" fill="rgba(99,102,241,0.06)" />
            <path d="M18 20h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
            <path d="M18 28h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
            <path d="M18 36h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
            <circle cx="50" cy="46" r="10" stroke="currentColor" strokeWidth="2" fill="rgba(56,189,248,0.08)" />
            <path d="M54 50l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        <div className="text-center sm:text-left">
          <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">404</h1>
          <h2 className="mt-2 text-2xl font-semibold text-gray-800">Không tìm thấy trang</h2>
          <p className="mt-2 text-gray-500">Trang bạn đang truy cập không tồn tại hoặc đã bị di chuyển.</p>

          <div className="mt-6 flex items-center justify-center sm:justify-start gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2.5 rounded-full shadow"
              aria-label="Về trang chủ"
            >
              Về trang chủ
            </Link>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg"
              aria-label="Quay lại trang trước"
            >
              Quay lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
