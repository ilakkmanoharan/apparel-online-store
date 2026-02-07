"use client";

import { useEffect, useState } from "react";
import UserCouponList from "@/components/account/UserCouponList";
import { useAuth } from "@/contexts/AuthContext";
import { useLocaleRouter } from "@/hooks/useLocaleRouter";
import { useTranslations } from "@/hooks/useTranslations";
import { getUserCoupons } from "@/lib/userCoupons/firebase";
import type { UserCoupon } from "@/types/userCoupon";

export default function AccountCouponsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useLocaleRouter();
  const [coupons, setCoupons] = useState<UserCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations("account.menu");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user?.uid) {
      return;
    }

    getUserCoupons(user.uid).then(setCoupons).finally(() => setLoading(false));
  }, [user?.uid]);

  if (!authLoading && !user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{t("coupons")}</h1>
      <UserCouponList coupons={coupons} loading={loading} />
    </div>
  );
}
