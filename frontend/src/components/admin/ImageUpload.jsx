import React, { useRef, useState, useCallback } from 'react';
import { HiOutlinePhotograph, HiX, HiOutlineCloudUpload } from 'react-icons/hi';
import { formatFileSize } from '@/lib/formatters';

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * ImageUpload — drag-drop image uploader with preview + validation
 * Props: images (string[] existing), onAdd (File[]), onRemove (index), uploading
 */
function ImageUpload({ images = [], onAdd, onRemove, uploading = false }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [errors, setErrors] = useState([]);

  const validateFiles = useCallback((files) => {
    const errs = [];
    const valid = [];
    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        errs.push(`"${file.name}" — định dạng không hỗ trợ (chỉ JPG/PNG/WebP)`);
      } else if (file.size > MAX_SIZE) {
        errs.push(`"${file.name}" — vượt quá 5MB (${formatFileSize(file.size)})`);
      } else {
        valid.push(file);
      }
    }
    setErrors(errs);
    if (valid.length > 0) onAdd(valid);
  }, [onAdd]);

  const handleFiles = (files) => validateFiles(Array.from(files));

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
          dragOver
            ? 'border-indigo-400 bg-indigo-50'
            : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
        }`}
      >
        <HiOutlineCloudUpload className="mx-auto text-3xl text-gray-400 mb-2" />
        <p className="text-sm text-gray-600 font-medium">
          {uploading ? 'Đang tải lên...' : 'Kéo ảnh vào đây hoặc click để chọn'}
        </p>
        <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP — tối đa 5MB mỗi ảnh</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
          disabled={uploading}
        />
      </div>

      {/* Validation errors */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 space-y-1">
          {errors.map((err, i) => (
            <p key={i} className="text-xs text-red-600">{err}</p>
          ))}
        </div>
      )}

      {/* Preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {images.map((src, i) => (
            <div key={i} className="relative group rounded-xl overflow-hidden aspect-square border border-gray-200">
              <img
                src={src}
                alt={`Ảnh ${i + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = 'https://placehold.co/100x100/f1f5f9/94a3b8?text=Img'; }}
              />
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all"
                aria-label="Xóa ảnh"
              >
                <HiX className="text-xs" />
              </button>
              {i === 0 && (
                <span className="absolute bottom-1 left-1 text-[10px] bg-indigo-600 text-white px-1.5 py-0.5 rounded-full font-semibold">
                  Chính
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="flex items-center justify-center gap-2 text-gray-300 py-4">
          <HiOutlinePhotograph className="text-2xl" />
          <span className="text-sm">Chưa có ảnh nào</span>
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
