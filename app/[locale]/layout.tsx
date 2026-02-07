import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import I18nProvider from "@/components/common/I18nProvider";
import { DEFAULT_LOCALE, LOCALES, isLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/request";

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: {
    locale: string;
  };
};

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = params;

  if (!isLocale(locale)) {
    notFound();
  }

  const [messages, fallbackMessages] = await Promise.all([
    getMessages(locale),
    getMessages(DEFAULT_LOCALE),
  ]);

  return (
    <I18nProvider locale={locale} messages={messages} fallbackMessages={fallbackMessages}>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </I18nProvider>
  );
}
