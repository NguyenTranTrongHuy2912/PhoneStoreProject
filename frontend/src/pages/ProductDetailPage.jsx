import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { HiOutlineStar, HiOutlineShoppingCart } from 'react-icons/hi';
import { useFetch, useMutate } from '@/hooks/useFetch';
import { productService } from '@/services/productService';
import { reviewService } from '@/services/reviewService';
import { useCartStore } from '@/store/cartStore';
import { useNotificationStore } from '@/store/notificationStore';
import { useAuthStore } from '@/store/authStore';
import { formatPrice } from '@/lib/formatters';
import ReviewItem from '@/components/products/ReviewItem';

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

function ProductDetailPage() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const { addItem } = useCartStore();
  const { addNotification } = useNotificationStore();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const { data: product, isLoading, isError } = useFetch(
    ['product', id],
    () => productService.getById(id),
    { enabled: Boolean(id) }
  );

  const { data: reviewData } = useFetch(
    ['reviews', id],
    () => reviewService.getByProduct(id),
    { enabled: Boolean(id) }
  );

  const reviews = reviewData?.data || [];

  const createReviewMutation = useMutate(
    reviewService.create,
    [['reviews', id]],
    () => {
      addNotification({ type: 'success', message: 'Da gui danh gia' });
      setComment('');
      setRating(5);
    },
    () => {
      addNotification({ type: 'error', message: 'Khong the gui danh gia' });
    }
  );

  useEffect(() => {
    if (product?.images?.length) {
      setSelectedImageIndex(0);
    }
    if (product?.variants?.length) {
      setSelectedVariantIndex(0);
    }
  }, [product?.images?.length, product?.variants?.length]);

  const selectedVariant = product?.variants?.[selectedVariantIndex] || null;
  const displayPrice = selectedVariant?.price || getDisplayPrice(product);

  const imageSrc = product?.images?.[selectedImageIndex] || '/logo-grid.svg';

  const handleAddToCart = () => {
    if (!product) return;
    if (!displayPrice) {
      addNotification({ type: 'warning', message: 'San pham chua co gia' });
      return;
    }
    addItem({
      productId: product._id,
      product,
      quantity,
      price: displayPrice,
    });
    addNotification({ type: 'success', message: 'Da them vao gio hang' });
  };

  const handleSubmitReview = () => {
    if (!user) {
      addNotification({ type: 'warning', message: 'Vui long dang nhap de danh gia' });
      return;
    }
    if (!comment.trim()) {
      addNotification({ type: 'warning', message: 'Vui long nhap nhan xet' });
      return;
    }
    createReviewMutation.mutate({
      productId: product._id,
      userId: user._id,
      rating,
      comment: comment.trim(),
    });
  };

  if (isLoading) {
    return <div className="text-center py-16 text-gray-500">Dang tai san pham...</div>;
  }

  if (isError || !product) {
    return <div className="text-center py-16 text-red-500">Khong tim thay san pham.</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[1200px] mx-auto px-10 py-10 space-y-10">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-2xl p-6 flex items-center justify-center">
              <img
                src={imageSrc}
                alt={product.name}
                className="max-h-80 object-contain"
                onError={(event) => {
                  event.currentTarget.src = '/logo-grid.svg';
                }}
              />
            </div>
            <div className="flex gap-3">
              {(product.images || []).map((img, index) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-16 h-16 border rounded-xl p-2 bg-white ${
                    selectedImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm uppercase tracking-wide text-gray-500 font-semibold">{product.brand}</p>
              <h1 className="text-2xl font-bold text-gray-900 mt-2">{product.name}</h1>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-3">
                <HiOutlineStar className="text-yellow-500" />
                <span>{(product?.ratings?.average || 0).toFixed(1)}</span>
                <span className="text-xs text-gray-400">({product?.ratings?.count || 0})</span>
              </div>
            </div>

            <div className="text-3xl font-bold text-blue-600">
              {displayPrice ? formatPrice(displayPrice) : 'Lien he'}
            </div>

            {product?.variants?.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-gray-900">Chon phien ban</h4>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant, index) => (
                    <button
                      key={`${variant.color}-${variant.storage}-${variant.sku}`}
                      type="button"
                      onClick={() => setSelectedVariantIndex(index)}
                      className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-colors ${
                        selectedVariantIndex === index
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600'
                      }`}
                    >
                      {variant.color} {variant.storage} - {formatPrice(variant.price || 0)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-200 rounded-full">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-gray-600"
                >
                  -
                </button>
                <span className="px-4 text-sm font-semibold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 text-gray-600"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                onClick={handleAddToCart}
                className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-full transition-colors"
              >
                <HiOutlineShoppingCart className="text-lg" />
                Them vao gio
              </button>
            </div>

            {product.description && (
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-2">Mo ta</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            {product.specifications && (
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-2">Thong so ky thuat</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <li key={key} className="flex justify-between border-b border-gray-100 py-2">
                      <span className="font-medium capitalize">{key}</span>
                      <span>{value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-8 space-y-6">
          <h3 className="text-lg font-bold text-gray-900">Danh gia san pham</h3>

          <div className="space-y-4">
            {reviews.length === 0 && (
              <div className="text-sm text-gray-500">Chua co danh gia nao.</div>
            )}
            {reviews.map((review) => (
              <ReviewItem key={review._id} review={review} />
            ))}
          </div>

          <div className="border-t border-gray-100 pt-6 space-y-4">
            <h4 className="text-sm font-bold text-gray-900">Viet danh gia</h4>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Rating</span>
              <select
                value={rating}
                onChange={(event) => setRating(Number(event.target.value))}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
              >
                {[5, 4, 3, 2, 1].map((value) => (
                  <option key={value} value={value}>
                    {value} sao
                  </option>
                ))}
              </select>
            </div>
            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              rows={4}
              placeholder="Chia se cam nhan ve san pham"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="button"
              onClick={handleSubmitReview}
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-6 py-3 rounded-full"
            >
              Gui danh gia
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;