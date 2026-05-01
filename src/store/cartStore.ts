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

export interface CartVariant {
  id: number;
  size: string;
  color?: string | null;
  price?: number | null;
  images?: string[] | null;
}

export interface CartItem {
  product: CartProduct;
  variant?: CartVariant;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: CartProduct, quantity?: number, variant?: CartVariant) => void;
  removeItem: (productId: number, variantId?: number) => void;
  updateQuantity: (productId: number, variantId: number | undefined, quantity: number) => void;
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

      addItem: (product, quantity = 1, variant) => {
        set((state) => {
          const existing = state.items.find((i) => 
            i.product.id === product.id && i.variant?.id === variant?.id
          );
          
          const currentItemQuantity = existing ? existing.quantity : 0;
          if (currentItemQuantity + quantity > 10) {
            useNotificationStore.getState().showNotification(`You can only purchase a maximum of 10 units of this product.`, "error");
            return state;
          }

          if (existing) {
            return {
              items: state.items.map((i) =>
                (i.product.id === product.id && i.variant?.id === variant?.id)
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, { product, quantity, variant }] };
        });
      },

      removeItem: (productId, variantId) => {
        set((state) => ({ 
          items: state.items.filter((i) => 
            !(i.product.id === productId && i.variant?.id === variantId)
          ) 
        }));
      },

      updateQuantity: (productId, variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId);
          return;
        }

        if (quantity > 10) {
          useNotificationStore.getState().showNotification("You can only purchase a maximum of 10 units of this product.", "error");
          return;
        }

        set((state) => ({
          items: state.items.map((i) =>
            (i.product.id === productId && i.variant?.id === variantId) ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      getTotal: () => get().items.reduce((sum, i) => { 
        const variantPrice = i.variant?.price;
        const price = (variantPrice !== null && variantPrice !== undefined) ? Number(variantPrice) : i.product.price;
        return sum + price * i.quantity; 
      }, 0),
      getCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "aionluxury-cart" }
  )
);
