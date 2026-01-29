import Link from "next/link";
import StoreCard from "./StoreCard";
import type { StoreLocation } from "@/types/store";

interface StoreListProps {
  stores: StoreLocation[];
}

export default function StoreList({ stores }: StoreListProps) {
  if (stores.length === 0) return <p className="text-gray-600">No stores found.</p>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stores.map((s) => (
        <StoreCard key={s.id} store={s} />
      ))}
    </div>
  );
}
