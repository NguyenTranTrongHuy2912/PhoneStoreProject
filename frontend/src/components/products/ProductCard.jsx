import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineStar, HiOutlineShoppingCart } from 'react-icons/hi';
import { formatPrice } from '@/lib/formatters';

const getCategoryLabel = (category) => {
  if (!category) return '';
  if (typeof category === 'string') return category;
  return category.name || category.slug || '';
};

const getDisplayPrice = (product) => {
  if (product?.variants?.length) {
    const prices = product.variants
      .map((variant) => variant.price)
      .filter((price) => typeof price === 'number' && price > 0);
    if (prices.length > 0) {
      return Math.min(...prices);
    }
  }
  return 0;
};

function ProductCard({ product, onAddToCart }) {
  const imageSrc = product?.images?.[0] || '/logo-grid.svg';
  const categoryLabel = getCategoryLabel(product?.category);
  const price = getDisplayPrice(product);
  const ratingValue = product?.ratings?.average || 0;
  const ratingCount = product?.ratings?.count || 0;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
      <Link to={`/products/${product._id}`} className="block">
        <div className="bg-gray-50 p-6 flex items-center justify-center h-52">
          <img
            src={imageSrc}
            alt={product.name}
            className="max-h-40 object-contain"
            onError={(event) => {
              event.currentTarget.src = '/logo-grid.svg';
            }}
          />
        </div>
      </Link>

      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="uppercase tracking-wide font-semibold">{product.brand}</span>
          {categoryLabel && (
            <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-medium">
              {categoryLabel}
            </span>
          )}
        </div>

        <Link to={`/products/${product._id}`} className="block">
          <h3 className="text-base font-bold text-gray-900 h-12 overflow-hidden hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <HiOutlineStar className="text-yellow-500" />
          <span>{ratingValue.toFixed(1)}</span>
          <span className="text-xs text-gray-400">({ratingCount})</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-blue-600">
            {price > 0 ? formatPrice(price) : 'Liên hệ'}
          </div>
          <button
            type="button"
            onClick={() => onAddToCart?.(product)}
            className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors"
          >
            <HiOutlineShoppingCart className="text-base" />
            Thêm
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;