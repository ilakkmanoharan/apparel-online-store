"use client";

import { AdminAuthProvider, useAdminAuth } from "@/contexts/AdminAuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (loading) return;
    if (isLoginPage) {
      if (user && isAdmin) router.replace("/admin");
      return;
    }
    if (!user) {
      router.replace("/admin/login");
      return;
    }
    if (!isAdmin) {
      router.replace("/admin/login");
    }
  }, [loading, user, isAdmin, isLoginPage, router]);

  if (loading && !isLoginPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminAuthProvider>
  );
}
