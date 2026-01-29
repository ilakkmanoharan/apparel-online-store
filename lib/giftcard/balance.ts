import { getGiftCardByCode } from "@/lib/giftcard/firebase";

export async function getGiftCardBalanceByCode(code: string): Promise<{ balance: number; currency: string } | null> {
  const normalized = code.trim().replace(/\s/g, "").toUpperCase();
  const card = await getGiftCardByCode(normalized);
  if (!card) return null;
  return { balance: card.balance, currency: card.currency ?? "USD" };
}
