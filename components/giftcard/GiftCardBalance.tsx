"use client";

import { useGiftCardBalance } from "@/hooks/useGiftCardBalance";
import { useState } from "react";
import Button from "@/components/common/Button";

export default function GiftCardBalance() {
  const { checkBalance, loading, error } = useGiftCardBalance();
  const [code, setCode] = useState("");
  const [result, setResult] = useState<{ balance: number; currency: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);
    const res = await checkBalance(code);
    if (res) setResult(res);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Check gift card balance</h2>
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 items-end">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Gift card code</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="XXXX-XXXX-XXXX"
            className="border rounded px-3 py-2 font-mono w-48"
          />
        </div>
        <Button type="submit" disabled={loading}>{loading ? "Checking..." : "Check balance"}</Button>
      </form>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {result && <p className="text-sm text-green-700">Balance: {result.currency} {result.balance.toFixed(2)}</p>}
    </div>
  );
}
