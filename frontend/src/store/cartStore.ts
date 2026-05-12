import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/types';

interface CartStore {
  items: CartItem[];
  totalPrice: number;

  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

/**
 * ✅ Cart Store (Zustand)
 * Quản lý giỏ hàng
 * Persisted ở localStorage
 */
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      totalPrice: 0,

      addItem: (item: CartItem) => {
        const state = get();
        const existingItem = state.items.find((i) => i.productId === item.productId);

        if (existingItem) {
          // Nếu sản phẩm đã có, tăng số lượng
          set({
            items: state.items.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
            totalPrice: get().getTotalPrice(),
          });
        } else {
          // Thêm sản phẩm mới
          set({
            items: [...state.items, item],
            totalPrice: get().getTotalPrice(),
          });
        }
      },

      removeItem: (productId: string) => {
        set({
          items: get().items.filter((i) => i.productId !== productId),
          totalPrice: get().getTotalPrice(),
        });
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set({
          items: get().items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
          totalPrice: get().getTotalPrice(),
        });
      },

      clearCart: () => {
        set({ items: [], totalPrice: 0 });
      },

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
