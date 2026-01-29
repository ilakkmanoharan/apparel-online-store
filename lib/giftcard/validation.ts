export function validateGiftCardCode(code: string): { valid: boolean; message?: string } {
  const trimmed = code.trim().replace(/\s/g, "").toUpperCase();
  if (!trimmed || trimmed.length < 10) {
    return { valid: false, message: "Please enter a valid gift card code." };
  }
  return { valid: true };
}

export function validateGiftCardAmount(amount: number): { valid: boolean; message?: string } {
  if (amount < 5) return { valid: false, message: "Minimum amount is $5." };
  if (amount > 500) return { valid: false, message: "Maximum amount is $500." };
  return { valid: true };
}

export function applyGiftCardBalance(balance: number, cartTotal: number): number {
  return Math.min(balance, Math.max(0, cartTotal));
}
