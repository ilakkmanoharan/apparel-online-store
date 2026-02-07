import { getMessages } from "@/lib/i18n/request";
import { createTranslator } from "@/lib/i18n/translate";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n/config";
import type { Locale, TranslationValues } from "@/types/i18n";

export async function getServerTranslator(localeValue: string) {
  const locale: Locale = isLocale(localeValue) ? localeValue : DEFAULT_LOCALE;
  const [messages, fallbackMessages] = await Promise.all([
    getMessages(locale),
    getMessages(DEFAULT_LOCALE),
  ]);

  const translator = createTranslator(messages, fallbackMessages);

  return {
    locale,
    t: (key: string, values?: TranslationValues) => translator(key, values),
  };
}
