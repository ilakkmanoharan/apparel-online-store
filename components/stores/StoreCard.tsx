import LocaleLink from "@/components/common/LocaleLink";
import type { StoreLocation } from "@/types/store";

interface StoreCardProps {
  store: StoreLocation;
}

export default function StoreCard({ store }: StoreCardProps) {
  return (
    <LocaleLink href={`/stores/${store.id}`} className="block border rounded-lg p-4 hover:shadow-md transition-shadow">
      <h2 className="font-semibold text-lg">{store.name}</h2>
      <p className="text-sm text-gray-600 mt-1">{store.address}</p>
      <p className="text-sm text-gray-600">{store.city}, {store.state} {store.zipCode}</p>
      {store.phone && <p className="text-sm text-gray-600 mt-1">{store.phone}</p>}
    </LocaleLink>
  );
}
