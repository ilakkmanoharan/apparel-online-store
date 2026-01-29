"use client";

import Link from "next/link";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import Button from "@/components/common/Button";

export default function AdminHeader() {
  const { user, adminRecord, signOut } = useAdminAuth();

  return (
    <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-6">
      <div className="text-sm text-gray-500">
        {adminRecord?.role && (
          <span className="capitalize">{adminRecord.role.replace("_", " ")}</span>
        )}
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-700">{user?.email ?? adminRecord?.email}</span>
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900">
          Storefront
        </Link>
        <Button variant="outline" size="sm" onClick={() => signOut()}>
          Sign out
        </Button>
      </div>
    </header>
  );
}
