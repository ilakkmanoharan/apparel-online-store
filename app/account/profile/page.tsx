"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [name, setName] = useState(user?.displayName ?? "");
  const [saving, setSaving] = useState(false);

  if (!loading && !user) {
    router.push("/login");
    return null;
  }
  if (loading) return <div className="animate-pulse h-32 bg-gray-100 rounded" />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { updateProfile } = await import("firebase/auth");
      const { auth } = await import("@/lib/firebase/config");
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: name });
      }
      router.push("/account");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <Input
          label="Email"
          value={user?.email ?? ""}
          disabled
          title="Email cannot be changed here"
        />
        <Input
          label="Display Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
      </form>
    </div>
  );
}
