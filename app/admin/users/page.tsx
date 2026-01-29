"use client";

import { useEffect, useState } from "react";

interface UserRow {
  uid: string;
  email?: string;
  displayName?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUsers([]);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <div className="h-64 rounded-lg bg-gray-200 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Users</h1>
      <p className="text-sm text-gray-600">
        Wire this page to GET /api/admin/users (Firestore users or Firebase Auth listUsers).
      </p>
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-gray-700">UID</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700">Email</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700">Name</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((u) => (
              <tr key={u.uid}>
                <td className="px-4 py-2 font-mono text-gray-700">{u.uid}</td>
                <td className="px-4 py-2 text-gray-900">{u.email ?? "—"}</td>
                <td className="px-4 py-2 text-gray-700">{u.displayName ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <p className="px-4 py-8 text-center text-gray-500">No users. Add GET /api/admin/users to load data.</p>
        )}
      </div>
    </div>
  );
}
