import api from '@/utils/axios-setup';

/**
 * ✅ Upload Service
 * Handles: image upload with progress tracking
 */

export const uploadService = {
  /**
   * Upload hình ảnh với progress tracking
   */
  uploadImage: async (
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post<{ success: boolean; url: string }>(
        '/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            if (onProgress && progressEvent.total) {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              onProgress(progress);
            }
          },
        }
      );

      return response.data.url;
    } catch (error) {
      throw new Error('Failed to upload image');
    }
  },

  /**
   * Upload multiple images
   */
  uploadMultiple: async (
    files: File[],
    onProgress?: (progress: number) => void
  ): Promise<string[]> => {
    const uploads = files.map((file, index) =>
      uploadService.uploadImage(file, (progress) => {
        const totalProgress = Math.round(((index + progress / 100) / files.length) * 100);
        onProgress?.(totalProgress);
      })
    );

    return Promise.all(uploads);
  },
};
