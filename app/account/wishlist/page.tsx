"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ProductCard from "@/components/products/ProductCard";
import { useWishlistStore } from "@/store/wishlistStore";
import Link from "next/link";
import Button from "@/components/common/Button";

export default function WishlistPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { items } = useWishlistStore();

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  if (!authLoading && !user) return null;
  if (authLoading) return <div className="animate-pulse h-32 bg-gray-100 rounded" />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Wishlist</h1>
      {items.length === 0 ? (
        <div className="text-center py-12 text-gray-600">
          <p className="mb-4">Your wishlist is empty.</p>
          <Link href="/">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
