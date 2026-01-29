export function validatePhone(phone: string): { valid: boolean; message?: string } {
  const t = phone.trim();
  if (!t) return { valid: true };
  const digits = t.replace(/\D/g, "");
  if (digits.length < 10) return { valid: false, message: "Phone must have at least 10 digits." };
  return { valid: true };
}

export function isValidPhone(phone: string): boolean {
  return validatePhone(phone).valid;
}
