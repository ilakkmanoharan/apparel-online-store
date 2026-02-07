"use client";

import { useEffect } from "react";
import ManagePaymentMethods from "@/components/account/ManagePaymentMethods";
import ChangePasswordForm from "@/components/account/ChangePasswordForm";
import DeleteAccountSection from "@/components/account/DeleteAccountSection";
import { useAuth } from "@/contexts/AuthContext";
import { useLocaleRouter } from "@/hooks/useLocaleRouter";
import { useTranslations } from "@/hooks/useTranslations";

export default function AccountSecurityPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useLocaleRouter();
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
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">{t("account.securityBilling")}</h1>
      <ManagePaymentMethods />
      <ChangePasswordForm />
      <DeleteAccountSection />
    </div>
  );
}
