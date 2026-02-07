"use client";

import { useEffect } from "react";
import NotificationPreferences from "@/components/account/NotificationPreferences";
import { useAuth } from "@/contexts/AuthContext";
import { useLocaleRouter } from "@/hooks/useLocaleRouter";
import { useNotifications } from "@/hooks/useNotifications";
import { useTranslations } from "@/hooks/useTranslations";

export default function AccountNotificationsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useLocaleRouter();
  const { prefs, loading } = useNotifications(user?.uid);
  const t = useTranslations();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  if (authLoading || !user) {
    return <div className="animate-pulse h-64 bg-gray-100 rounded" />;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{t("account.notifications")}</h1>
      {loading ? (
        <div className="animate-pulse h-48 bg-gray-100 rounded" />
      ) : (
        <NotificationPreferences initial={prefs} />
      )}
    </div>
  );
}
