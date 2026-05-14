import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiOutlineStar, HiOutlineShoppingCart, HiStar, HiOutlineChevronLeft } from 'react-icons/hi';
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
  const navigate = useNavigate();
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
      addNotification({ type: 'success', message: 'Đã gửi đánh giá thành công!' });
      setComment('');
      setRating(5);
    },
    () => {
      addNotification({ type: 'error', message: 'Không thể gửi đánh giá. Vui lòng thử lại.' });
    }
  );

  useEffect(() => {
    if (product?.images?.length) setSelectedImageIndex(0);
    if (product?.variants?.length) setSelectedVariantIndex(0);
  }, [product?.images?.length, product?.variants?.length]);

  const selectedVariant = product?.variants?.[selectedVariantIndex] || null;
  const displayPrice = selectedVariant?.price || getDisplayPrice(product);
  const imageSrc = product?.images?.[selectedImageIndex] || '/logo-grid.svg';

  const handleAddToCart = () => {
    if (!product) return;
    if (!displayPrice) {
      addNotification({ type: 'warning', message: 'Sản phẩm chưa có giá' });
      return;
    }
    addItem({
      productId: product._id,
      product,
      quantity,
      price: displayPrice,
      variant: selectedVariant,
      sku: selectedVariant?.sku,
    });
    addNotification({ type: 'success', message: 'Đã thêm vào giỏ hàng!' });
  };

  const handleBuyNow = () => {
    if (!product) return;
    if (!displayPrice) {
      addNotification({ type: 'warning', message: 'Sản phẩm chưa có giá' });
      return;
    }
    addItem({
      productId: product._id,
      product,
      quantity,
      price: displayPrice,
      variant: selectedVariant,
      sku: selectedVariant?.sku,
    });
    navigate('/checkout');
  };

  const handleSubmitReview = () => {
    if (!user) {
      addNotification({ type: 'warning', message: 'Vui lòng đăng nhập để đánh giá' });
      return;
    }
    if (!comment.trim()) {
      addNotification({ type: 'warning', message: 'Vui lòng nhập nội dung nhận xét' });
      return;
    }
    createReviewMutation.mutate({
      productId: product._id,
      rating,
      comment: comment.trim(),
    });
  };

  // ── Loading / Error states ──────────────────────────────
  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-[1200px] mx-auto px-6 py-10">
          <div className="bg-white rounded-2xl p-8 grid grid-cols-1 lg:grid-cols-2 gap-10 animate-pulse">
            <div className="bg-gray-100 rounded-2xl h-80" />
            <div className="space-y-4">
              <div className="h-4 bg-gray-100 rounded w-24" />
              <div className="h-8 bg-gray-100 rounded w-3/4" />
              <div className="h-6 bg-gray-100 rounded w-1/3" />
              <div className="h-10 bg-gray-100 rounded w-1/2 mt-6" />
              <div className="flex gap-3 mt-4">
                <div className="h-12 bg-gray-100 rounded-full flex-1" />
                <div className="h-12 bg-gray-100 rounded-full flex-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-2xl text-gray-300">😕</p>
          <p className="text-gray-500">Không tìm thấy sản phẩm.</p>
          <button
            onClick={() => navigate('/products')}
            className="text-blue-600 font-semibold hover:underline text-sm"
          >
            ← Quay lại danh sách sản phẩm
          </button>
        </div>
      </div>
    );
  }

  const avgRating = product?.ratings?.average || 0;
  const countRating = product?.ratings?.count || 0;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[1200px] mx-auto px-6 py-8 space-y-8">

        {/* Breadcrumb */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors"
        >
          <HiOutlineChevronLeft />
          Quay lại
        </button>

        {/* ── Product Main Card ── */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Left — Images */}
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-2xl p-6 flex items-center justify-center min-h-[300px]">
              <img
                src={imageSrc}
                alt={product.name}
                className="max-h-80 object-contain transition-opacity duration-200"
                onError={(e) => { e.currentTarget.src = '/logo-grid.svg'; }}
              />
            </div>
            {/* Thumbnail strip */}
            {product.images?.length > 1 && (
              <div className="flex gap-3 flex-wrap">
                {product.images.map((img, index) => (
                  <button
                    key={img + index}
                    type="button"
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-16 h-16 border-2 rounded-xl p-1.5 bg-white transition-colors ${
                      selectedImageIndex === index
                        ? 'border-blue-500 shadow-md'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Ảnh ${index + 1}`}
                      className="w-full h-full object-contain"
                      onError={(e) => { e.currentTarget.src = '/logo-grid.svg'; }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right — Info */}
          <div className="space-y-5">
            {/* Brand + Name + Rating */}
            <div>
              <p className="text-xs uppercase tracking-widest text-blue-600 font-bold">{product.brand}</p>
              <h1 className="text-2xl font-bold text-gray-900 mt-1.5 leading-snug">{product.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex">
                  {[1,2,3,4,5].map((star) => (
                    <span key={star}>
                      {star <= Math.round(avgRating)
                        ? <HiStar className="text-yellow-400 text-base" />
                        : <HiOutlineStar className="text-gray-300 text-base" />
                      }
                    </span>
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-700">{avgRating.toFixed(1)}</span>
                <span className="text-xs text-gray-400">({countRating} đánh giá)</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-red-600">
                {displayPrice ? formatPrice(displayPrice) : 'Liên hệ'}
              </span>
            </div>

            {/* Variants */}
            {product?.variants?.length > 0 && (
              <div className="space-y-2.5">
                <h4 className="text-sm font-bold text-gray-800">Chọn phiên bản</h4>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant, index) => (
                    <button
                      key={`${variant.color}-${variant.storage}-${index}`}
                      type="button"
                      onClick={() => setSelectedVariantIndex(index)}
                      className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-all ${
                        selectedVariantIndex === index
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                          : 'border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600'
                      }`}
                    >
                      {[variant.color, variant.storage].filter(Boolean).join(' / ')}
                      {variant.price ? ` — ${formatPrice(variant.price)}` : ''}
                    </button>
                  ))}
                </div>
                {selectedVariant?.stock !== undefined && (
                  <p className="text-xs text-gray-400">
                    Còn lại: <span className="font-semibold text-gray-700">{selectedVariant.stock} sản phẩm</span>
                  </p>
                )}
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-gray-700">Số lượng:</span>
              <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-50 transition-colors font-bold"
                >
                  −
                </button>
                <span className="px-5 text-sm font-bold text-gray-800 border-x border-gray-200">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-50 transition-colors font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={!displayPrice}
                className="flex-1 bg-red-500 hover:bg-red-600 active:scale-95 text-white font-bold py-3.5 rounded-full transition-all shadow-lg shadow-red-200 disabled:opacity-40 disabled:cursor-not-allowed text-sm"
              >
                Mua ngay
              </button>
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!displayPrice}
                className="flex-1 flex items-center justify-center gap-2 border-2 border-blue-500 text-blue-600 hover:bg-blue-50 active:scale-95 font-bold py-3.5 rounded-full transition-all text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <HiOutlineShoppingCart className="text-lg" />
                Thêm vào giỏ
              </button>
            </div>

            {/* Description */}
            {product.description && (
              <div className="pt-2 border-t border-gray-100">
                <h4 className="text-sm font-bold text-gray-900 mb-2">Mô tả sản phẩm</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-3">Thông số kỹ thuật</h4>
                <div className="rounded-xl overflow-hidden border border-gray-100">
                  {Object.entries(product.specifications).map(([key, value], i) => (
                    <div
                      key={key}
                      className={`flex justify-between py-2.5 px-4 text-sm ${
                        i % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                      }`}
                    >
                      <span className="font-medium text-gray-700 capitalize">{key}</span>
                      <span className="text-gray-600">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Reviews ── */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">
              Đánh giá sản phẩm
              <span className="ml-2 text-sm text-gray-400 font-normal">({reviews.length})</span>
            </h3>
            {avgRating > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-yellow-500">{avgRating.toFixed(1)}</span>
                <div className="flex">
                  {[1,2,3,4,5].map((star) => (
                    <HiStar
                      key={star}
                      className={star <= Math.round(avgRating) ? 'text-yellow-400' : 'text-gray-200'}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Review list */}
          <div className="space-y-4">
            {reviews.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">
                Chưa có đánh giá nào. Hãy là người đầu tiên!
              </div>
            )}
            {reviews.map((review) => (
              <ReviewItem key={review._id} review={review} />
            ))}
          </div>

          {/* Write review */}
          <div className="border-t border-gray-100 pt-6 space-y-4">
            <h4 className="text-sm font-bold text-gray-900">Viết đánh giá của bạn</h4>

            {!user && (
              <p className="text-sm text-gray-500 bg-blue-50 rounded-xl px-4 py-3">
                <button
                  onClick={() => navigate('/login')}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Đăng nhập
                </button>{' '}
                để gửi đánh giá sản phẩm.
              </p>
            )}

            {user && (
              <>
                {/* Star rating selector */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Điểm đánh giá:</span>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="transition-transform hover:scale-110"
                      >
                        <HiStar
                          className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-200'}`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 ml-1">{rating}/5</span>
                </div>

                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  placeholder="Chia sẻ cảm nhận về sản phẩm..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                />
                <button
                  type="button"
                  onClick={handleSubmitReview}
                  disabled={createReviewMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-8 py-3 rounded-full transition-colors disabled:opacity-60"
                >
                  {createReviewMutation.isPending ? 'Đang gửi...' : 'Gửi đánh giá'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;