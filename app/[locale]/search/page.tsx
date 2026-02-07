import SearchFilters from "@/components/search/SearchFilters";
import SearchResultSummary from "@/components/search/SearchResultSummary";
import SearchResultEmpty from "@/components/search/SearchResultEmpty";
import SearchResults from "@/components/search/SearchResults";
import { getServerTranslator } from "@/lib/i18n/server";
import { searchProducts } from "@/lib/search";
import { Product } from "@/types";

interface SearchPageProps {
  params: { locale: string };
  searchParams: { q?: string; category?: string };
}

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const { t } = await getServerTranslator(params.locale);
  const q = searchParams.q || "";
  const category = searchParams.category || "";

  let products: Product[] = [];

  if (q) {
    const { products: found } = await searchProducts(q, {
      category: category || undefined,
    }, params.locale);
    products = found;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">{t("search.title")}</h1>
      <SearchFilters />
      <SearchResultSummary query={q} count={products.length} />

      {!q ? (
        <p className="text-gray-600 mt-4">{t("search.startTyping")}</p>
      ) : products.length === 0 ? (
        <SearchResultEmpty query={q} />
      ) : (
        <SearchResults products={products} />
      )}
    </div>
  );
}
