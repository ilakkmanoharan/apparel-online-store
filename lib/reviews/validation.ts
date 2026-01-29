export function validateReview(data: { rating: number; title?: string; body?: string }): { valid: boolean; message?: string } {
  if (data.rating < 1 || data.rating > 5) {
    return { valid: false, message: "Rating must be between 1 and 5." };
  }
  if (data.body && data.body.length > 2000) {
    return { valid: false, message: "Review body must be 2000 characters or less." };
  }
  if (data.title && data.title.length > 200) {
    return { valid: false, message: "Review title must be 200 characters or less." };
  }
  return { valid: true };
}
