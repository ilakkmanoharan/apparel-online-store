"use client";

import { useState, useEffect } from "react";
import { Address } from "@/types";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { useAddresses } from "@/hooks/useAddresses";
import { getAddressById } from "@/lib/firebase/addresses";

interface AddressFormProps {
  addressId?: string;
  onSaved: () => void;
  onCancel: () => void;
  userId: string | null;
}

const emptyAddress: Omit<Address, "id"> = {
  fullName: "",
  street: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",
  isDefault: false,
};

export default function AddressForm({
  addressId,
  onSaved,
  onCancel,
  userId,
}: AddressFormProps) {
  const [form, setForm] = useState<Omit<Address, "id">>(emptyAddress);
  const [loading, setLoading] = useState(!!addressId);
  const { add, update } = useAddresses(userId);

  useEffect(() => {
    if (!addressId || !userId) return;
    getAddressById(userId, addressId)
      .then((addr) => {
        if (addr) setForm({ ...addr, id: "" } as Omit<Address, "id">);
      })
      .finally(() => setLoading(false));
  }, [addressId, userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setLoading(true);
    try {
      if (addressId) {
        await update(addressId, form);
      } else {
        await add(form);
      }
      onSaved();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Full Name"
        value={form.fullName}
        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        required
      />
      <Input
        label="Street Address"
        value={form.street}
        onChange={(e) => setForm({ ...form, street: e.target.value })}
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="City"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
          required
        />
        <Input
          label="State"
          value={form.state}
          onChange={(e) => setForm({ ...form, state: e.target.value })}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="ZIP Code"
          value={form.zipCode}
          onChange={(e) => setForm({ ...form, zipCode: e.target.value })}
          required
        />
        <Input
          label="Country"
          value={form.country}
          onChange={(e) => setForm({ ...form, country: e.target.value })}
          required
        />
      </div>
      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
