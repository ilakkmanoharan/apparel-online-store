"use client";

import { useState } from "react";
import { Address } from "@/types";
import { useAddresses } from "@/hooks/useAddresses";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import AddressForm from "./AddressForm";

interface AddressListProps {
  addresses: Address[];
  loading: boolean;
  userId: string | null;
}

export default function AddressList({
  addresses,
  loading,
  userId,
}: AddressListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const { setDefault, remove } = useAddresses(userId);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="h-28 bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Button onClick={() => setAdding(true)}>Add Address</Button>

      {addresses.length === 0 ? (
        <p className="text-gray-600">No saved addresses yet.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {addresses.map((addr) => (
            <li key={addr.id} className="py-4 flex flex-wrap justify-between gap-4">
              <div className="text-sm text-gray-700">
                <p className="font-medium text-gray-900">{addr.fullName}</p>
                <p>{addr.street}</p>
                <p>
                  {addr.city}, {addr.state} {addr.zipCode}
                </p>
                <p>{addr.country}</p>
                {addr.isDefault && (
                  <span className="inline-block mt-2 text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded">
                    Default
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                {!addr.isDefault && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDefault(addr.id)}
                  >
                    Set default
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingId(addr.id)}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(addr.id)}
                  className="text-red-600"
                >
                  Remove
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal open={adding} onClose={() => setAdding(false)} title="Add Address">
        <AddressForm
          onSaved={() => setAdding(false)}
          onCancel={() => setAdding(false)}
          userId={userId}
        />
      </Modal>

      {editingId && (
        <Modal open={!!editingId} onClose={() => setEditingId(null)} title="Edit Address">
          <AddressForm
            addressId={editingId}
            onSaved={() => setEditingId(null)}
            onCancel={() => setEditingId(null)}
            userId={userId}
          />
        </Modal>
      )}
    </div>
  );
}
