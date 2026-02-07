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
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden group h-full flex flex-col transition-shadow duration-300"
    >
      <LocaleLink href={`/products/${product.id}`}>
        <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden p-4">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-contain p-2 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">{t("common.noImage")}</div>
          )}
          {discount > 0 && (
            <span className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1.5 rounded-md text-sm font-semibold shadow-sm">-{discount}%</span>
          )}
          <button
            className="absolute top-4 right-4 p-2.5 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:shadow-lg"
            onClick={(e) => {
              e.preventDefault();
            }}
            aria-label={t("product.addToWishlist")}
          >
            <HeartIcon className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </LocaleLink>

      <div className="p-5 flex flex-col flex-grow border-t border-gray-100">
        <LocaleLink href={`/products/${product.id}`}>
          <h3 className="font-semibold text-gray-900 mb-2 hover:text-gray-600 transition-colors line-clamp-2 min-h-[3rem]">{product.name}</h3>
        </LocaleLink>
        <div className="flex items-center gap-2 mb-4 mt-auto">
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
          className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-2.5 rounded-lg hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
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
