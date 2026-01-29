"use client";

import { useEffect, useState } from "react";
import Button from "@/components/common/Button";
import { useAuth } from "@/contexts/AuthContext";
import { getUserPreferences, updateUserPreferences } from "@/lib/firebase/userPreferences";

interface EmailPrefsState {
  marketingEmails: boolean;
  promos: boolean;
  newArrivals: boolean;
}

const DEFAULT: EmailPrefsState = {
  marketingEmails: false,
  promos: false,
  newArrivals: true,
};

export default function EmailPreferences() {
  const { user } = useAuth();
  const [prefs, setPrefs] = useState<EmailPrefsState>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const existing = await getUserPreferences(user.uid);
        if (!cancelled && existing) {
          setPrefs({
            marketingEmails: existing.marketingEmails ?? DEFAULT.marketingEmails,
            promos: existing.promos ?? DEFAULT.promos,
            newArrivals: existing.newArrivals ?? DEFAULT.newArrivals,
          });
        }
      } catch (e) {
        console.error("[EmailPreferences] load", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.uid]);

  const update = (key: keyof EmailPrefsState, value: boolean) => {
    setPrefs((p) => ({ ...p, [key]: value }));
  };

  const handleSave = async () => {
    if (!user?.uid) return;
    setSaving(true);
    setSaved(false);
    try {
      await updateUserPreferences(user.uid, {
        marketingEmails: prefs.marketingEmails,
        promos: prefs.promos,
        newArrivals: prefs.newArrivals,
      } as any);
      setSaved(true);
    } catch (e) {
      console.error("[EmailPreferences] save", e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="h-32 animate-pulse rounded bg-gray-100" />;
  }

  return (
    <section className="space-y-4 border rounded-lg p-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Email preferences</h2>
        <p className="text-sm text-gray-600">
          Choose which types of marketing and product emails you want to receive.
        </p>
      </div>
      <div className="space-y-3">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={prefs.marketingEmails}
            onChange={(e) => update("marketingEmails", e.target.checked)}
          />
          <span>General marketing emails</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={prefs.promos}
            onChange={(e) => update("promos", e.target.checked)}
          />
          <span>Exclusive promotions and coupons</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={prefs.newArrivals}
            onChange={(e) => update("newArrivals", e.target.checked)}
          />
          <span>New arrivals and curated picks</span>
        </label>
      </div>
      <Button onClick={handleSave} disabled={saving}>
        {saving ? "Saving…" : "Save email preferences"}
      </Button>
      {saved && (
        <p className="text-sm text-green-600 mt-1">Preferences saved.</p>
      )}
    </section>
  );
}

