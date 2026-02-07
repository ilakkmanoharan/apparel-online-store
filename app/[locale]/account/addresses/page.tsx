"use client";

import { useEffect } from "react";
import AddressList from "@/components/account/AddressList";
import { useAuth } from "@/contexts/AuthContext";
import { useLocaleRouter } from "@/hooks/useLocaleRouter";
import { useTranslations } from "@/hooks/useTranslations";
import { useAddresses } from "@/hooks/useAddresses";

export default function AddressesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useLocaleRouter();
  const { addresses, loading } = useAddresses(user?.uid ?? null);
  const t = useTranslations("account.menu");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  if (!authLoading && !user) {
    return null;
  }

  if (authLoading) {
    return <div className="animate-pulse h-32 bg-gray-100 rounded" />;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{t("addresses")}</h1>
      <AddressList addresses={addresses} loading={loading} userId={user?.uid ?? null} />
    </div>
  );
}
