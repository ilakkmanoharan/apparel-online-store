"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserSpend } from "@/lib/firebase/userSpend";
import { getTierBySpend, getNextTierSpend } from "@/lib/loyalty/spend";
import { SPEND_TIERS } from "@/lib/loyalty/constants";
import TierBadge from "@/components/loyalty/TierBadge";
import PlatinumBenefits from "@/components/loyalty/PlatinumBenefits";

export default function AccountTierPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [lifetimeSpend, setLifetimeSpend] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user?.uid) return;
    getUserSpend(user.uid).then((s) => setLifetimeSpend(s?.lifetimeSpend ?? 0)).finally(() => setLoading(false));
  }, [user?.uid]);

  if (!authLoading && !user) return null;
  if (authLoading || loading) return <div className="animate-pulse h-32 bg-gray-200 rounded" />;

  const tier = getTierBySpend(lifetimeSpend);
  const next = getNextTierSpend(lifetimeSpend);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Your tier</h1>
      <div className="flex items-center gap-4">
        <TierBadge tierId={tier.id} />
        <span className="text-gray-600">Lifetime spend: ${lifetimeSpend.toFixed(0)}</span>
      </div>
      <PlatinumBenefits tier={tier} />
      {next && (
        <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
          <h2 className="font-semibold text-gray-900 mb-2">Next: {next.tier.name}</h2>
          <p className="text-sm text-gray-600">
            Spend ${next.spendNeeded.toFixed(0)} more to unlock {next.tier.name} benefits.
          </p>
        </div>
      )}
      <div>
        <h2 className="font-semibold text-gray-900 mb-2">All tiers</h2>
        <ul className="space-y-3">
          {SPEND_TIERS.map((t) => (
            <li key={t.id} className="flex items-center gap-3">
              <TierBadge tierId={t.id} />
              <span className="text-sm text-gray-600">${t.minSpend}+ · {t.benefits.join(", ")}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
