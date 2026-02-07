"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import LocaleLink from "@/components/common/LocaleLink";
import { useI18n } from "@/components/common/I18nProvider";
import { useTranslations } from "@/hooks/useTranslations";
import { getCurrencyForLocale } from "@/lib/currency/config";
import { formatPrice } from "@/lib/currency/format";
import { useCartStore } from "@/store/cartStore";
import { Product } from "@/types";

interface ProductListViewProps {
  products: Product[];
}

export default function ProductListView({ products }: ProductListViewProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [addingId, setAddingId] = useState<string | null>(null);
  const { locale } = useI18n();
  const t = useTranslations();
  const currency = getCurrencyForLocale(locale);

  const handleAddToCart = (product: Product) => {
    if (!product.inStock) {
      return;
    }

    setAddingId(product.id);
    const size = product.sizes[0] || "One Size";
    const color = product.colors[0] || "Default";
    addItem(product, size, color);
    setTimeout(() => setAddingId(null), 500);
  };

  return (
    <ul className="divide-y divide-gray-200">
      {products.map((product) => (
        <li key={product.id} className="py-6 flex gap-6">
          <LocaleLink href={`/products/${product.id}`} className="flex-shrink-0 w-32 aspect-square bg-gray-100 rounded-lg overflow-hidden">
            {product.images[0] ? (
              <Image src={product.images[0]} alt={product.name} width={128} height={128} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">{t("common.noImage")}</div>
            )}
          </LocaleLink>
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <LocaleLink href={`/products/${product.id}`}>
              <h3 className="font-semibold text-gray-900 hover:text-gray-600">{product.name}</h3>
            </LocaleLink>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
            <div className="mt-2 flex items-center gap-3">
              <span className="text-lg font-bold text-gray-900">{formatPrice(product.price, currency, locale)}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.originalPrice, currency, locale)}
                </span>
              )}
              {product.rating != null && <span className="text-sm text-gray-500">★ {product.rating.toFixed(1)}</span>}
            </div>
          </div>
          <div className="flex-shrink-0 flex items-center">
            <button
              onClick={() => handleAddToCart(product)}
              disabled={!product.inStock || addingId === product.id}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingBagIcon className="w-5 h-5" />
              {addingId === product.id ? t("cart.added") : product.inStock ? t("common.addToCart") : t("product.outOfStock")}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
