/**
 * ✅ Validation Helpers
 * Hàm validate cho các use cases khác nhau
 */

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (10 digits)
 */
export const isValidPhone = (phone: string): boolean => {
  return /^\d{10}$/.test(phone);
};

/**
 * Validate password strength
 * - Min 6 characters
 * - At least 1 uppercase letter (optional for now)
 * - At least 1 number (optional for now)
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

/**
 * Validate full name
 */
export const isValidFullname = (name: string): boolean => {
  return name.trim().length >= 3;
};

/**
 * Validate URL
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate image file
 */
export const isValidImageFile = (
  file: File,
  maxSize: number = 5 * 1024 * 1024
): boolean => {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  
  if (!validTypes.includes(file.type)) {
    return false;
  }
  
  if (file.size > maxSize) {
    return false;
  }
  
  return true;
};

/**
 * Validate product price
 */
export const isValidPrice = (price: number): boolean => {
  return price > 0 && !isNaN(price);
};

/**
 * Validate rating
 */
export const isValidRating = (rating: number): boolean => {
  return rating >= 1 && rating <= 5 && Number.isInteger(rating);
};

/**
 * Validate address
 */
export const isValidAddress = (address: {
  street: string;
  city: string;
  state: string;
  country: string;
}): boolean => {
  return (
    address.street.length >= 5 &&
    address.city.length >= 2 &&
    address.state.length >= 2 &&
    address.country.length >= 2
  );
};

/**
 * Validate cart quantity
 */
export const isValidQuantity = (quantity: number): boolean => {
  return Number.isInteger(quantity) && quantity > 0;
};

/**
 * Check if string is empty or whitespace
 */
export const isEmpty = (str: string): boolean => {
  return !str || str.trim().length === 0;
};

/**
 * Check if object is empty
 */
export const isEmptyObject = (obj: object): boolean => {
  return Object.keys(obj).length === 0;
};

/**
 * Check if array is empty
 */
export const isEmptyArray = (arr: any[]): boolean => {
  return !arr || arr.length === 0;
};

/**
 * Get validation error message
 */
export const getValidationErrorMessage = (error: any): string => {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  return 'Đã xảy ra lỗi. Vui lòng thử lại.';
};

/**
 * Validate search query
 */
export const isValidSearchQuery = (query: string, minLength: number = 2): boolean => {
  return query.trim().length >= minLength;
};
