import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useNotificationStore } from "./notificationStore";

export interface CartProduct {
  id: number;
  name: string;
  price: number;
  images: string[];
  slug: string;
  stock: number;
}

export interface CartItem {
  product: CartProduct;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: CartProduct, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotal: () => number;
  getCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity = 1) => {
        const currentCount = get().getCount();
        
        if (currentCount + quantity > 2) {
          useNotificationStore.getState().showNotification(`You can only have a maximum of 2 items in your cart to maintain exclusivity.`, "error");
          return;
        }

        set((state) => {
          const existing = state.items.find((i) => i.product.id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, { product, quantity }] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({ items: state.items.filter((i) => i.product.id !== productId) }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        const currentItems = get().items;
        const otherItemsCount = currentItems
          .filter(i => i.product.id !== productId)
          .reduce((sum, i) => sum + i.quantity, 0);

        if (otherItemsCount + quantity > 2) {
          useNotificationStore.getState().showNotification("Exceeded maximum cart limit: 2 items per order.", "error");
          return;
        }

        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      getTotal: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
      getCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "shopnest-cart" }
  )
);
