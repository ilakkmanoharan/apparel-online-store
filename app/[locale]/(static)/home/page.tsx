import LocaleLink from "@/components/common/LocaleLink";
import ProductCard from "@/components/products/ProductCard";
import { getProductsByCategory } from "@/lib/firebase/products";
import { getServerTranslator } from "@/lib/i18n/server";

interface HomeCategoryPageProps {
  params: { locale: string };
}

export default async function HomeCategoryPage({ params }: HomeCategoryPageProps) {
  const products = await getProductsByCategory("home", params.locale);
  const { t } = await getServerTranslator(params.locale);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{t("static.home.title")}</h1>
      <p className="text-gray-600 mb-6">{t("static.home.description")}</p>
      {products.length === 0 ? (
        <p className="text-gray-600">{t("category.noProducts")}</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
      <LocaleLink href="/" className="mt-6 inline-block text-blue-600 hover:underline">{t("common.backToHome")}</LocaleLink>
    </div>
  );
}
