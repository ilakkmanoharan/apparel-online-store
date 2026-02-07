export type Locale = (typeof import("@/lib/i18n/config").LOCALES)[number];

export type LocaleParams = {
  locale: Locale;
};

export type MessagePrimitive = string | number | boolean;

export type MessageValue = MessagePrimitive | Messages;

export type Messages = {
  [key: string]: MessageValue;
};

export type TranslationValues = Record<string, string | number>;
