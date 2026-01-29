"use client";

import { useState } from "react";
import Button from "@/components/common/Button";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebase/config";

export default function ManagePaymentMethods() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const openPortal = async () => {
    setLoading(true);
    try {
      const token = user ? await auth.currentUser?.getIdToken() : null;
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          returnUrl: typeof window !== "undefined" ? window.location.href : "",
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else throw new Error(data.error ?? "Failed to open billing portal");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="border rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-2">Payment methods</h2>
      <p className="text-sm text-gray-600 mb-4">
        Manage your saved cards and billing via Stripe Customer Portal.
      </p>
      <Button onClick={openPortal} disabled={loading}>
        {loading ? "Opening…" : "Manage payment methods"}
      </Button>
      <p className="text-xs text-gray-500 mt-2">
        You will be redirected to a secure Stripe page.
      </p>
    </section>
  );
}
