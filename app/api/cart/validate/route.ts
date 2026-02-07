import { NextRequest, NextResponse } from "next/server";
import { validateCart } from "@/lib/cart/validation";
import { LOCALE_HEADER_NAME, isLocale } from "@/lib/i18n/config";
import { getLocaleFromRequest } from "@/lib/i18n/request";
import type { CartItem } from "@/types";
import type { CartValidationResult } from "@/types/cart";
import type { Locale } from "@/types/i18n";

const CART_ERROR_TEMPLATES: Record<
  Locale,
  {
    maxQuantity: string;
    outOfStock: string;
    limitedStock: string;
    validationFailed: string;
  }
> = {
  en: {
    maxQuantity: "{name}: max quantity is {value}",
    outOfStock: "{name}: out of stock",
    limitedStock: "{name}: only {value} available",
    validationFailed: "Validation failed",
  },
  es: {
    maxQuantity: "{name}: la cantidad maxima es {value}",
    outOfStock: "{name}: sin stock",
    limitedStock: "{name}: solo hay {value} disponibles",
    validationFailed: "La validacion fallo",
  },
  fr: {
    maxQuantity: "{name}: la quantite maximale est de {value}",
    outOfStock: "{name}: en rupture de stock",
    limitedStock: "{name}: seulement {value} disponibles",
    validationFailed: "La validation a echoue",
  },
  de: {
    maxQuantity: "{name}: maximale Menge ist {value}",
    outOfStock: "{name}: nicht auf Lager",
    limitedStock: "{name}: nur {value} verfugbar",
    validationFailed: "Die Validierung ist fehlgeschlagen",
  },
};

function formatTemplate(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? `{${key}}`);
}

function localizeCartError(error: string, locale: Locale): string {
  const templates = CART_ERROR_TEMPLATES[locale] ?? CART_ERROR_TEMPLATES.en;

  const maxQuantity = error.match(/^(.+): max quantity is (\d+)$/);
  if (maxQuantity) {
    return formatTemplate(templates.maxQuantity, {
      name: maxQuantity[1],
      value: maxQuantity[2],
    });
  }

  const outOfStock = error.match(/^(.+): out of stock$/);
  if (outOfStock) {
    return formatTemplate(templates.outOfStock, {
      name: outOfStock[1],
    });
  }

  const limitedStock = error.match(/^(.+): only (\d+) available$/);
  if (limitedStock) {
    return formatTemplate(templates.limitedStock, {
      name: limitedStock[1],
      value: limitedStock[2],
    });
  }

  return error;
}

function localizeCartErrors(errors: string[], locale: Locale): string[] {
  return errors.map((error) => localizeCartError(error, locale));
}

function getBodyLocale(body: unknown): Locale | null {
  if (!body || typeof body !== "object") return null;
  const localeValue = (body as { locale?: unknown }).locale;
  if (typeof localeValue !== "string") return null;
  return isLocale(localeValue) ? localeValue : null;
}

function resolveLocale(request: NextRequest, body: unknown): Locale {
  const bodyLocale = getBodyLocale(body);
  if (bodyLocale) {
    return bodyLocale;
  }

  const headerLocale = request.headers.get(LOCALE_HEADER_NAME);
  if (headerLocale && isLocale(headerLocale)) {
    return headerLocale;
  }

  return getLocaleFromRequest(request);
}

function parseItems(body: unknown): CartItem[] {
  if (!body || typeof body !== "object" || !Array.isArray((body as { items?: unknown }).items)) {
    return [];
  }
  const raw = (body as { items: unknown[] }).items;
  return raw.map((item: unknown) => {
    if (!item || typeof item !== "object") return null;
    const o = item as Record<string, unknown>;
    const product = o.product as Record<string, unknown> | undefined;
    if (!product) return null;
    return {
      product: {
        id: String(product.id ?? ""),
        name: String(product.name ?? ""),
        description: String(product.description ?? ""),
        price: Number(product.price) ?? 0,
        originalPrice: product.originalPrice != null ? Number(product.originalPrice) : undefined,
        images: Array.isArray(product.images) ? product.images as string[] : [],
        category: String(product.category ?? ""),
        subcategory: product.subcategory != null ? String(product.subcategory) : undefined,
        sizes: Array.isArray(product.sizes) ? product.sizes as string[] : [],
        colors: Array.isArray(product.colors) ? product.colors as string[] : [],
        inStock: Boolean(product.inStock),
        stockCount: Number(product.stockCount) ?? 0,
        rating: product.rating != null ? Number(product.rating) : undefined,
        reviewCount: product.reviewCount != null ? Number(product.reviewCount) : undefined,
        featured: Boolean(product.featured),
        createdAt: product.createdAt ? new Date(product.createdAt as string) : new Date(),
        updatedAt: product.updatedAt ? new Date(product.updatedAt as string) : new Date(),
      },
      quantity: Number(o.quantity) ?? 1,
      selectedSize: String(o.selectedSize ?? ""),
      selectedColor: String(o.selectedColor ?? ""),
    } as CartItem;
  }).filter(Boolean) as CartItem[];
}

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  let locale: Locale = getLocaleFromRequest(request);
  try {
    const body = await request.json();
    locale = resolveLocale(request, body);
    const items = parseItems(body);
    const result: CartValidationResult = validateCart(items);
    const localizedResult: CartValidationResult = {
      ...result,
      errors: localizeCartErrors(result.errors, locale),
    };
    return NextResponse.json(localizedResult);
  } catch (err) {
    console.error("[api/cart/validate]", err);
    const validationFailed =
      CART_ERROR_TEMPLATES[locale]?.validationFailed ?? CART_ERROR_TEMPLATES.en.validationFailed;
    return NextResponse.json(
      { valid: false, items: [], errors: [validationFailed] },
      { status: 500 }
    );
  }
}
