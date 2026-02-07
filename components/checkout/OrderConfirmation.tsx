"use client";

import LocaleLink from "@/components/common/LocaleLink";
import Button from "@/components/common/Button";
import { useTranslations } from "@/hooks/useTranslations";

interface OrderConfirmationProps {
  orderId?: string;
  sessionId?: string;
}

export default function OrderConfirmation({
  orderId,
  sessionId,
}: OrderConfirmationProps) {
  const t = useTranslations();

  return (
    <div className="text-center py-12">
      <h1 className="text-3xl font-bold mb-4">{t("checkout.successTitle")}</h1>
      <p className="text-gray-600 mb-6">{t("checkout.successDescription")}</p>
      {orderId && <p className="text-sm text-gray-500 mb-2">{t("checkout.orderId", { orderId })}</p>}
      {sessionId && <p className="text-sm text-gray-500 mb-6">{t("checkout.sessionId", { sessionId })}</p>}
      <div className="flex flex-wrap justify-center gap-4">
        <LocaleLink href="/account/orders">
          <Button>{t("account.orders")}</Button>
        </LocaleLink>
        <LocaleLink href="/">
          <Button variant="outline">{t("common.continueShopping")}</Button>
        </LocaleLink>
      </div>
    </div>
  );
}
