const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): { valid: boolean; message?: string } {
  const t = email.trim();
  if (!t) return { valid: false, message: "Email is required." };
  if (!EMAIL_REGEX.test(t)) return { valid: false, message: "Invalid email." };
  return { valid: true };
}

export function isValidEmail(email: string): boolean {
  return validateEmail(email).valid;
}
