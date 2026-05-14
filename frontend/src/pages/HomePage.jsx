import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineShoppingCart, HiOutlineStar, HiArrowRight, HiOutlinePhone, HiOutlineTruck, HiOutlineShieldCheck, HiOutlineRefresh } from 'react-icons/hi';
import { useFetch } from '@/hooks/useFetch';
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';
import { useCartStore } from '@/store/cartStore';
import { useNotificationStore } from '@/store/notificationStore';
import { formatPrice } from '@/lib/formatters';

const getDisplayPrice = (product) => {
  if (product?.variants?.length) {
    const prices = product.variants
      .map((v) => v.price)
      .filter((p) => typeof p === 'number' && p > 0);
    if (prices.length > 0) return Math.min(...prices);
  }
  return 0;
};

// ==================== HERO SECTION ====================
function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e3a5f] to-[#2d6289] text-white">
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'radial-gradient(circle at 20% 50%, #60a5fa 0%, transparent 50%), radial-gradient(circle at 80% 20%, #818cf8 0%, transparent 50%)'
      }} />
      <div className="max-w-[1440px] mx-auto px-10 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm font-semibold px-4 py-2 rounded-full">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            Cửa hàng điện thoại uy tín #1 Việt Nam
          </div>
          <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight">
            Công Nghệ<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Đỉnh Cao
            </span><br />
            Giá Tốt Nhất
          </h1>
          <p className="text-lg text-blue-200 leading-relaxed max-w-lg">
            Khám phá hàng nghìn sản phẩm chính hãng từ Apple, Samsung, Xiaomi và nhiều thương hiệu hàng đầu thế giới với giá cực kỳ cạnh tranh.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-400/40 hover:-translate-y-0.5"
            >
              Mua sắm ngay <HiArrowRight className="text-lg" />
            </Link>
            <Link
              to="/products?brand=Apple"
              className="inline-flex items-center gap-2 border-2 border-white/30 hover:border-white/60 text-white font-bold px-8 py-4 rounded-2xl transition-all hover:bg-white/10"
            >
              Xem iPhone mới
            </Link>
          </div>

          {/* Stats */}
          <div className="flex gap-10 pt-4 border-t border-white/10">
            {[
              { value: '10,000+', label: 'Sản phẩm' },
              { value: '50,000+', label: 'Khách hàng' },
              { value: '99%', label: 'Hài lòng' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-black text-white">{stat.value}</div>
                <div className="text-sm text-blue-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero Visual */}
        <div className="hidden lg:flex items-center justify-center relative">
          <div className="absolute w-80 h-80 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="relative grid grid-cols-3 gap-4">
            {['Apple', 'Samsung', 'Xiaomi'].map((brand) => (
              <Link
                key={brand}
                to={`/products?brand=${brand}`}
                className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center hover:bg-white/20 transition-all hover:-translate-y-1"
              >
                <div className="text-3xl mb-2">
                  {brand === 'Apple' ? '🍎' : brand === 'Samsung' ? '📱' : '⚡'}
                </div>
                <div className="text-white font-bold text-sm">{brand}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ==================== FEATURES SECTION ====================
function FeaturesSection() {
  const features = [
    { icon: <HiOutlineTruck className="text-2xl text-blue-500" />, title: 'Miễn phí vận chuyển', desc: 'Cho đơn hàng từ 500K' },
    { icon: <HiOutlineShieldCheck className="text-2xl text-green-500" />, title: 'Bảo hành chính hãng', desc: 'Cam kết 12 tháng' },
    { icon: <HiOutlineRefresh className="text-2xl text-orange-500" />, title: 'Đổi trả dễ dàng', desc: '7 ngày không lý do' },
    { icon: <HiOutlinePhone className="text-2xl text-purple-500" />, title: 'Hỗ trợ 24/7', desc: 'Tư vấn tận tâm' },
  ];

  return (
    <section className="py-12 border-b border-gray-100">
      <div className="max-w-[1440px] mx-auto px-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 bg-gray-50 rounded-xl">{f.icon}</div>
              <div>
                <div className="font-bold text-gray-900 text-sm">{f.title}</div>
                <div className="text-xs text-gray-500">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==================== BRANDS SECTION ====================
function BrandsSection() {
  const brands = [
    { name: 'Apple', emoji: '🍎', color: 'from-gray-800 to-gray-600' },
    { name: 'Samsung', emoji: '📱', color: 'from-blue-700 to-blue-500' },
    { name: 'Xiaomi', emoji: '⚡', color: 'from-orange-600 to-orange-400' },
  ];

  return (
    <section className="py-14">
      <div className="max-w-[1440px] mx-auto px-10 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold text-gray-900">Thương Hiệu Hàng Đầu</h2>
          <p className="text-gray-500 text-sm">Sản phẩm chính hãng 100% từ các thương hiệu uy tín</p>
        </div>
        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
          {brands.map((brand) => (
            <Link
              key={brand.name}
              to={`/products?brand=${brand.name}`}
              className="group flex flex-col items-center gap-3 p-5 bg-white border border-gray-100 rounded-2xl hover:border-blue-200 hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${brand.color} rounded-xl flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform`}>
                {brand.emoji}
              </div>
              <span className="text-xs font-bold text-gray-700 group-hover:text-blue-600 transition-colors">{brand.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==================== PRODUCT CARD ====================
function HomeProductCard({ product, onAddToCart }) {
  const price = getDisplayPrice(product);
  const imageSrc = product?.images?.[0] || '/logo-grid.svg';
  const rating = product?.ratings?.average || 0;

  return (
    <div className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-1">
      <Link to={`/products/${product._id}`} className="block">
        <div className="relative bg-gray-50 p-6 flex items-center justify-center h-48 overflow-hidden">
          <img
            src={imageSrc}
            alt={product.name}
            className="max-h-36 object-contain group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { e.currentTarget.src = '/logo-grid.svg'; }}
          />
          {/* Brand badge */}
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-bold text-gray-600 px-2 py-1 rounded-lg">
            {product.brand}
          </div>
        </div>
      </Link>
      <div className="p-4 space-y-3">
        <Link to={`/products/${product._id}`}>
          <h3 className="text-sm font-bold text-gray-900 leading-snug hover:text-blue-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1">
          {[1,2,3,4,5].map((star) => (
            <HiOutlineStar
              key={star}
              className={`text-xs ${star <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
            />
          ))}
          <span className="text-xs text-gray-400 ml-1">({product?.ratings?.count || 0})</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-base font-black text-blue-600">
            {price > 0 ? formatPrice(price) : 'Liên hệ'}
          </div>
          <button
            type="button"
            onClick={() => onAddToCart?.(product)}
            className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 active:scale-95 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-all"
          >
            <HiOutlineShoppingCart className="text-sm" />
            Thêm
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== FEATURED PRODUCTS ====================
function FeaturedProducts({ title, products, onAddToCart }) {
  if (!products || products.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-gray-900">{title}</h2>
        <Link
          to="/products"
          className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          Xem tất cả <HiArrowRight className="text-base" />
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {products.map((product) => (
          <HomeProductCard
            key={product._id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
}

// ==================== PROMO BANNER ====================
function PromoBanner() {
  return (
    <section className="py-4">
      <div className="max-w-[1440px] mx-auto px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/products?brand=Apple"
            className="relative overflow-hidden bg-gradient-to-r from-gray-900 to-gray-700 rounded-2xl p-8 text-white flex items-center gap-6 hover:opacity-90 transition-opacity group"
          >
            <div className="text-6xl group-hover:scale-110 transition-transform">🍎</div>
            <div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Mới nhất 2024</div>
              <div className="text-2xl font-black mb-1">iPhone 16 Series</div>
              <div className="text-gray-300 text-sm">Chip A18 Pro | Camera 48MP</div>
              <div className="mt-3 inline-flex items-center gap-1 text-xs font-bold bg-white/10 border border-white/20 px-3 py-1.5 rounded-full">
                Mua ngay <HiArrowRight />
              </div>
            </div>
          </Link>
          <Link
            to="/products?brand=Samsung"
            className="relative overflow-hidden bg-gradient-to-r from-blue-900 to-blue-700 rounded-2xl p-8 text-white flex items-center gap-6 hover:opacity-90 transition-opacity group"
          >
            <div className="text-6xl group-hover:scale-110 transition-transform">📱</div>
            <div>
              <div className="text-xs font-bold text-blue-300 uppercase tracking-wider mb-1">Galaxy AI</div>
              <div className="text-2xl font-black mb-1">Samsung S24 Ultra</div>
              <div className="text-blue-200 text-sm">AI Camera | 200MP</div>
              <div className="mt-3 inline-flex items-center gap-1 text-xs font-bold bg-white/10 border border-white/20 px-3 py-1.5 rounded-full">
                Khám phá <HiArrowRight />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ==================== MAIN HOMEPAGE ====================
function HomePage() {
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const { addNotification } = useNotificationStore();

  const { data, isLoading } = useFetch(
    ['products-home'],
    () => productService.getAll(),
    { staleTime: 1000 * 60 * 5 }
  );

  const products = data?.data || [];

  // Lấy sản phẩm nổi bật (6 sản phẩm đầu tiên)
  const featuredProducts = useMemo(() => products.slice(0, 6), [products]);

  // Sản phẩm Apple
  const appleProducts = useMemo(
    () => products.filter((p) => p.brand?.toLowerCase() === 'apple').slice(0, 6),
    [products]
  );

  // Sản phẩm Samsung
  const samsungProducts = useMemo(
    () => products.filter((p) => p.brand?.toLowerCase() === 'samsung').slice(0, 6),
    [products]
  );

  const handleAddToCart = (product) => {
    const price = getDisplayPrice(product);
    if (!price) {
      addNotification({ type: 'warning', message: 'Sản phẩm chưa có giá' });
      return;
    }
    addItem({
      productId: product._id,
      product,
      quantity: 1,
      price,
      sku: product?.variants?.[0]?.sku,
    });
    addNotification({ type: 'success', message: 'Đã thêm vào giỏ hàng!' });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <HeroSection />

      {/* Features */}
      <FeaturesSection />

      {/* Main content */}
      <div className="max-w-[1440px] mx-auto px-10 py-12 space-y-16">
        {/* Promo Banners */}
        <PromoBanner />

        {/* Thương hiệu */}
        <BrandsSection />

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <div className="text-sm text-gray-500 font-medium">Đang tải sản phẩm...</div>
            </div>
          </div>
        )}

        {!isLoading && products.length > 0 && (
          <>
            {/* Featured Products */}
            <section className="space-y-6">
              <FeaturedProducts
                title="🔥 Sản Phẩm Nổi Bật"
                products={featuredProducts}
                onAddToCart={handleAddToCart}
              />
            </section>

            {/* Apple Products */}
            {appleProducts.length > 0 && (
              <section>
                <FeaturedProducts
                  title="🍎 Apple — iPhone & iPad"
                  products={appleProducts}
                  onAddToCart={handleAddToCart}
                />
              </section>
            )}

            {/* Samsung Products */}
            {samsungProducts.length > 0 && (
              <section>
                <FeaturedProducts
                  title="📱 Samsung Galaxy"
                  products={samsungProducts}
                  onAddToCart={handleAddToCart}
                />
              </section>
            )}
          </>
        )}

        {/* No products state */}
        {!isLoading && products.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <div className="text-6xl">📦</div>
            <h3 className="text-xl font-bold text-gray-700">Chưa có sản phẩm nào</h3>
            <p className="text-gray-500 text-sm">Hãy thêm sản phẩm vào kho hàng từ Admin Panel</p>
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Thêm sản phẩm
            </Link>
          </div>
        )}
      </div>

      {/* Footer Banner CTA */}
      <section className="bg-gradient-to-r from-[#2d6289] to-[#1e3a5f] py-16 mt-8">
        <div className="max-w-[1440px] mx-auto px-10 text-center space-y-6">
          <h2 className="text-3xl font-black text-white">Bắt Đầu Mua Sắm Ngay Hôm Nay</h2>
          <p className="text-blue-200 text-lg max-w-xl mx-auto">
            Hàng ngàn sản phẩm chính hãng đang chờ bạn. Giao hàng nhanh, giá tốt nhất!
          </p>
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="inline-flex items-center gap-3 bg-white text-blue-700 font-black text-lg px-10 py-4 rounded-2xl hover:bg-blue-50 transition-all shadow-2xl hover:-translate-y-0.5"
          >
            Xem tất cả sản phẩm <HiArrowRight className="text-xl" />
          </button>
        </div>
      </section>
    </div>
  );
}

export default HomePage;