import React from 'react';

// Đổi mặc định render theo dạng lưới (Grid) giống như ProductGrid
function LoadingSkeleton({ items = 4 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="bg-white border border-gray-200 rounded-2xl p-4 space-y-4">
          {/* Giả lập Ảnh sản phẩm (Hình vuông) */}
          <div className="aspect-square w-full bg-gray-200 rounded-xl" />
          
          <div className="space-y-2">
            {/* Giả lập Thương hiệu (Dòng ngắn) */}
            <div className="h-3 bg-gray-200 rounded-full w-1/4" />
            {/* Giả lập Tên sản phẩm (Dòng dài) */}
            <div className="h-4 bg-gray-200 rounded-full w-3/4" />
          </div>

          {/* Giả lập Giá tiền và Nút bấm */}
          <div className="flex items-center justify-between pt-2">
            <div className="h-5 bg-gray-200 rounded-full w-1/3" />
            <div className="h-8 bg-gray-200 rounded-full w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default LoadingSkeleton;