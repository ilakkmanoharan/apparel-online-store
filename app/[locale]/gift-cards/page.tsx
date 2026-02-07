import LocaleLink from "@/components/common/LocaleLink";
import { getServerTranslator } from "@/lib/i18n/server";

interface GiftCardsPageProps {
  params: { locale: string };
}

export default async function GiftCardsPage({ params }: GiftCardsPageProps) {
  const { t } = await getServerTranslator(params.locale);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{t("giftCard.title")}</h1>
      <p className="text-gray-600 mb-6 max-w-xl">{t("giftCard.description")}</p>
      <div className="flex flex-wrap gap-4">
        <LocaleLink href="/gift-cards/redeem" className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800">
          {t("giftCard.redeem")}
        </LocaleLink>
        <LocaleLink href="/" className="inline-block px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50">
          {t("common.continueShopping")}
        </LocaleLink>
      </div>
    </div>
  );
}
