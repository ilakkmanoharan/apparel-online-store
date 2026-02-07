"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useLocaleRouter } from "@/hooks/useLocaleRouter";
import { useEffect, useState } from "react";
import { getUserSpend } from "@/lib/firebase/userSpend";
import { getTierBySpend } from "@/lib/loyalty/spend";
import SpendProgress from "@/components/loyalty/SpendProgress";
import PlatinumBenefits from "@/components/loyalty/PlatinumBenefits";
import type { UserSpend as UserSpendType } from "@/types/loyalty";

export default function AccountRewardsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useLocaleRouter();
  const [userSpend, setUserSpend] = useState<UserSpendType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user?.uid) return;
    getUserSpend(user.uid).then(setUserSpend).finally(() => setLoading(false));
  }, [user?.uid]);

  if (!authLoading && !user) return null;
  if (authLoading || loading) return <div className="animate-pulse h-32 bg-gray-200 rounded" />;

  const spend = userSpend?.lifetimeSpend ?? 0;
  const tier = getTierBySpend(spend);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Rewards & tier</h1>
      <SpendProgress lifetimeSpend={spend} />
      <PlatinumBenefits tier={tier} />
      <p className="text-sm text-gray-500">
        Spend more to unlock Gold and Platinum benefits, including free shipping on all orders.
      </p>
    </div>
  );
}
