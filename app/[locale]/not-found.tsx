import LocaleLink from "@/components/common/LocaleLink";
import { getServerTranslator } from "@/lib/i18n/server";

type LocaleNotFoundProps = {
  params?: {
    locale: string;
  } | Promise<{
    locale: string;
  }>;
};

export default async function LocaleNotFound({ params }: LocaleNotFoundProps) {
  // Safely resolve params (might be undefined or a Promise in Next.js 15)
  const resolvedParams = params instanceof Promise ? await params : params;
  const locale = resolvedParams?.locale ?? "en";

  const { locale: finalLocale, t } = await getServerTranslator(locale);

  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-4xl font-bold text-gray-900">{t("errors.notFoundTitle")}</h1>
      <p className="mt-4 text-gray-600">{t("errors.notFoundDescription")}</p>
      <LocaleLink
        href={`/${finalLocale}`}
        className="mt-8 inline-flex rounded-md bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
      >
        {t("common.backToHome")}
      </LocaleLink>
    </div>
  );
}
