import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types";

interface WishlistStore {
  items: Product[];
  add: (product: Product) => void;
  remove: (productId: string) => void;
  toggle: (product: Product) => void;
  has: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      add: (product) =>
        set((state) =>
          state.items.some((p) => p.id === product.id)
            ? state
            : { items: [...state.items, product] }
        ),
      remove: (productId) =>
        set((state) => ({
          items: state.items.filter((p) => p.id !== productId),
        })),
      toggle: (product) => {
        const has = get().has(product.id);
        if (has) get().remove(product.id);
        else get().add(product);
      },
      has: (productId) => get().items.some((p) => p.id === productId),
    }),
    { name: "wishlist-storage" }
  )
);
