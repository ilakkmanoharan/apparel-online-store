import { renderHook, act } from "@testing-library/react";
import { useWishlistStore } from "@/store/wishlistStore";
import type { Product } from "@/types";

const mockProduct: Product = {
  id: "prod-1",
  name: "Test",
  description: "",
  price: 10,
  images: [],
  category: "cat-1",
  sizes: [],
  colors: [],
  inStock: true,
  stockCount: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("wishlistStore", () => {
  it("adds and removes item", () => {
    const { result } = renderHook(() => useWishlistStore());
    act(() => result.current.add(mockProduct));
    expect(result.current.has("prod-1")).toBe(true);
    act(() => result.current.remove("prod-1"));
    expect(result.current.has("prod-1")).toBe(false);
  });
});
