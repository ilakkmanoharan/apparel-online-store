const MIN_LENGTH = 10;
const MAX_LENGTH = 500;

export interface QuestionValidationResult {
  valid: boolean;
  error?: string;
}

export function validateQuestion(question: string): QuestionValidationResult {
  const trimmed = question.trim();
  if (!trimmed) {
    return { valid: false, error: "Question is required." };
  }
  if (trimmed.length < MIN_LENGTH) {
    return {
      valid: false,
      error: `Question must be at least ${MIN_LENGTH} characters.`,
    };
  }
  if (trimmed.length > MAX_LENGTH) {
    return {
      valid: false,
      error: `Question must be no more than ${MAX_LENGTH} characters.`,
    };
  }
  return { valid: true };
}
