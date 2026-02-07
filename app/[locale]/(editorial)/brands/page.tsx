"use client";

import { useEffect, useState } from "react";
import Spinner from "@/components/common/Spinner";
import BrandCard from "@/components/editorial/BrandCard";
import { useTranslations } from "@/hooks/useTranslations";
import { getBrands } from "@/lib/editorial/brands";
import type { Brand } from "@/lib/editorial/brands";

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations();

  useEffect(() => {
    getBrands().then(setBrands).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t("editorial.brands")}</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {brands.map((brand) => (
          <BrandCard key={brand.id} brand={brand} />
        ))}
      </div>
    </div>
  );
}
