import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HiOutlineSearch, HiOutlineAdjustments, HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import ProductGrid from '@/components/products/ProductGrid';
import BrandFilter from '@/components/products/BrandFilter';
import PriceRange from '@/components/products/PriceRange';
import { useDebounce, useFetch } from '@/hooks/useFetch';
import { productService } from '@/services/productService';
import { useCartStore } from '@/store/cartStore';
import { useNotificationStore } from '@/store/notificationStore';
import { formatPrice } from '@/lib/formatters';

const PAGE_SIZE = 12;

const getCategoryValue = (category) => {
  if (!category) return '';
  if (typeof category === 'string') return category.toLowerCase();
  return (category.slug || category.name || '').toLowerCase();
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

function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const brandParam = searchParams.get('brand') || '';
  const categoryParam = searchParams.get('category') || '';
  const ratingParam = Number(searchParams.get('rating') || 0);
  const sortParam = searchParams.get('sort') || 'name-asc';
  const pageParam = Number(searchParams.get('page') || 1);
  const minParam = searchParams.get('minPrice') || '';
  const maxParam = searchParams.get('maxPrice') || '';

  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [minPriceInput, setMinPriceInput] = useState(minParam);
  const [maxPriceInput, setMaxPriceInput] = useState(maxParam);

  const debouncedSearch = useDebounce(searchInput, 500);
  const { addItem } = useCartStore();
  const { addNotification } = useNotificationStore();

  const { data, isLoading, isError } = useFetch(
    ['products', debouncedSearch],
    () => {
      if (debouncedSearch.trim()) {
        return productService.search(debouncedSearch.trim());
      }
      return productService.getAll();
    },
    { staleTime: 1000 * 60 * 5 }
  );

  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    if (debouncedSearch.trim()) {
      next.set('search', debouncedSearch.trim());
    } else {
      next.delete('search');
    }
    next.delete('page');
    if (next.toString() !== searchParams.toString()) {
      setSearchParams(next);
    }
  }, [debouncedSearch, searchParams, setSearchParams]);

  useEffect(() => {
    setSearchInput(searchParams.get('search') || '');
    setMinPriceInput(searchParams.get('minPrice') || '');
    setMaxPriceInput(searchParams.get('maxPrice') || '');
  }, [searchParams.toString()]);

  const products = data?.data || [];

  const brands = useMemo(() => {
    const unique = new Set();
    products.forEach((product) => {
      if (product.brand) unique.add(product.brand);
    });
    return Array.from(unique).sort();
  }, [products]);

  const categories = useMemo(() => {
    const unique = new Set();
    products.forEach((product) => {
      const value = getCategoryValue(product.category);
      if (value) unique.add(value);
    });
    return Array.from(unique).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        if (brandParam) {
          if (!product.brand || product.brand.toLowerCase() !== brandParam.toLowerCase()) {
            return false;
          }
        }

        if (categoryParam) {
          const productCategory = getCategoryValue(product.category);
          if (!productCategory.includes(categoryParam.toLowerCase())) {
            return false;
          }
        }

        if (ratingParam > 0 && (product?.ratings?.average || 0) < ratingParam) {
          return false;
        }

        const price = getDisplayPrice(product);
        const minPrice = minParam ? Number(minParam) : null;
        const maxPrice = maxParam ? Number(maxParam) : null;

        if (minPrice !== null && price > 0 && price < minPrice) {
          return false;
        }
        if (maxPrice !== null && price > 0 && price > maxPrice) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = getDisplayPrice(a);
        const priceB = getDisplayPrice(b);
        const ratingA = a?.ratings?.average || 0;
        const ratingB = b?.ratings?.average || 0;

        switch (sortParam) {
          case 'price-asc':
            return priceA - priceB;
          case 'price-desc':
            return priceB - priceA;
          case 'rating-desc':
            return ratingB - ratingA;
          case 'name-desc':
            return b.name.localeCompare(a.name);
          default:
            return a.name.localeCompare(b.name);
        }
      });
  }, [products, categoryParam, ratingParam, sortParam, minParam, maxParam]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const currentPage = Math.min(pageParam, totalPages);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const minDisplayPrice = useMemo(() => {
    const prices = filteredProducts
      .map((product) => getDisplayPrice(product))
      .filter((price) => price > 0);
    if (prices.length === 0) return 0;
    return Math.min(...prices);
  }, [filteredProducts]);

  const handleAddToCart = (product) => {
    const price = getDisplayPrice(product);
    if (!price) {
      addNotification({ type: 'warning', message: 'San pham chua co gia' });
      return;
    }
    addItem({ productId: product._id, product, quantity: 1, price });
    addNotification({ type: 'success', message: 'Da them vao gio hang' });
  };

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    next.delete('page');
    setSearchParams(next);
  };

  const handleBrandChange = (brand) => {
    updateParam('brand', brand);
  };

  const handleCategoryChange = (category) => {
    updateParam('category', category);
  };

  const handleApplyPrice = () => {
    const next = new URLSearchParams(searchParams);
    if (minPriceInput) {
      next.set('minPrice', minPriceInput);
    } else {
      next.delete('minPrice');
    }
    if (maxPriceInput) {
      next.set('maxPrice', maxPriceInput);
    } else {
      next.delete('maxPrice');
    }
    next.delete('page');
    setSearchParams(next);
  };

  const handlePageChange = (page) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', page.toString());
    setSearchParams(next);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-10 py-10 space-y-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3 text-gray-800 font-bold text-lg">
            <HiOutlineAdjustments className="text-blue-500" />
            Danh sach san pham
          </div>
          <div className="flex flex-1 max-w-xl items-center gap-3 bg-gray-50 border border-gray-200 rounded-full px-4 py-2">
            <HiOutlineSearch className="text-gray-400" />
            <input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Tim kiem theo ten san pham"
              className="flex-1 bg-transparent focus:outline-none text-sm"
            />
          </div>
          <select
            value={sortParam}
            onChange={(event) => updateParam('sort', event.target.value)}
            className="border border-gray-200 rounded-full px-4 py-2 text-sm font-semibold text-gray-600"
          >
            <option value="name-asc">Ten A-Z</option>
            <option value="name-desc">Ten Z-A</option>
            <option value="price-asc">Gia tang dan</option>
            <option value="price-desc">Gia giam dan</option>
            <option value="rating-desc">Danh gia cao</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          <aside className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6 h-fit">
            <BrandFilter
              brands={brands}
              activeBrand={brandParam}
              onChange={handleBrandChange}
            />

            <div className="space-y-3">
              <h4 className="text-sm font-bold text-gray-900">Danh muc</h4>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleCategoryChange('')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    !categoryParam
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600'
                  }`}
                >
                  Tat ca
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleCategoryChange(category)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                      categoryParam === category
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <PriceRange
              minPrice={minPriceInput}
              maxPrice={maxPriceInput}
              onChange={(type, value) => {
                if (type === 'min') setMinPriceInput(value);
                if (type === 'max') setMaxPriceInput(value);
              }}
              onApply={handleApplyPrice}
            />

            <div className="space-y-3">
              <h4 className="text-sm font-bold text-gray-900">Danh gia</h4>
              <select
                value={ratingParam}
                onChange={(event) => updateParam('rating', event.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              >
                <option value="0">Tat ca</option>
                <option value="4">Tu 4 sao</option>
                <option value="3">Tu 3 sao</option>
                <option value="2">Tu 2 sao</option>
                <option value="1">Tu 1 sao</option>
              </select>
            </div>
          </aside>

          <section className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                {filteredProducts.length} san pham
              </div>
              <div className="text-sm text-gray-500">
                Gia tu {minDisplayPrice ? formatPrice(minDisplayPrice) : 'Lien he'}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              {isLoading && <div className="text-center text-gray-500 py-12">Dang tai san pham...</div>}
              {isError && <div className="text-center text-red-500 py-12">Khong the tai san pham.</div>}
              {!isLoading && !isError && (
                <ProductGrid products={paginatedProducts} onAddToCart={handleAddToCart} />
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className="p-2 rounded-full border border-gray-200 hover:border-blue-400"
                >
                  <HiChevronLeft />
                </button>
                {Array.from({ length: totalPages }).map((_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => handlePageChange(pageNumber)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                        pageNumber === currentPage
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  className="p-2 rounded-full border border-gray-200 hover:border-blue-400"
                >
                  <HiChevronRight />
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default ProductListPage;