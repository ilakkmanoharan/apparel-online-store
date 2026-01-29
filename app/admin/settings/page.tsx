"use client";

import { useAdminAuth } from "@/contexts/AdminAuthContext";

export default function AdminSettingsPage() {
  const { adminRecord, user } = useAdminAuth();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      <div className="bg-white rounded-lg border border-gray-200 p-6 max-w-xl space-y-4">
        <h2 className="font-semibold text-gray-900">Admin account</h2>
        <p className="text-sm text-gray-600">Email: {user?.email ?? adminRecord?.email}</p>
        <p className="text-sm text-gray-500">Role: {adminRecord?.role ?? "admin"}</p>
        <p className="text-xs text-gray-400 mt-4">
          To add more admins, create a document in Firestore collection <code className="bg-gray-100 px-1 rounded">adminUsers</code> with
          document ID = user UID and fields: <code className="bg-gray-100 px-1 rounded">email</code>, <code className="bg-gray-100 px-1 rounded">role</code> (admin | super_admin | support).
        </p>
        <p className="text-xs text-gray-400">
          For development, set <code className="bg-gray-100 px-1 rounded">NEXT_PUBLIC_ADMIN_EMAILS=your@email.com</code> in .env.local.
        </p>
      </div>
    </div>
  );
}
