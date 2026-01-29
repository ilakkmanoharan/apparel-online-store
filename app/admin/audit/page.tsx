"use client";

import { useEffect, useState } from "react";
import AuditLogTable from "@/components/admin/AuditLogTable";
import type { AuditLogEntry } from "@/types/admin";

export default function AdminAuditPage() {
  const [entries, setEntries] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resource, setResource] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("limit", "100");
    if (resource) params.set("resource", resource);
    if (userId) params.set("userId", userId);
    setLoading(true);
    fetch(`/api/admin/audit?${params}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load audit log");
        return res.json();
      })
      .then((data: { entries: AuditLogEntry[] }) => setEntries(data.entries))
      .catch((err) => setError(err instanceof Error ? err.message : "Error"))
      .finally(() => setLoading(false));
  }, [resource, userId]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Audit log</h1>
      <p className="text-sm text-gray-600">Recent admin actions. Filter by resource or user.</p>
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Resource (e.g. order)"
          value={resource}
          onChange={(e) => setResource(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm w-48"
        />
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm w-48"
        />
      </div>
      {error && <p className="text-red-600">{error}</p>}
      <AuditLogTable entries={entries} loading={loading} />
    </div>
  );
}
