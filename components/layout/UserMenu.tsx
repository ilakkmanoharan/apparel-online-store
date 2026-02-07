"use client";

import { useState } from "react";
import { UserIcon } from "@heroicons/react/24/outline";
import LocaleLink from "@/components/common/LocaleLink";
import { useAuth } from "@/contexts/AuthContext";
import { useLocaleRouter } from "@/hooks/useLocaleRouter";
import { useTranslations } from "@/hooks/useTranslations";

export default function UserMenu() {
  const { user, logout } = useAuth();
  const router = useLocaleRouter();
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/");
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2"
        aria-label={t("account.userMenu")}
      >
        <UserIcon className="w-6 h-6 text-gray-700" />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
          {user ? (
            <>
              <div className="px-4 py-2 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-900">{user.displayName || user.email}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <LocaleLink
                href="/account"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                {t("account.myAccount")}
              </LocaleLink>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {t("auth.signOut")}
              </button>
            </>
          ) : (
            <>
              <LocaleLink
                href="/login"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                {t("auth.signIn")}
              </LocaleLink>
              <LocaleLink
                href="/signup"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                {t("auth.signUp")}
              </LocaleLink>
            </>
          )}
        </div>
      )}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}
