"use client";

import { useState } from "react";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { usePromoStore } from "@/store/promoStore";
import { useCartStore } from "@/store/cartStore";
import { validatePromoCode } from "@/lib/promo/validatePromo";
import Toast from "@/components/common/Toast";

export default function PromoCodeInput() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const { code: appliedCode, setPromo, clearPromo } = usePromoStore();
  const getTotal = useCartStore((s) => s.getTotal);
  const subtotal = getTotal();

  const handleApply = () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    const result = validatePromoCode(trimmed, subtotal);
    if (result.valid && result.discountPercent != null) {
      setPromo(trimmed, result.discountPercent);
      setMessage({ text: `Code applied: ${result.discountPercent}% off`, type: "success" });
      setCode("");
    } else {
      setMessage({ text: result.message ?? "Invalid or expired code", type: "error" });
    }
  };

  const handleRemove = () => {
    clearPromo();
    setMessage(null);
  };

  return (
    <div className="space-y-2">
      {appliedCode ? (
        <div className="flex items-center justify-between text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg">
          <span>Code {appliedCode} applied</span>
          <button type="button" onClick={handleRemove} className="underline hover:no-underline">
            Remove
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Input
            placeholder="Promo code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleApply()}
            className="flex-1"
          />
          <Button variant="outline" size="md" onClick={handleApply}>
            Apply
          </Button>
        </div>
      )}
      {message && (
        <Toast message={message.text} variant={message.type} />
      )}
    </div>
  );
}
