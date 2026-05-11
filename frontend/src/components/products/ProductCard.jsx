import React from 'react';
import { HiOutlineShoppingCart, HiStar } from 'react-icons/hi';

function ProductCard({ product }) {
  // 1. Xử lý lấy thông tin từ variants (lấy phiên bản đầu tiên làm mặc định)
  const mainVariant = product.variants && product.variants.length > 0 
    ? product.variants[0] 
    : null;

  // 2. Lấy giá và tính toán hiển thị
  const price = mainVariant ? mainVariant.price : 0;
  
  // Vì Backend chưa có oldPrice, mình có thể giả lập hoặc ẩn đi 
  // (Ở đây mình ẩn đi để giao diện thật nhất với DB)
  const hasDiscount = false; 

  // 3. Lấy ảnh đầu tiên trong mảng images
  const mainImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : 'https://via.placeholder.com/300'; // Ảnh mặc định nếu DB trống

  const formatPrice = (num) => {
    return num?.toLocaleString('vi-VN') + 'đ';
  };

  return (
    <div className="group w-full max-w-[280px] bg-white rounded-[2rem] p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 relative cursor-pointer">
      
      {/* Tags: Dựa trên brand hoặc thuộc tính cụ thể */}
      <div className="absolute top-6 right-6 z-10 flex flex-col gap-2">
        {product.ratings?.average >= 4.8 && (
          <span className="bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
            Bán chạy
          </span>
        )}
      </div>

      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-gray-50 mb-4">
        <img 
          src={mainImage} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* Product Content */}
      <div className="space-y-3 px-1">
        {/* Brand & Category (Hiển thị Brand từ Backend) */}
        <div className="flex items-center gap-1.5 text-blue-600 text-[11px] font-bold uppercase tracking-tight">
          <span className="px-2 py-0.5 rounded-md bg-blue-50">{product.brand}</span>
          {mainVariant?.storage && (
            <span className="text-gray-400">• {mainVariant.storage}</span>
          )}
        </div>

        {/* Title (Lấy từ name trong Schema) */}
        <h3 className="text-gray-800 font-extrabold text-lg leading-tight line-clamp-2 h-12">
          {product.name}
        </h3>

        {/* Price Section */}
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-red-700 text-xl font-black">
            {formatPrice(price)}
          </span>
          {/* Tạm thời ẩn giá cũ vì Backend chưa cung cấp */}
        </div>

        {/* Thông số nhanh (Lấy từ specifications trong Schema) */}
        <div className="text-[10px] text-gray-500 flex gap-2 overflow-hidden whitespace-nowrap">
          {product.specifications?.chip && (
            <span className="bg-gray-100 px-2 py-1 rounded">{product.specifications.chip}</span>
          )}
          {product.specifications?.screen && (
            <span className="bg-gray-100 px-2 py-1 rounded">{product.specifications.screen}</span>
          )}
        </div>

        {/* Footer: Rating & Add to Cart */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1">
            <HiStar className="text-yellow-400 text-lg" />
            <span className="text-sm font-bold text-gray-700">
              {product.ratings?.average || 0}
            </span>
            <span className="text-xs text-gray-400">
              ({product.ratings?.count || 0})
            </span>
          </div>

          <button className="bg-[#2d6289] hover:bg-[#1e4461] text-white p-2.5 rounded-xl transition-all active:scale-90 shadow-md">
            <HiOutlineShoppingCart className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;