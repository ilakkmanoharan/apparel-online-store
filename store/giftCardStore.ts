import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GiftCardEntry {
  code: string;
  balance: number;
  currency: string;
  appliedAt: number;
}

interface GiftCardState {
  appliedCards: GiftCardEntry[];
  addApplied: (code: string, balance: number, currency?: string) => void;
  removeApplied: (code: string) => void;
  clearApplied: () => void;
  getTotalApplied: () => number;
}

export const useGiftCardStore = create<GiftCardState>()(
  persist(
    (set, get) => ({
      appliedCards: [],
      addApplied: (code, balance, currency = "USD") => {
        const normalized = code.trim().replace(/\s/g, "").toUpperCase();
        set((state) => ({
          appliedCards: [
            ...state.appliedCards.filter((c) => c.code !== normalized),
            { code: normalized, balance, currency, appliedAt: Date.now() },
          ],
        }));
      },
      removeApplied: (code) => {
        const normalized = code.trim().replace(/\s/g, "").toUpperCase();
        set((state) => ({
          appliedCards: state.appliedCards.filter((c) => c.code !== normalized),
        }));
      },
      clearApplied: () => set({ appliedCards: [] }),
      getTotalApplied: () => get().appliedCards.reduce((sum, c) => sum + c.balance, 0),
    }),
    { name: "gift-cards-applied" }
  )
);
