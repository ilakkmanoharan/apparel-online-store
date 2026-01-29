export interface PasswordValidationResult {
  valid: boolean;
  message?: string;
}

const MIN_LENGTH = 8;

export function validatePassword(password: string): PasswordValidationResult {
  const value = password.trim();
  if (!value) {
    return { valid: false, message: "Password is required." };
  }
  if (value.length < MIN_LENGTH) {
    return {
      valid: false,
      message: `Password must be at least ${MIN_LENGTH} characters.`,
    };
  }
  if (!/[A-Z]/.test(value)) {
    return {
      valid: false,
      message: "Add at least one uppercase letter.",
    };
  }
  if (!/[a-z]/.test(value)) {
    return {
      valid: false,
      message: "Add at least one lowercase letter.",
    };
  }
  if (!/[0-9]/.test(value)) {
    return {
      valid: false,
      message: "Add at least one number.",
    };
  }
  if (!/[!@#$%^&*(),.?\":{}|<>]/.test(value)) {
    return {
      valid: false,
      message: "Add at least one special character.",
    };
  }
  return { valid: true };
}

export function isStrongPassword(password: string): boolean {
  return validatePassword(password).valid;
}

