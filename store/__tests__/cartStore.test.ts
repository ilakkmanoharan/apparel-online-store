import { useCartStore } from "@/store/cartStore";
import type { Product } from "@/types";

const mockProduct: Product = {
  id: "p1",
  name: "Test Product",
  description: "Desc",
  price: 29.99,
  images: [],
  category: "women",
  sizes: ["S", "M", "L"],
  colors: ["Black"],
  inStock: true,
  stockCount: 10,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("cartStore", () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it("adds item to cart", () => {
    const { addItem, items, getItemCount } = useCartStore.getState();
    addItem(mockProduct, 1, "M", "Black");
    expect(items.length).toBe(1);
    expect(getItemCount()).toBe(1);
  });

  it("updates quantity", () => {
    const { addItem, updateQuantity, items } = useCartStore.getState();
    addItem(mockProduct, 1, "M", "Black");
    updateQuantity(mockProduct.id, "M", "Black", 3);
    expect(items[0].quantity).toBe(3);
  });

  it("removes item", () => {
    const { addItem, removeItem, items } = useCartStore.getState();
    addItem(mockProduct, 1, "M", "Black");
    removeItem(mockProduct.id, "M", "Black");
    expect(items.length).toBe(0);
  });

  it("getTotal sums item totals", () => {
    const { addItem, getTotal } = useCartStore.getState();
    addItem(mockProduct, 2, "M", "Black");
    expect(getTotal()).toBeCloseTo(29.99 * 2);
  });

  it("clearCart empties cart", () => {
    const { addItem, clearCart, items } = useCartStore.getState();
    addItem(mockProduct, 1, "M", "Black");
    clearCart();
    expect(items.length).toBe(0);
  });
});
