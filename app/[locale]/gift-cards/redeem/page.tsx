"use client";

import RedeemForm from "@/components/giftcard/RedeemForm";
import { useTranslations } from "@/hooks/useTranslations";

export default function GiftCardRedeemPage() {
  const t = useTranslations();

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-2xl font-bold mb-4">{t("giftCard.redeemTitle")}</h1>
      <RedeemForm />
    </div>
  );
}
