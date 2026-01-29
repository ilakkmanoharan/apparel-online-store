"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import Button from "@/components/common/Button";

export default function AccountPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  if (loading) return <div className="animate-pulse h-32 bg-gray-100 rounded" />;
  if (!user) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Account</h1>
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-medium text-gray-900">{user.email}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Name</p>
          <p className="font-medium text-gray-900">{user.displayName || "—"}</p>
        </div>
        <Link href="/account/profile">
          <Button variant="outline">Edit Profile</Button>
        </Link>
      </div>
    </div>
  );
}
