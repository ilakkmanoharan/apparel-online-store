"use client";

import Link from "next/link";
import StoreHours from "./StoreHours";
import type { StoreLocation } from "@/types/store";

interface StoreDetailProps {
  store: StoreLocation;
  showBackLink?: boolean;
}

export default function StoreDetail({ store, showBackLink = true }: StoreDetailProps) {
  return (
    <div className="space-y-4">
      {showBackLink && (
        <Link href="/stores/locate" className="text-blue-600 hover:underline text-sm">
          ← Find stores
        </Link>
      )}
      <h1 className="text-2xl font-bold">{store.name}</h1>
      <div className="text-gray-600">
        <p>{store.address}</p>
        <p>{store.city}, {store.state} {store.zipCode}</p>
        <p>{store.country}</p>
      </div>
      {store.phone && (
        <p>
          <a href={`tel:${store.phone}`} className="text-blue-600 hover:underline">
            {store.phone}
          </a>
        </p>
      )}
      <StoreHours hours={store.hours ?? []} />
      {store.services?.length > 0 && (
        <div>
          <h3 className="font-semibold text-sm mb-1">Services</h3>
          <ul className="text-sm text-gray-600 flex flex-wrap gap-2">
            {store.services.map((s) => (
              <li key={s} className="capitalize">{s.replace("_", " ")}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
