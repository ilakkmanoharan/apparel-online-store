"use client";

import type { AuditLogEntry } from "@/types/admin";
import { cn } from "@/lib/utils";

interface AuditLogTableProps {
  entries: AuditLogEntry[];
  loading?: boolean;
  className?: string;
}

export default function AuditLogTable({
  entries,
  loading = false,
  className,
}: AuditLogTableProps) {
  if (loading) {
    return (
      <div className={cn("overflow-x-auto rounded-lg border border-gray-200", className)}>
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-gray-700">Time</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700">Action</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700">Resource</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700">User</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} className="animate-pulse bg-white">
                <td className="px-4 py-2"><span className="inline-block h-4 w-24 bg-gray-200 rounded" /></td>
                <td className="px-4 py-2"><span className="inline-block h-4 w-16 bg-gray-200 rounded" /></td>
                <td className="px-4 py-2"><span className="inline-block h-4 w-20 bg-gray-200 rounded" /></td>
                <td className="px-4 py-2"><span className="inline-block h-4 w-32 bg-gray-200 rounded" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className={cn("rounded-lg border border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500", className)}>
        No audit entries found.
      </div>
    );
  }

  return (
    <div className={cn("overflow-x-auto rounded-lg border border-gray-200", className)}>
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left font-medium text-gray-700">Time</th>
            <th className="px-4 py-2 text-left font-medium text-gray-700">Action</th>
            <th className="px-4 py-2 text-left font-medium text-gray-700">Resource</th>
            <th className="px-4 py-2 text-left font-medium text-gray-700">User</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {entries.map((e) => (
            <tr key={e.id}>
              <td className="px-4 py-2 text-gray-600">
                {e.createdAt.toLocaleString?.() ?? new Date(e.createdAt).toLocaleString()}
              </td>
              <td className="px-4 py-2 font-medium text-gray-900">{e.action}</td>
              <td className="px-4 py-2 text-gray-700">{e.resource}{e.resourceId ? ` #${e.resourceId}` : ""}</td>
              <td className="px-4 py-2 text-gray-600">{e.userEmail ?? e.userId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
