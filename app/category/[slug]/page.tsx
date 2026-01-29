"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/products/ProductCard";
import { Product } from "@/types";
import { getProductsByCategory } from "@/lib/firebase/products";
import WomenFashionGallery from "@/components/category/WomenFashionGallery";

interface PageProps {
  params: { slug: string };
}

export default function CategoryPage({ params }: PageProps) {
  const { slug } = params;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const categoryProducts = await getProductsByCategory(slug);
        setProducts(categoryProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 capitalize">{slug}</h1>
        {slug === "women" && <WomenFashionGallery />}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md h-96 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 capitalize">{slug}</h1>
      {slug === "women" && <WomenFashionGallery />}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No products found in this category.</p>
      )}
    </div>
  );
}
