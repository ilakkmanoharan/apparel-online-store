"use client";

import Input from "@/components/common/Input";
import { Address } from "@/types";

interface ShippingAddressFormProps {
  address: Address;
  onChange: (address: Address) => void;
}

export default function ShippingAddressForm({
  address,
  onChange,
}: ShippingAddressFormProps) {
  return (
    <div className="space-y-4">
      <Input
        label="Full Name"
        value={address.fullName}
        onChange={(e) => onChange({ ...address, fullName: e.target.value })}
        required
      />
      <Input
        label="Street Address"
        value={address.street}
        onChange={(e) => onChange({ ...address, street: e.target.value })}
        required
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="City"
          value={address.city}
          onChange={(e) => onChange({ ...address, city: e.target.value })}
          required
        />
        <Input
          label="State / Province"
          value={address.state}
          onChange={(e) => onChange({ ...address, state: e.target.value })}
          required
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="ZIP / Postal Code"
          value={address.zipCode}
          onChange={(e) => onChange({ ...address, zipCode: e.target.value })}
          required
        />
        <Input
          label="Country"
          value={address.country}
          onChange={(e) => onChange({ ...address, country: e.target.value })}
          required
        />
      </div>
    </div>
  );
}
