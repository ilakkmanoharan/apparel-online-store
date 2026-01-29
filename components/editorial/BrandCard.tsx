"use client";

import Link from "next/link";

interface Brand {
  id: string;
  slug: string;
  name: string;
  productCount?: number;
}

export default function BrandCard({ brand }: { brand: Brand }) {
  return (
    <Link href={"/brands/" + brand.slug} className="block border rounded-lg p-4 hover:bg-gray-50">
      <h3 className="font-semibold">{brand.name}</h3>
      {brand.productCount != null && <p className="text-sm text-gray-500">{brand.productCount} products</p>}
    </Link>
  );
}
