"use client";

import { useEffect, useState } from "react";
import ReturnList from "@/components/account/ReturnList";
import { useAuth } from "@/contexts/AuthContext";
import { useLocaleRouter } from "@/hooks/useLocaleRouter";
import { useTranslations } from "@/hooks/useTranslations";
import { getReturnsByUser } from "@/lib/returns/firebase";
import type { ReturnRequest } from "@/types/returns";

export default function ReturnsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useLocaleRouter();
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations("account.menu");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user?.uid) {
      return;
    }

    getReturnsByUser(user.uid).then(setReturns).finally(() => setLoading(false));
  }, [user?.uid]);

  if (!authLoading && !user) {
    return null;
  }

  if (authLoading || loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 bg-gray-200 rounded" />
        <div className="h-32 bg-gray-200 rounded" />
        <div className="h-32 bg-gray-200 rounded" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{t("returns")}</h1>
      <ReturnList returns={returns} />
    </div>
  );
}
