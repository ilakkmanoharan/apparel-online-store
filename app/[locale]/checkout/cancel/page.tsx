"use client";

import { useLocaleRouter } from "@/hooks/useLocaleRouter";
import { useTranslations } from "@/hooks/useTranslations";

export default function CheckoutCancelPage() {
  const router = useLocaleRouter();
  const t = useTranslations();

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold mb-4">{t("checkout.cancelTitle")}</h1>
      <p className="text-gray-600 mb-6">{t("checkout.cancelDescription")}</p>
      <button
        onClick={() => router.push("/cart")}
        className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors mr-3"
      >
        {t("checkout.backToCart")}
      </button>
      <button
        onClick={() => router.push("/")}
        className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
      >
        {t("common.continueShopping")}
      </button>
    </div>
  );
}
