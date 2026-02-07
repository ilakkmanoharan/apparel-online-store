import { NextRequest, NextResponse } from "next/server";
import { getUserCouponByCode } from "@/lib/userCoupons/firebase";
import { LOCALE_HEADER_NAME, isLocale } from "@/lib/i18n/config";
import { getLocaleFromRequest } from "@/lib/i18n/request";
import type { Locale } from "@/types/i18n";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: { code: string };
}

const COUPON_DETAIL_MESSAGES: Record<
  Locale,
  {
    userIdRequired: string;
    codeRequired: string;
    couponNotFound: string;
    failedLoadCoupon: string;
  }
> = {
  en: {
    userIdRequired: "userId is required",
    codeRequired: "Code is required",
    couponNotFound: "Coupon not found",
    failedLoadCoupon: "Failed to load coupon",
  },
  es: {
    userIdRequired: "userId es obligatorio",
    codeRequired: "Codigo obligatorio",
    couponNotFound: "Cupon no encontrado",
    failedLoadCoupon: "No se pudo cargar el cupon",
  },
  fr: {
    userIdRequired: "userId est requis",
    codeRequired: "Code requis",
    couponNotFound: "Coupon introuvable",
    failedLoadCoupon: "Echec du chargement du coupon",
  },
  de: {
    userIdRequired: "userId ist erforderlich",
    codeRequired: "Code erforderlich",
    couponNotFound: "Coupon nicht gefunden",
    failedLoadCoupon: "Coupon konnte nicht geladen werden",
  },
};

function resolveLocale(request: NextRequest): Locale {
  const queryLocale = request.nextUrl.searchParams.get("locale");
  if (queryLocale && isLocale(queryLocale)) {
    return queryLocale;
  }

  const headerLocale = request.headers.get(LOCALE_HEADER_NAME);
  if (headerLocale && isLocale(headerLocale)) {
    return headerLocale;
  }

  return getLocaleFromRequest(request);
}

/**
 * GET /api/user/coupons/[code]?userId=...
 * Returns the user's coupon for the given code, or 404.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const locale = resolveLocale(request);
  const messages = COUPON_DETAIL_MESSAGES[locale] ?? COUPON_DETAIL_MESSAGES.en;
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        { error: messages.userIdRequired },
        { status: 400 }
      );
    }

    const code = params.code;
    if (!code) {
      return NextResponse.json(
        { error: messages.codeRequired },
        { status: 400 }
      );
    }

    const coupon = await getUserCouponByCode(userId, code);
    if (!coupon) {
      return NextResponse.json({ error: messages.couponNotFound }, { status: 404 });
    }

    return NextResponse.json(coupon);
  } catch (err) {
    console.error("[api/user/coupons/[code] GET]", err);
    return NextResponse.json(
      { error: messages.failedLoadCoupon },
      { status: 500 }
    );
  }
}
