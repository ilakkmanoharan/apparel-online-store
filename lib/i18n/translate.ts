import type { Messages, MessageValue, TranslationValues } from "@/types/i18n";

function isObject(value: MessageValue | undefined): value is Messages {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function getMessageByKey(messages: Messages, key: string): string | undefined {
  const segments = key.split(".");
  let current: MessageValue | undefined = messages;

  for (const segment of segments) {
    if (!isObject(current)) {
      return undefined;
    }

    current = current[segment];
  }

  return typeof current === "string" ? current : undefined;
}

function formatTemplate(template: string, values?: TranslationValues): string {
  if (!values) {
    return template;
  }

  return template.replace(/\{(\w+)\}/g, (_, token: string) => {
    const value = values[token];

    return value === undefined ? `{${token}}` : String(value);
  });
}

export function createTranslator(messages: Messages, fallbackMessages?: Messages) {
  return (key: string, values?: TranslationValues): string => {
    const message = getMessageByKey(messages, key) ?? (fallbackMessages ? getMessageByKey(fallbackMessages, key) : undefined);

    if (!message) {
      return key;
    }

    return formatTemplate(message, values);
  };
}
