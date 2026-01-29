"use client";

import { useState, useEffect, FormEvent } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfileUpdate } from "@/hooks/useProfileUpdate";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";

interface ProfileFormValues {
  displayName: string;
  phone: string;
}

interface ProfileFormProps {
  onSaved?: () => void;
}

export default function ProfileForm({ onSaved }: ProfileFormProps) {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading, saving, error, save } = useProfileUpdate({
    userId: user?.uid,
  });

  const [values, setValues] = useState<ProfileFormValues>({
    displayName: "",
    phone: "",
  });

  useEffect(() => {
    setValues({
      displayName: profile?.displayName ?? user?.displayName ?? "",
      phone: profile?.phone ?? "",
    });
  }, [profile, user?.displayName]);

  const handleChange = (field: keyof ProfileFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user?.uid) return;
    await save({
      displayName: values.displayName,
      phone: values.phone,
    });
    onSaved?.();
  };

  if (authLoading || loading) {
    return <div className="h-32 animate-pulse rounded bg-gray-100" />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full name
        </label>
        <Input
          value={values.displayName}
          onChange={(e) => handleChange("displayName", e.target.value)}
          placeholder="Your name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone number
        </label>
        <Input
          value={values.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          placeholder="Optional"
        />
        <p className="mt-1 text-xs text-gray-500">
          Used for delivery updates and support.
        </p>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" disabled={saving}>
        {saving ? "Saving…" : "Save profile"}
      </Button>
    </form>
  );
}

