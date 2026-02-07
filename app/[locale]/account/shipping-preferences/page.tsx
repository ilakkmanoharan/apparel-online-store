"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useLocaleRouter } from "@/hooks/useLocaleRouter";
import { useEffect, useState } from "react";
import { getUserPreferences, setShippingPreference } from "@/lib/firebase/userPreferences";
import ShippingPreferenceForm from "@/components/account/ShippingPreferenceForm";
import type { ShippingHabit } from "@/types/userPreferences";
import Button from "@/components/common/Button";

export default function AccountShippingPreferencesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useLocaleRouter();
  const [shippingHabit, setShippingHabit] = useState<ShippingHabit>("none");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user?.uid) return;
    getUserPreferences(user.uid).then((prefs) => {
      if (prefs) setShippingHabit(prefs.shippingHabit);
      setLoading(false);
    });
  }, [user?.uid]);

  const handleSave = async () => {
    if (!user?.uid) return;
    setSaving(true);
    try {
      await setShippingPreference(user.uid, shippingHabit);
    } finally {
      setSaving(false);
    }
  };

  if (!authLoading && !user) return null;
  if (authLoading || loading) return <div className="animate-pulse h-32 bg-gray-200 rounded" />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Shipping preferences</h1>
      <ShippingPreferenceForm value={shippingHabit} onChange={setShippingHabit} />
      <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
    </div>
  );
}
