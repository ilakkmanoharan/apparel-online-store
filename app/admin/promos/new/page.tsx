"use client";

import { useRouter } from "next/navigation";
import PromoForm from "@/components/admin/PromoForm";
import { createAdminPromo } from "@/lib/admin/promos";

export default function AdminNewPromoPage() {
  const router = useRouter();

  const handleSubmit = async (data: Omit<import("@/lib/admin/promos").AdminPromo, "id" | "createdAt" | "updatedAt">) => {
    await createAdminPromo(data);
    router.push("/admin/promos");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">New promo code</h1>
      <PromoForm promo={null} onSubmit={handleSubmit} onCancel={() => router.push("/admin/promos")} />
    </div>
  );
}
