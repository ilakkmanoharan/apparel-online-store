import { getServerTranslator } from "@/lib/i18n/server";

interface WomenLandingPageProps {
  params: { locale: string };
}

export default async function WomenLandingPage({ params }: WomenLandingPageProps) {
  const { t } = await getServerTranslator(params.locale);

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">{t("static.women.title")}</h1>
      <p className="text-gray-600 mb-8 max-w-2xl">{t("static.women.description")}</p>
    </div>
  );
}
