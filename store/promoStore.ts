import { create } from "zustand";

interface PromoState {
  code: string | null;
  discountPercent: number;
  setPromo: (code: string | null, discountPercent?: number) => void;
  clearPromo: () => void;
  applyDiscount: (subtotal: number) => number;
}

export const usePromoStore = create<PromoState>((set, get) => ({
  code: null,
  discountPercent: 0,
  setPromo: (code, discountPercent = 0) =>
    set({ code, discountPercent }),
  clearPromo: () => set({ code: null, discountPercent: 0 }),
  applyDiscount: (subtotal) => {
    const { discountPercent } = get();
    if (discountPercent <= 0) return subtotal;
    return Math.max(0, subtotal * (1 - discountPercent / 100));
  },
}));
