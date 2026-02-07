"use client";

import { use, useEffect, useState } from "react";
import LocaleLink from "@/components/common/LocaleLink";
import { useLocaleRouter } from "@/hooks/useLocaleRouter";
import { useTranslations } from "@/hooks/useTranslations";
import { getStoreByIdFromFirestore } from "@/lib/stores/firebase";
import type { StoreLocation } from "@/types/store";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function StoreDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useLocaleRouter();
  const t = useTranslations();
  const [store, setStore] = useState<StoreLocation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStoreByIdFromFirestore(id)
      .then((foundStore) => setStore(foundStore ?? null))
      .catch(() => setStore(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse h-64 bg-gray-100 rounded" />
      </div>
    );
  }

  if (!store) {
    router.push("/stores/locate");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <LocaleLink href="/stores/locate" className="text-blue-600 hover:underline mb-4 inline-block">
        {t("stores.allStores")}
      </LocaleLink>
      <h1 className="text-2xl font-bold mb-2">{store.name}</h1>
      <p className="text-gray-600">{store.address}</p>
      <p className="text-gray-600">{store.city}, {store.state} {store.zipCode}</p>
      {store.phone && <p className="text-gray-600 mt-2">{t("stores.phone")}: {store.phone}</p>}
      {store.hours?.length > 0 && (
        <div className="mt-4">
          <h2 className="font-semibold mb-2">{t("stores.hours")}</h2>
          <ul className="text-sm text-gray-600 space-y-1">
            {store.hours.map((hour, index) => (
              <li key={index}>{hour.day}: {hour.closed ? t("stores.closed") : `${hour.open} - ${hour.close}`}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
