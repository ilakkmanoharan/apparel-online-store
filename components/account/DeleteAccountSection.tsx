"use client";

import { useState } from "react";
import Button from "@/components/common/Button";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/config";

export default function DeleteAccountSection() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirmPhrase = "DELETE MY ACCOUNT";
  const canDelete = confirmText === confirmPhrase;

  const handleDelete = async () => {
    if (!canDelete) return;
    setLoading(true);
    setError(null);
    try {
      const token = user ? await auth.currentUser?.getIdToken() : null;
      const res = await fetch("/api/user/delete-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ confirm: confirmText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to delete account");
      await logout();
      router.push("/");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="border border-red-200 rounded-lg p-4 bg-red-50/50">
      <h2 className="text-lg font-semibold text-red-800 mb-2">Delete account</h2>
      <p className="text-sm text-gray-700 mb-4">
        This action cannot be undone. All your data will be removed. Type{" "}
        <strong>{confirmPhrase}</strong> to confirm.
      </p>
      <input
        type="text"
        value={confirmText}
        onChange={(e) => setConfirmText(e.target.value)}
        placeholder={confirmPhrase}
        className="w-full max-w-md border rounded px-3 py-2 mb-4 font-mono text-sm"
      />
      <Button
        variant="outline"
        className="border-red-600 text-red-700 hover:bg-red-100"
        onClick={handleDelete}
        disabled={!canDelete || loading}
      >
        {loading ? "Deleting…" : "Delete my account"}
      </Button>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </section>
  );
}
