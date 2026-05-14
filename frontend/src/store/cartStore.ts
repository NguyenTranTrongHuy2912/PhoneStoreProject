import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/types';

interface CartStore {
  items: CartItem[];

  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, sku?: string) => void;
  updateQuantity: (productId: string, quantity: number, sku?: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

/**
 * ✅ Cart Store (Zustand)
 * Quản lý giỏ hàng - Persisted ở localStorage
 * 
 * FIX: Bỏ `totalPrice` state thừa để tránh race condition.
 * Giá tổng được tính trực tiếp từ items mỗi khi cần.
 * 
 * FIX: removeItem và updateQuantity hỗ trợ sku để phân biệt
 * cùng sản phẩm nhưng khác màu/dung lượng.
 */
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item: CartItem) => {
        const state = get();
        // Nhận dạng item theo productId + sku
        const existingItem = state.items.find(
          (i) => i.productId === item.productId && i.sku === item.sku
        );

        if (existingItem) {
          set({
            items: state.items.map((i) =>
              i.productId === item.productId && i.sku === item.sku
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
        } else {
          set({
            items: [...state.items, item],
          });
        }
      },

      removeItem: (productId: string, sku?: string) => {
        set({
          items: get().items.filter((i) => {
            if (sku !== undefined) {
              return !(i.productId === productId && i.sku === sku);
            }
            return i.productId !== productId;
          }),
        });
      },

      updateQuantity: (productId: string, quantity: number, sku?: string) => {
        if (quantity <= 0) {
          get().removeItem(productId, sku);
          return;
        }

        set({
          items: get().items.map((i) => {
            if (sku !== undefined) {
              return i.productId === productId && i.sku === sku ? { ...i, quantity } : i;
            }
            return i.productId === productId ? { ...i, quantity } : i;
          }),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      // Tính trực tiếp từ items thay vì lưu state thừa (tránh race condition)
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'cart-store',
    }
  )
);
