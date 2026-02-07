"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { HeartIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import LocaleLink from "@/components/common/LocaleLink";
import { useI18n } from "@/components/common/I18nProvider";
import { getCurrencyForLocale } from "@/lib/currency/config";
import { formatPrice } from "@/lib/currency/format";
import { useTranslations } from "@/hooks/useTranslations";
import { useCartStore } from "@/store/cartStore";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [adding, setAdding] = useState(false);
  const { locale } = useI18n();
  const t = useTranslations();
  const currency = getCurrencyForLocale(locale);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();

    if (!product.inStock) {
      return;
    }

    setAdding(true);
    const size = product.sizes[0] || "One Size";
    const color = product.colors[0] || "Default";
    addItem(product, size, color);

    setTimeout(() => setAdding(false), 500);
  };

  return (
    <motion.div whileHover={{ y: -4 }} className="bg-white rounded-lg shadow-md overflow-hidden group">
      <LocaleLink href={`/products/${product.id}`}>
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">{t("common.noImage")}</div>
          )}
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">-{discount}%</span>
          )}
          <button
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.preventDefault();
            }}
            aria-label={t("product.addToWishlist")}
          >
            <HeartIcon className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </LocaleLink>

      <div className="p-4">
        <LocaleLink href={`/products/${product.id}`}>
          <h3 className="font-semibold text-gray-900 mb-2 hover:text-gray-600 transition-colors">{product.name}</h3>
        </LocaleLink>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(product.price, currency, locale)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.originalPrice, currency, locale)}
            </span>
          )}
        </div>
        <button
          className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleAddToCart}
          disabled={!product.inStock || adding}
        >
          <ShoppingBagIcon className="w-5 h-5" />
          {adding ? t("cart.added") : product.inStock ? t("common.addToCart") : t("product.outOfStock")}
        </button>
      </div>
    </motion.div>
  );
}
