"use client";

import { useState, useEffect } from "react";
import Button from "@/components/common/Button";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebase/config";

export interface NotificationPrefs {
  orderUpdates: boolean;
  promos: boolean;
  newArrivals: boolean;
}

const DEFAULT_PREFS: NotificationPrefs = {
  orderUpdates: true,
  promos: false,
  newArrivals: true,
};

interface NotificationPreferencesProps {
  initial?: NotificationPrefs | null;
  onSave?: (prefs: NotificationPrefs) => void;
}

export default function NotificationPreferences({
  initial,
  onSave,
}: NotificationPreferencesProps) {
  const [prefs, setPrefs] = useState<NotificationPrefs>(initial ?? DEFAULT_PREFS);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (initial) setPrefs(initial);
  }, [initial]);

  const { user } = useAuth();
  const update = (key: keyof NotificationPrefs, value: boolean) => {
    setPrefs((p) => ({ ...p, [key]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      const token = user ? await auth.currentUser?.getIdToken() : null;
      const res = await fetch("/api/user/notifications", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(prefs),
      });
      if (!res.ok) throw new Error("Failed to save");
      setSaved(true);
      onSave?.(prefs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="border rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4">Notification preferences</h2>
      <div className="space-y-3">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={prefs.orderUpdates}
            onChange={(e) => update("orderUpdates", e.target.checked)}
          />
          <span>Order updates (shipping, delivery)</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={prefs.promos}
            onChange={(e) => update("promos", e.target.checked)}
          />
          <span>Promotions and offers</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={prefs.newArrivals}
            onChange={(e) => update("newArrivals", e.target.checked)}
          />
          <span>New arrivals</span>
        </label>
      </div>
      <Button className="mt-4" onClick={handleSave} disabled={loading}>
        {loading ? "Saving…" : "Save preferences"}
      </Button>
      {saved && (
        <p className="text-sm text-green-600 mt-2">Preferences saved.</p>
      )}
    </section>
  );
}
