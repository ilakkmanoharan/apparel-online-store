"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useCartStore } from "@/store/cartStore";
import { cn } from "@/lib/utils";

interface CheckoutGuardProps {
  children: React.ReactNode;
  allowGuest?: boolean;
  className?: string;
}

export default function CheckoutGuard({
  children,
  allowGuest = true,
  className,
}: CheckoutGuardProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const items = useCartStore((s) => s.items);

  useEffect(() => {
    if (authLoading) return;
    if (items.length === 0) {
      router.replace("/cart");
      return;
    }
    if (!allowGuest && !user) {
      router.replace("/login?redirect=/checkout");
    }
  }, [authLoading, user, items.length, allowGuest, router]);

  if (authLoading || items.length === 0) {
    return (
      <div className={cn("flex items-center justify-center min-h-[200px]", className)}>
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!allowGuest && !user) {
    return null;
  }

  return <>{children}</>;
}
