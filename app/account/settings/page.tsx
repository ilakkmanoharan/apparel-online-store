"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import AccountSidebar from "@/components/account/AccountSidebar";
import AccountMenu from "@/components/account/AccountMenu";
import ProfileForm from "@/components/account/ProfileForm";
import EmailPreferences from "@/components/account/EmailPreferences";
import PrivacySettings from "@/components/account/PrivacySettings";

export default function AccountSettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return <div className="h-48 animate-pulse rounded bg-gray-100" />;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <AccountMenu />
      <div className="flex gap-8">
        <div className="hidden md:block">
          <AccountSidebar />
        </div>
        <main className="flex-1 space-y-8">
          <section className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Account settings</h1>
              <p className="text-sm text-gray-600">
                Manage your profile, communication preferences, and privacy.
              </p>
            </div>
            <ProfileForm />
          </section>
          <EmailPreferences />
          <PrivacySettings />
        </main>
      </div>
    </div>
  );
}

