import React, { useEffect, useState, useCallback } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi';
import AdminModal from './AdminModal';
import ImageUpload from './ImageUpload';
import { useFetch } from '@/hooks/useFetch';
import { categoryService } from '@/services/categoryService';
import { uploadService } from '@/services/uploadService';

const defaultVariant = () => ({ color: '', storage: '', price: '', stock: '' });

/**
 * ProductFormModal — full product create/edit form
 * Props: isOpen, onClose, onSubmit, product (null = create), loading
 */
function ProductFormModal({ isOpen, onClose, onSubmit, product = null, loading = false }) {
  const isEdit = !!product;
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const { data: catData } = useFetch(['admin-categories'], () => categoryService.getAll());
  const categories = catData?.data || [];

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      brand: '',
      category: '',
      description: '',
      variants: [defaultVariant()],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'variants' });

  // Populate form when editing
  useEffect(() => {
    if (isOpen) {
      if (product) {
        reset({
          name: product.name || '',
          brand: product.brand || '',
          category:
            typeof product.category === 'object'
              ? product.category?._id || ''
              : product.category || '',
          description: product.description || '',
          variants:
            product.variants?.length
              ? product.variants.map((v) => ({
                  color: v.color || '',
                  storage: v.storage || '',
                  price: v.price ?? '',
                  stock: v.stock ?? '',
                }))
              : [defaultVariant()],
        });
        setImages(product.images || []);
      } else {
        reset({
          name: '',
          brand: '',
          category: '',
          description: '',
          variants: [defaultVariant()],
        });
        setImages([]);
      }
    }
  }, [isOpen, product, reset]);

  const handleAddImages = useCallback(
    async (files) => {
      setUploading(true);
      try {
        const urls = await uploadService.uploadMultiple(files);
        setImages((prev) => [...prev, ...urls]);
      } catch {
        // silently handled by upload service
      } finally {
        setUploading(false);
      }
    },
    []
  );

  const handleRemoveImage = useCallback((index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const onFormSubmit = (data) => {
    const payload = {
      name: data.name.trim(),
      brand: data.brand.trim(),
      category: data.category || undefined,
      description: data.description.trim(),
      variants: data.variants
        .filter((v) => v.price !== '' && v.price !== null)
        .map((v) => ({
          color: v.color.trim(),
          storage: v.storage.trim(),
          price: parseFloat(v.price) || 0,
          stock: parseInt(v.stock) || 0,
        })),
      images,
    };
    onSubmit(payload);
  };

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
      size="xl"
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Basic info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Tên sản phẩm <span className="text-red-500">*</span>
            </label>
            <input
              {...register('name', { required: 'Vui lòng nhập tên sản phẩm' })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-shadow"
              placeholder="iPhone 15 Pro Max"
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Thương hiệu <span className="text-red-500">*</span>
            </label>
            <input
              {...register('brand', { required: 'Vui lòng nhập thương hiệu' })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-shadow"
              placeholder="Apple"
            />
            {errors.brand && <p className="text-xs text-red-500">{errors.brand.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Danh mục</label>
            <select
              {...register('category')}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-sm font-semibold text-gray-700">Mô tả sản phẩm</label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none transition-shadow"
              placeholder="Mô tả chi tiết về sản phẩm..."
            />
          </div>
        </div>

        {/* Variants */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-gray-700">Phiên bản sản phẩm</label>
            <button
              type="button"
              onClick={() => append(defaultVariant())}
              className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <HiOutlinePlus /> Thêm phiên bản
            </button>
          </div>

          <div className="space-y-2">
            {/* Header */}
            <div className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2 text-xs font-semibold text-gray-400 px-1">
              <span>Màu sắc</span>
              <span>Dung lượng</span>
              <span>Giá (VND) *</span>
              <span>Tồn kho</span>
              <span />
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2 items-center">
                <input
                  {...register(`variants.${index}.color`)}
                  placeholder="Đen"
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
                <input
                  {...register(`variants.${index}.storage`)}
                  placeholder="256GB"
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
                <input
                  {...register(`variants.${index}.price`, { required: index === 0 })}
                  type="number"
                  placeholder="29990000"
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
                <input
                  {...register(`variants.${index}.stock`)}
                  type="number"
                  placeholder="10"
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
                <button
                  type="button"
                  onClick={() => fields.length > 1 && remove(index)}
                  disabled={fields.length === 1}
                  className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-30 transition-colors"
                >
                  <HiOutlineTrash />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Image upload */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Hình ảnh sản phẩm</label>
          <ImageUpload
            images={images}
            onAdd={handleAddImages}
            onRemove={handleRemoveImage}
            uploading={uploading}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading || uploading}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors disabled:opacity-60 shadow-sm"
          >
            {loading ? 'Đang lưu...' : isEdit ? 'Cập nhật sản phẩm' : 'Tạo sản phẩm'}
          </button>
        </div>
      </form>
    </AdminModal>
  );
}

export default ProductFormModal;
