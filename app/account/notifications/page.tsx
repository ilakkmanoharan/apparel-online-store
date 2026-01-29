"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useEffect } from "react";
import NotificationPreferences from "@/components/account/NotificationPreferences";
import { useNotifications } from "@/hooks/useNotifications";

export default function AccountNotificationsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { prefs, loading } = useNotifications(user?.uid);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [authLoading, user, router]);

  if (authLoading || !user) return <div className="animate-pulse h-64 bg-gray-100 rounded" />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Notification preferences</h1>
      {loading ? (
        <div className="animate-pulse h-48 bg-gray-100 rounded" />
      ) : (
        <NotificationPreferences initial={prefs} />
      )}
    </div>
  );
}
