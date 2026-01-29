"use client";

import { useState } from "react";
import type { Product } from "@/types";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import Checkbox from "@/components/common/Checkbox";

interface ProductFormProps {
  product?: Product | null;
  onSubmit: (data: Partial<Product> & { name: string; price: number; category: string }) => Promise<void>;
  onCancel: () => void;
}

const DEFAULT_CATEGORIES = ["women", "men", "kids", "sale"];

export default function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product?.price?.toString() ?? "0");
  const [originalPrice, setOriginalPrice] = useState(product?.originalPrice?.toString() ?? "");
  const [category, setCategory] = useState(product?.category ?? "women");
  const [subcategory, setSubcategory] = useState(product?.subcategory ?? "");
  const [sizes, setSizes] = useState(product?.sizes?.join(", ") ?? "S, M, L, XL");
  const [colors, setColors] = useState(product?.colors?.join(", ") ?? "Black, White");
  const [inStock, setInStock] = useState(product?.inStock ?? true);
  const [stockCount, setStockCount] = useState(product?.stockCount?.toString() ?? "0");
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [images, setImages] = useState(product?.images?.join("\n") ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const priceNum = parseFloat(price);
    const stockNum = parseInt(stockCount, 10);
    if (isNaN(priceNum) || priceNum < 0) {
      setError("Invalid price");
      return;
    }
    if (isNaN(stockNum) || stockNum < 0) {
      setError("Invalid stock count");
      return;
    }
    setLoading(true);
    try {
      await onSubmit({
        name,
        description,
        price: priceNum,
        originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
        category,
        subcategory: subcategory || undefined,
        sizes: sizes.split(",").map((s) => s.trim()).filter(Boolean),
        colors: colors.split(",").map((s) => s.trim()).filter(Boolean),
        inStock,
        stockCount: stockNum,
        featured,
        images: images.split("\n").map((s) => s.trim()).filter(Boolean),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Price" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
        <Input label="Original price (optional)" type="number" step="0.01" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          >
            {DEFAULT_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <Input label="Subcategory" value={subcategory} onChange={(e) => setSubcategory(e.target.value)} />
      </div>
      <Input label="Sizes (comma-separated)" value={sizes} onChange={(e) => setSizes(e.target.value)} />
      <Input label="Colors (comma-separated)" value={colors} onChange={(e) => setColors(e.target.value)} />
      <div className="grid grid-cols-2 gap-4">
        <Checkbox label="In stock" checked={inStock} onChange={(e) => setInStock(e.target.checked)} />
        <Input label="Stock count" type="number" value={stockCount} onChange={(e) => setStockCount(e.target.value)} />
      </div>
      <Checkbox label="Featured" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Image URLs (one per line)</label>
        <textarea
          value={images}
          onChange={(e) => setImages(e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 font-mono text-sm"
          placeholder="https://..."
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}
