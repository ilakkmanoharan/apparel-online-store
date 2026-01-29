"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductDetails from "@/components/products/ProductDetails";
import { Product } from "@/types";
import { getProductById } from "@/lib/firebase/products";

interface PageProps {
  params: { id: string };
}

export default function ProductPage({ params }: PageProps) {
  const { id } = params;
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const fetchedProduct = await getProductById(id);
        if (!fetchedProduct) {
          router.push("/not-found");
          return;
        }
        setProduct(fetchedProduct);
      } catch (error) {
        console.error("Error fetching product:", error);
        router.push("/not-found");
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id, router]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square bg-gray-100 rounded-lg animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-100 rounded animate-pulse" />
            <div className="h-6 bg-gray-100 rounded animate-pulse w-1/2" />
            <div className="h-24 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetails product={product} />
    </div>
  );
}
