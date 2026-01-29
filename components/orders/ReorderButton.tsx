"use client";

import { useState } from "react";
import Button from "@/components/common/Button";
import type { Order } from "@/types";
import { useCartStore } from "@/store/cartStore";

interface ReorderButtonProps {
  order: Order;
}

export default function ReorderButton({ order }: ReorderButtonProps) {
  const [loading, setLoading] = useState(false);
  const addItem = useCartStore((s) => s.addItemFromOrder);

  const handleClick = async () => {
    setLoading(true);
    try {
      for (const item of order.items) {
        // Delegate to cart store helper which knows how to map an Order item back into cart state
        addItem(item);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button type="button" variant="outline" size="sm" onClick={handleClick} disabled={loading}>
      {loading ? "Adding…" : "Reorder items"}
    </Button>
  );
}

