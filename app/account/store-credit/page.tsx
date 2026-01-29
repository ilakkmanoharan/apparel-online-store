"use client";

import { useStoreCredit } from "@/hooks/useStoreCredit";
import Spinner from "@/components/common/Spinner";
import Link from "next/link";

export default function StoreCreditPage() {
  const { balance, loading, error } = useStoreCredit();

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Store credit</h1>
      {error && <p className="text-red-600">{error}</p>}
      {balance && (
        <div className="border rounded-lg p-6 bg-gray-50">
          <p className="text-3xl font-semibold">
            {balance.currency} {balance.balance.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600 mt-1">Available balance</p>
        </div>
      )}
      {!balance && !loading && !error && (
        <p className="text-gray-600">You have no store credit. Earn it through returns or promotions.</p>
      )}
      <Link href="/account" className="text-blue-600 hover:underline">
        Back to account
      </Link>
    </div>
  );
}
