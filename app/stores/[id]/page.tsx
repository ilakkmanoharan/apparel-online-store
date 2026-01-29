"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStoreByIdFromFirestore } from "@/lib/stores/firebase";
import type { StoreLocation } from "@/types/store";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function StoreDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [store, setStore] = useState<StoreLocation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStoreByIdFromFirestore(id)
      .then((s) => setStore(s ?? null))
      .catch(() => setStore(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="container mx-auto px-4 py-8"><div className="animate-pulse h-64 bg-gray-100 rounded" /></div>;
  if (!store) {
    router.push("/stores");
    return null;
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/stores" className="text-blue-600 hover:underline mb-4 inline-block">All stores</Link>
      <h1 className="text-2xl font-bold mb-2">{store.name}</h1>
      <p className="text-gray-600">{store.address}</p>
      <p className="text-gray-600">{store.city}, {store.state} {store.zipCode}</p>
      {store.phone && <p className="text-gray-600 mt-2">Phone: {store.phone}</p>}
      {store.hours?.length > 0 && (
        <div className="mt-4">
          <h2 className="font-semibold mb-2">Hours</h2>
          <ul className="text-sm text-gray-600 space-y-1">
            {store.hours.map((h, i) => (
              <li key={i}>{h.day}: {h.closed ? "Closed" : `${h.open} - ${h.close}`}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
