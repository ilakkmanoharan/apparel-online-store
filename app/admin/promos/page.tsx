"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PromoList from "@/components/admin/PromoList";
import { listAdminPromos } from "@/lib/admin/promos";
import type { AdminPromo } from "@/lib/admin/promos";
import Button from "@/components/common/Button";

export default function AdminPromosPage() {
  const [promos, setPromos] = useState<AdminPromo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listAdminPromos(100).then(setPromos).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Promo codes</h1>
        <Link href="/admin/promos/new">
          <Button>New promo</Button>
        </Link>
      </div>
      <PromoList promos={promos} loading={loading} />
    </div>
  );
}
