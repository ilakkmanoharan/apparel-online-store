"use client";

import { useState } from "react";
import Button from "@/components/common/Button";
import { validateGiftCardCode } from "@/lib/giftcard/validation";

export default function RedeemForm() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateGiftCardCode(code);
    if (!validation.valid) {
      setMessage({ type: "error", text: validation.message ?? "Invalid code" });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/gift-cards/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim().replace(/\s/g, "").toUpperCase() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Redeem failed");
      setMessage({ type: "success", text: "Redeemed. Balance: " + (data.balance ?? 0) });
      setCode("");
    } catch (e) {
      setMessage({ type: "error", text: e instanceof Error ? e.message : "Redeem failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Gift card code</label>
        <input type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="XXXX-XXXX-XXXX" className="w-full border rounded px-3 py-2 font-mono" />
      </div>
      <Button type="submit" disabled={loading}>{loading ? "Redeeming..." : "Redeem"}</Button>
      {message && <p className={"text-sm " + (message.type === "success" ? "text-green-600" : "text-red-600")}>{message.text}</p>}
    </form>
  );
}
