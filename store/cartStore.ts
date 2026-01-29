import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product } from "@/types";

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, size: string, color: string) => void;
  removeItem: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  /**
   * Add a pre-normalized cart item (e.g. from a past order) back into the cart.
   */
  addItemFromOrder: (item: CartItem) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

  addItem: (product, size, color) => {
    const items = get().items;
    const existingItem = items.find(
      (item) =>
        item.product.id === product.id &&
        item.selectedSize === size &&
        item.selectedColor === color
    );

    if (existingItem) {
      set({
        items: items.map((item) =>
          item === existingItem
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      });
    } else {
      set({
        items: [...items, { product, quantity: 1, selectedSize: size, selectedColor: color }],
      });
    }
  },

  removeItem: (productId, size, color) => {
    set({
      items: get().items.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedSize === size &&
            item.selectedColor === color
          )
      ),
    });
  },

  updateQuantity: (productId, size, color, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId, size, color);
      return;
    }

    set({
      items: get().items.map((item) =>
        item.product.id === productId &&
        item.selectedSize === size &&
        item.selectedColor === color
          ? { ...item, quantity }
          : item
      ),
    });
  },

  clearCart: () => {
    set({ items: [] });
  },

  getTotal: () => {
    return get().items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  },

  getItemCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0);
  },
  addItemFromOrder: (orderItem) => {
    const items = get().items;
    const existingItem = items.find(
      (item) =>
        item.product.id === orderItem.product.id &&
        item.selectedSize === orderItem.selectedSize &&
        item.selectedColor === orderItem.selectedColor
    );

    if (existingItem) {
      set({
        items: items.map((item) =>
          item === existingItem
            ? { ...item, quantity: item.quantity + orderItem.quantity }
            : item
        ),
      });
    } else {
      set({ items: [...items, orderItem] });
    }
  },
    }),
    {
      name: "cart-storage",
    }
  )
);
