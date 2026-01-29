"use client";

import { useEffect, useState } from "react";
import { Address } from "@/types";
import {
  getAddresses,
  addAddress,
  updateAddress,
  setDefaultAddress,
  deleteAddress,
} from "@/lib/firebase/addresses";

export function useAddresses(userId: string | null) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setAddresses([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    getAddresses(userId)
      .then((data) => {
        if (!cancelled) setAddresses(data);
      })
      .catch(console.error)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [userId]);

  const add = async (address: Omit<Address, "id">) => {
    if (!userId) throw new Error("Not authenticated");
    const id = await addAddress(userId, address);
    setAddresses((prev) => [...prev, { ...address, id }]);
    return id;
  };

  const update = async (addressId: string, data: Partial<Address>) => {
    if (!userId) throw new Error("Not authenticated");
    await updateAddress(userId, addressId, data);
    setAddresses((prev) =>
      prev.map((a) => (a.id === addressId ? { ...a, ...data } : a))
    );
  };

  const setDefault = async (addressId: string) => {
    if (!userId) throw new Error("Not authenticated");
    await setDefaultAddress(userId, addressId);
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === addressId }))
    );
  };

  const remove = async (addressId: string) => {
    if (!userId) throw new Error("Not authenticated");
    await deleteAddress(userId, addressId);
    setAddresses((prev) => prev.filter((a) => a.id !== addressId));
  };

  return {
    addresses,
    loading,
    add,
    update,
    setDefault,
    remove,
  };
}
