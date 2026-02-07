export const SUPPORTED_CURRENCIES = ["USD", "EUR", "GBP"] as const;

export type Currency = (typeof SUPPORTED_CURRENCIES)[number];

export interface CurrencyConfig {
  code: Currency;
  symbol: string;
  locale: string;
}
