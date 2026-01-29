"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebase/config";
import type { Address } from "@/types";

export function useSavedAddresses() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [defaultAddress, setDefaultAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAddresses = useCallback(async () => {
    if (!user) {
      setAddresses([]);
      setDefaultAddress(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch("/api/addresses/default", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        const addr = data.address as Address | null;
        setDefaultAddress(addr ?? null);
        setAddresses(addr ? [addr] : []);
      } else {
        setAddresses([]);
        setDefaultAddress(null);
      }
    } catch {
      setAddresses([]);
      setDefaultAddress(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  return {
    addresses,
    defaultAddress,
    loading,
    refetch: fetchAddresses,
  };
}
