"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AddressList from "@/components/account/AddressList";
import { useAddresses } from "@/hooks/useAddresses";

export default function AddressesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { addresses, loading } = useAddresses(user?.uid ?? null);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  if (!authLoading && !user) return null;
  if (authLoading) return <div className="animate-pulse h-32 bg-gray-100 rounded" />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Addresses</h1>
      <AddressList addresses={addresses} loading={loading} userId={user?.uid ?? null} />
    </div>
  );
}
