"use client";

import { useState, useEffect } from "react";
import type { Banner } from "@/types/editorial";

export function useBanners(position?: "top" | "mid" | "bottom") {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const q = position ? "?position=" + position : "";
    fetch("/api/banners" + q)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setBanners(data.banners ?? []);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [position]);

  return { banners, loading, error };
}
