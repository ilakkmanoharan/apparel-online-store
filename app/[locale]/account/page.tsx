"use client";

import { useEffect } from "react";
import LocaleLink from "@/components/common/LocaleLink";
import Button from "@/components/common/Button";
import { useAuth } from "@/contexts/AuthContext";
import { useLocaleRouter } from "@/hooks/useLocaleRouter";
import { useTranslations } from "@/hooks/useTranslations";

export default function AccountPage() {
  const { user, loading } = useAuth();
  const router = useLocaleRouter();
  const t = useTranslations();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div className="animate-pulse h-32 bg-gray-100 rounded" />;
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{t("account.myAccount")}</h1>
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <p className="text-sm text-gray-500">{t("auth.email")}</p>
          <p className="font-medium text-gray-900">{user.email}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">{t("account.name")}</p>
          <p className="font-medium text-gray-900">{user.displayName || "-"}</p>
        </div>
        <LocaleLink href="/account/profile">
          <Button variant="outline">{t("account.editProfile")}</Button>
        </LocaleLink>
      </div>
    </div>
  );
}
