import React from 'react';

function PriceRange({ minPrice, maxPrice, onChange, onApply }) {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-bold text-gray-900">Khoang gia</h4>
      <div className="flex gap-2">
        <input
          type="number"
          min="0"
          value={minPrice}
          onChange={(event) => onChange?.('min', event.target.value)}
          placeholder="Tu"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="number"
          min="0"
          value={maxPrice}
          onChange={(event) => onChange?.('max', event.target.value)}
          placeholder="Den"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <button
        type="button"
        onClick={onApply}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold py-2 rounded-lg transition-colors"
      >
        Ap dung
      </button>
    </div>
  );
}

export default PriceRange;