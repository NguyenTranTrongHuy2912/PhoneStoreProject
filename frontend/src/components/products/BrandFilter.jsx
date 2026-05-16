import React from 'react';

function BrandFilter({ brands, activeBrand, onChange }) {
  if (!brands || brands.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-bold text-gray-900">Thương hiệu</h4>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange?.('')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${!activeBrand
              ? 'bg-blue-500 text-white border-blue-500'
              : 'border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600'
            }`}
        >
          Tất cả
        </button>
        {brands.map((brand) => (
          <button
            key={brand}
            type="button"
            onClick={() => onChange?.(brand)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${activeBrand === brand
                ? 'bg-blue-500 text-white border-blue-500'
                : 'border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600'
              }`}
          >
            {brand}
          </button>
        ))}
      </div>
    </div>
  );
}

export default BrandFilter;