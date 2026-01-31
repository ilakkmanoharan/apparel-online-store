/**
 * Idempotency Cache for Checkout Sessions
 *
 * Prevents duplicate checkout sessions when clients retry or double-submit.
 * Stores idempotency key -> session mapping with 24-hour TTL.
 *
 * ## Usage
 * Client sends `Idempotency-Key` header or `idempotencyKey` in request body.
 * If the same key is used within 24 hours, the cached session is returned
 * instead of creating a new Stripe session.
 *
 * ## Implementation
 * - In-memory Map for single-instance deployments
 * - For multi-instance deployments, replace with Redis or Firestore
 * - Expired entries are cleaned up on access (lazy cleanup)
 *
 * @see app/api/checkout/stripe/route.ts - Checkout session creation
 */

export interface CachedSession {
  sessionId: string;
  url: string | null;
  createdAt: number;
}

// 24 hours in milliseconds
const DEFAULT_TTL_MS = 24 * 60 * 60 * 1000;

/**
 * In-memory idempotency cache.
 * For production multi-instance deployments, consider using Redis or Firestore.
 */
const cache = new Map<string, CachedSession>();

/**
 * Get TTL from environment or use default (24 hours).
 * Allows configuration for testing or different environments.
 */
function getTTL(): number {
  const envTTL = process.env.CHECKOUT_IDEMPOTENCY_TTL_MS;
  if (envTTL) {
    const parsed = parseInt(envTTL, 10);
    if (!isNaN(parsed) && parsed > 0) {
      return parsed;
    }
  }
  return DEFAULT_TTL_MS;
}

/**
 * Check if a cached entry is expired.
 */
function isExpired(entry: CachedSession): boolean {
  const ttl = getTTL();
  return Date.now() - entry.createdAt > ttl;
}

/**
 * Get a cached session by idempotency key.
 * Returns null if not found or expired.
 * Expired entries are deleted on access (lazy cleanup).
 */
export function getCachedSession(key: string): CachedSession | null {
  const entry = cache.get(key);
  if (!entry) {
    return null;
  }

  if (isExpired(entry)) {
    cache.delete(key);
    return null;
  }

  return entry;
}

/**
 * Store a session in the cache.
 * @param key - Idempotency key from client
 * @param sessionId - Stripe session ID
 * @param url - Stripe checkout URL
 */
export function setCachedSession(
  key: string,
  sessionId: string,
  url: string | null
): void {
  cache.set(key, {
    sessionId,
    url,
    createdAt: Date.now(),
  });
}

/**
 * Clear the entire cache.
 * Primarily for testing purposes.
 */
export function clearCache(): void {
  cache.clear();
}

/**
 * Get the current cache size.
 * Primarily for testing and monitoring.
 */
export function getCacheSize(): number {
  return cache.size;
}

/**
 * Clean up expired entries from the cache.
 * Called periodically or manually for maintenance.
 * Returns the number of entries removed.
 */
export function cleanupExpiredEntries(): number {
  let removed = 0;
  for (const [key, entry] of cache.entries()) {
    if (isExpired(entry)) {
      cache.delete(key);
      removed++;
    }
  }
  return removed;
}
