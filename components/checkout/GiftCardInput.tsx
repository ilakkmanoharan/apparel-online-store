"use client";

import { useState } from "react";
import { useGiftCardBalance } from "@/hooks/useGiftCardBalance";
import { useGiftCardStore } from "@/store/giftCardStore";
import Button from "@/components/common/Button";

export default function GiftCardInput() {
  const { checkBalance, loading, error } = useGiftCardBalance();
  const { addApplied, removeApplied, appliedCards } = useGiftCardStore();
  const [code, setCode] = useState("");

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await checkBalance(code);
    if (res && res.balance > 0) {
      addApplied(code, res.balance, res.currency);
      setCode("");
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-sm">Gift card</h3>
      <form onSubmit={handleApply} className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Gift card code"
          className="flex-1 border rounded px-2 py-1.5 text-sm font-mono"
        />
        <Button type="submit" disabled={loading}>{loading ? "..." : "Apply"}</Button>
      </form>
      {error && <p className="text-xs text-red-600">{error}</p>}
      {appliedCards.length > 0 && (
        <ul className="text-sm text-gray-600 space-y-1">
          {appliedCards.map((c) => (
            <li key={c.code} className="flex items-center justify-between">
              <span>{c.code} – {c.currency} {c.balance.toFixed(2)}</span>
              <button type="button" onClick={() => removeApplied(c.code)} className="text-red-600 hover:underline text-xs">Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
