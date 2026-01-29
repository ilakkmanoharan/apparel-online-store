"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserCoupons } from "@/lib/userCoupons/firebase";
import UserCouponList from "@/components/account/UserCouponList";
import type { UserCoupon } from "@/types/userCoupon";

export default function AccountCouponsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [coupons, setCoupons] = useState<UserCoupon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user?.uid) return;
    getUserCoupons(user.uid).then(setCoupons).finally(() => setLoading(false));
  }, [user?.uid]);

  if (!authLoading && !user) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My coupons</h1>
      <UserCouponList coupons={coupons} loading={loading} />
    </div>
  );
}
