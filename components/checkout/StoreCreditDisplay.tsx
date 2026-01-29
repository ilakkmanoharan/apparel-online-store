"use client";

import { useStoreCredit } from "@/hooks/useStoreCredit";

interface StoreCreditDisplayProps {
  onApply?: (amount: number) => void;
  maxApply?: number;
}

export default function StoreCreditDisplay({ onApply, maxApply }: StoreCreditDisplayProps) {
  const { balance, loading, error } = useStoreCredit();

  if (loading) return <p className="text-sm text-gray-500">Loading store credit...</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!balance || balance.balance <= 0) return null;

  const amount = maxApply != null ? Math.min(balance.balance, maxApply) : balance.balance;

  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-600">
        Store credit: {balance.currency} {balance.balance.toFixed(2)}
      </span>
      {onApply && amount > 0 && (
        <button
          type="button"
          onClick={() => onApply(amount)}
          className="text-blue-600 hover:underline"
        >
          Use {balance.currency} {amount.toFixed(2)}
        </button>
      )}
    </div>
  );
}
