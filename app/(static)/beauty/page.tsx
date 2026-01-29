import Link from "next/link";
import { getProductsByCategory } from "@/lib/firebase/products";
import ProductCard from "@/components/products/ProductCard";

export default async function BeautyPage() {
  const products = await getProductsByCategory("beauty");
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Beauty</h1>
      <p className="text-gray-600 mb-6">Shop beauty and personal care.</p>
      {products.length === 0 ? (
        <p className="text-gray-600">No products in this category yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
      <Link href="/" className="mt-6 inline-block text-blue-600 hover:underline">Back to home</Link>
    </div>
  );
}
