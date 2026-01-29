"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useEffect } from "react";
import ManagePaymentMethods from "@/components/account/ManagePaymentMethods";
import ChangePasswordForm from "@/components/account/ChangePasswordForm";
import DeleteAccountSection from "@/components/account/DeleteAccountSection";

export default function AccountSecurityPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [authLoading, user, router]);

  if (authLoading || !user) return <div className="animate-pulse h-64 bg-gray-100 rounded" />;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Security & billing</h1>
      <ManagePaymentMethods />
      <ChangePasswordForm />
      <DeleteAccountSection />
    </div>
  );
}
