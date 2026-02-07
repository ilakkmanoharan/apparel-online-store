"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingBagIcon, HeartIcon } from "@heroicons/react/24/outline";
import { useI18n } from "@/components/common/I18nProvider";
import { getCurrencyForLocale } from "@/lib/currency/config";
import { formatPrice } from "@/lib/currency/format";
import RecommendedProducts from "@/components/products/RecommendedProducts";
import { useTranslations } from "@/hooks/useTranslations";
import { useCartStore } from "@/store/cartStore";
import { Product } from "@/types";

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "");
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || "");
  const [adding, setAdding] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const { locale } = useI18n();
  const t = useTranslations();
  const currency = getCurrencyForLocale(locale);

  const handleAddToCart = () => {
    if (!product.inStock || !selectedSize || !selectedColor) {
      return;
    }

    setAdding(true);
    addItem(product, selectedSize, selectedColor);
    setTimeout(() => setAdding(false), 500);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 relative">
          {product.images[selectedImage] ? (
            <Image src={product.images[selectedImage]} alt={product.name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">{t("common.noImage")}</div>
          )}
        </div>
        {product.images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square rounded-lg overflow-hidden border-2 ${selectedImage === index ? "border-gray-900" : "border-transparent"}`}
              >
                <Image src={image} alt={`${product.name} ${index + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
        <div className="flex items-center gap-4 mb-6">
          <span className="text-3xl font-bold">
            {formatPrice(product.price, currency, locale)}
          </span>
          {product.originalPrice && (
            <span className="text-xl text-gray-500 line-through">
              {formatPrice(product.originalPrice, currency, locale)}
            </span>
          )}
        </div>

        <p className="text-gray-700 mb-6">{product.description}</p>

        {product.sizes.length > 0 && (
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">{t("product.size")}</label>
            <div className="flex gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border rounded-lg ${selectedSize === size ? "border-gray-900 bg-gray-900 text-white" : "border-gray-300 hover:border-gray-900"}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {product.colors.length > 0 && (
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">{t("product.color")}</label>
            <div className="flex gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 border rounded-lg ${selectedColor === color ? "border-gray-900 bg-gray-900 text-white" : "border-gray-300 hover:border-gray-900"}`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-4 mb-6">
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock || !selectedSize || !selectedColor || adding}
            className="flex-1 flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <ShoppingBagIcon className="w-5 h-5" />
            {adding ? t("cart.added") : product.inStock ? t("common.addToCart") : t("product.outOfStock")}
          </button>
          <button className="p-3 border border-gray-300 rounded-lg hover:border-gray-900 transition-colors" aria-label={t("product.addToWishlist")}>
            <HeartIcon className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-gray-600">
          {product.inStock ? t("product.inStockCount", { count: product.stockCount ?? 0 }) : t("product.outOfStock")}
        </p>
      </div>

      <div className="md:col-span-2 mt-8">
        <RecommendedProducts productId={product.id} />
      </div>
    </div>
  );
}
