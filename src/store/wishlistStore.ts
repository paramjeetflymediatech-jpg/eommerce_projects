import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistItem {
  id: string | number;
  name: string;
  price: number;
  images: string[];
  slug: string;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (product: WishlistItem) => void;
  removeItem: (productId: string | number) => void;
  isWishlisted: (productId: string | number) => boolean;
  toggleItem: (product: WishlistItem) => void;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        set((state) => {
          if (state.items.some((i) => i.id === product.id)) return state;
          return { items: [...state.items, product] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({ items: state.items.filter((i) => i.id !== productId) }));
      },

      isWishlisted: (productId) => get().items.some((i) => i.id === productId),

      toggleItem: (product) => {
        if (get().isWishlisted(product.id)) {
          get().removeItem(product.id);
        } else {
          get().addItem(product);
        }
      },

      clearWishlist: () => set({ items: [] }),
    }),
    { name: "aionluxury-wishlist" }
  )
);
