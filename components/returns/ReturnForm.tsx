"use client";

import { useState } from "react";
import type { Order } from "@/types";
import type { ReturnItem } from "@/types/returns";
import ReturnItemList from "./ReturnItemList";
import { validateReturnEligibility, validateReturnItems } from "@/lib/returns/validation";
import { createReturn } from "@/lib/returns/firebase";
import Button from "@/components/common/Button";

interface ReturnFormProps {
  order: Order;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ReturnForm({ order, onSuccess, onCancel }: ReturnFormProps) {
  const [selectedItems, setSelectedItems] = useState<ReturnItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const eligibility = validateReturnEligibility(order.createdAt, selectedItems.length);
  const handleToggle = (productId: string, variantKey: string, quantity: number, reason: ReturnItem["reason"], reasonDetail?: string) => {
    setSelectedItems((prev) => {
      const rest = prev.filter((s) => !(s.productId === productId && s.variantKey === variantKey));
      if (quantity > 0) {
        return [...rest, { orderId: order.id, productId, variantKey, quantity, reason, reasonDetail }];
      }
      return rest;
    });
  };

  const handleReasonChange = (productId: string, variantKey: string, reason: ReturnItem["reason"], reasonDetail?: string) => {
    setSelectedItems((prev) =>
      prev.map((s) =>
        s.productId === productId && s.variantKey === variantKey ? { ...s, reason, reasonDetail } : s
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!eligibility.eligible || eligibility.message) {
      setError(eligibility.message ?? "Not eligible");
      return;
    }
    const validation = validateReturnItems(selectedItems);
    if (!validation.valid) {
      setError(validation.message ?? "Invalid items");
      return;
    }
    setLoading(true);
    try {
      await createReturn(order.userId, order.id, selectedItems);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit return");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!eligibility.eligible && <p className="text-amber-600">{eligibility.message}</p>}
      <ReturnItemList
        order={order}
        selectedItems={selectedItems}
        onToggleItem={handleToggle}
        onReasonChange={handleReasonChange}
      />
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <div className="flex gap-4">
        <Button type="submit" disabled={loading || !eligibility.eligible || selectedItems.length === 0}>
          {loading ? "Submitting..." : "Submit Return Request"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
