"use client";

import { useEffect, useMemo, useState } from "react";
import Spinner from "@/components/common/Spinner";
import StoreFilters from "@/components/stores/StoreFilters";
import StoreList from "@/components/stores/StoreList";
import StoreMap from "@/components/stores/StoreMap";
import { useTranslations } from "@/hooks/useTranslations";
import { getStoresFromFirestore } from "@/lib/stores/firebase";
import type { StoreLocation } from "@/types/store";

export default function StoreLocatePage() {
  const [stores, setStores] = useState<StoreLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<{ city?: string; state?: string; pickupOnly?: boolean }>({});
  const t = useTranslations();

  useEffect(() => {
    getStoresFromFirestore(true)
      .then(setStores)
      .catch(() => setStores([]))
      .finally(() => setLoading(false));
  }, []);

  const filteredStores = useMemo(() => {
    let list = [...stores];

    if (filters.city) {
      list = list.filter((store) => store.city === filters.city);
    }

    if (filters.state) {
      list = list.filter((store) => store.state === filters.state);
    }

    if (filters.pickupOnly) {
      list = list.filter((store) => store.services?.includes("pickup"));
    }

    return list;
  }, [stores, filters]);

  const cities = useMemo(() => [...new Set(stores.map((store) => store.city).filter(Boolean))].sort(), [stores]);
  const states = useMemo(() => [...new Set(stores.map((store) => store.state).filter(Boolean))].sort(), [stores]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t("stores.locate")}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1">
          <StoreFilters cities={cities} states={states} onFilter={setFilters} />
        </aside>
        <div className="lg:col-span-3 space-y-6">
          <StoreMap stores={filteredStores} />
          <StoreList stores={filteredStores} />
        </div>
      </div>
    </div>
  );
}
