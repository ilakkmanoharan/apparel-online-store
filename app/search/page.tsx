import SearchFilters from "@/components/search/SearchFilters";
import SearchResultSummary from "@/components/search/SearchResultSummary";
import SearchResultEmpty from "@/components/search/SearchResultEmpty";
import SearchResults from "@/components/search/SearchResults";
import { searchProducts } from "@/lib/search";
import { Product } from "@/types";

interface SearchPageProps {
  searchParams: { q?: string; category?: string };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const q = searchParams.q || "";
  const category = searchParams.category || "";

  let products: Product[] = [];

  if (q) {
    const { products: found } = await searchProducts(q, {
      category: category || undefined,
    });
    products = found;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Search</h1>
      <SearchFilters />
      <SearchResultSummary query={q} count={products.length} />

      {!q ? (
        <p className="text-gray-600 mt-4">
          Start typing in the search bar above to find products.
        </p>
      ) : products.length === 0 ? (
        <SearchResultEmpty query={q} />
      ) : (
        <SearchResults products={products} />
      )}
    </div>
  );
}

