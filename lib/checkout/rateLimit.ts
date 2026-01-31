/**
 * Rate Limiter for Checkout API
 *
 * Prevents abuse by limiting checkout session creation attempts per client.
 * Uses fixed-window rate limiting with configurable limits per IP/userId.
 *
 * ## Default Limits
 * - 10 requests per minute per IP (for all requests)
 * - 5 requests per minute per userId (for authenticated users)
 *
 * ## Implementation
 * - In-memory Map for single-instance deployments
 * - Fixed-window algorithm (resets every window period)
 * - For multi-instance deployments, replace with Redis
 *
 * @see app/api/checkout/stripe/route.ts - Checkout session creation
 */

export interface RateLimitConfig {
  /** Maximum requests allowed per window */
  maxRequests: number;
  /** Window duration in milliseconds */
  windowMs: number;
}

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

// Default: 10 requests per minute per IP
const DEFAULT_IP_LIMIT: RateLimitConfig = {
  maxRequests: 10,
  windowMs: 60 * 1000, // 1 minute
};

// Default: 5 requests per minute per userId (stricter for authenticated)
const DEFAULT_USER_LIMIT: RateLimitConfig = {
  maxRequests: 5,
  windowMs: 60 * 1000, // 1 minute
};

// Separate stores for IP and user rate limits
const ipStore = new Map<string, RateLimitEntry>();
const userStore = new Map<string, RateLimitEntry>();

/**
 * Get rate limit config from environment or use defaults.
 */
function getIpLimitConfig(): RateLimitConfig {
  const maxRequests = process.env.CHECKOUT_RATE_LIMIT_IP_MAX
    ? parseInt(process.env.CHECKOUT_RATE_LIMIT_IP_MAX, 10)
    : DEFAULT_IP_LIMIT.maxRequests;
  const windowMs = process.env.CHECKOUT_RATE_LIMIT_WINDOW_MS
    ? parseInt(process.env.CHECKOUT_RATE_LIMIT_WINDOW_MS, 10)
    : DEFAULT_IP_LIMIT.windowMs;
  return { maxRequests, windowMs };
}

function getUserLimitConfig(): RateLimitConfig {
  const maxRequests = process.env.CHECKOUT_RATE_LIMIT_USER_MAX
    ? parseInt(process.env.CHECKOUT_RATE_LIMIT_USER_MAX, 10)
    : DEFAULT_USER_LIMIT.maxRequests;
  const windowMs = process.env.CHECKOUT_RATE_LIMIT_WINDOW_MS
    ? parseInt(process.env.CHECKOUT_RATE_LIMIT_WINDOW_MS, 10)
    : DEFAULT_USER_LIMIT.windowMs;
  return { maxRequests, windowMs };
}

/**
 * Check if a key is rate limited and increment counter.
 * @param store - The rate limit store (ipStore or userStore)
 * @param key - The rate limit key (IP or userId)
 * @param config - Rate limit configuration
 * @returns Object with isLimited flag and retry time
 */
function checkAndIncrement(
  store: Map<string, RateLimitEntry>,
  key: string,
  config: RateLimitConfig
): { isLimited: boolean; retryAfterSeconds: number; remaining: number } {
  const now = Date.now();
  const entry = store.get(key);

  // Check if we're in a new window
  if (!entry || now - entry.windowStart >= config.windowMs) {
    // New window - reset count
    store.set(key, { count: 1, windowStart: now });
    return {
      isLimited: false,
      retryAfterSeconds: 0,
      remaining: config.maxRequests - 1,
    };
  }

  // Same window - check limit
  if (entry.count >= config.maxRequests) {
    // Calculate time until window resets
    const windowEnd = entry.windowStart + config.windowMs;
    const retryAfterMs = windowEnd - now;
    const retryAfterSeconds = Math.ceil(retryAfterMs / 1000);

    return {
      isLimited: true,
      retryAfterSeconds,
      remaining: 0,
    };
  }

  // Under limit - increment
  entry.count++;
  return {
    isLimited: false,
    retryAfterSeconds: 0,
    remaining: config.maxRequests - entry.count,
  };
}

export interface RateLimitResult {
  /** Whether the request should be blocked */
  isLimited: boolean;
  /** Seconds until rate limit resets (for Retry-After header) */
  retryAfterSeconds: number;
  /** Which limit was hit: 'ip' or 'user' */
  limitType?: "ip" | "user";
  /** Remaining requests in current window */
  remaining: number;
}

/**
 * Check rate limits for a checkout request.
 * Checks both IP and userId limits; blocked if either is exceeded.
 *
 * @param ip - Client IP address
 * @param userId - Optional user ID for authenticated requests
 * @returns Rate limit result with isLimited flag
 */
export function checkRateLimit(
  ip: string,
  userId?: string | null
): RateLimitResult {
  // Always check IP limit
  const ipConfig = getIpLimitConfig();
  const ipResult = checkAndIncrement(ipStore, ip, ipConfig);

  if (ipResult.isLimited) {
    return {
      isLimited: true,
      retryAfterSeconds: ipResult.retryAfterSeconds,
      limitType: "ip",
      remaining: 0,
    };
  }

  // Check user limit if authenticated
  if (userId && userId !== "guest") {
    const userConfig = getUserLimitConfig();
    const userResult = checkAndIncrement(userStore, userId, userConfig);

    if (userResult.isLimited) {
      return {
        isLimited: true,
        retryAfterSeconds: userResult.retryAfterSeconds,
        limitType: "user",
        remaining: 0,
      };
    }

    // Return the lower remaining count
    return {
      isLimited: false,
      retryAfterSeconds: 0,
      remaining: Math.min(ipResult.remaining, userResult.remaining),
    };
  }

  return {
    isLimited: false,
    retryAfterSeconds: 0,
    remaining: ipResult.remaining,
  };
}

/**
 * Get client IP from request headers.
 * Checks x-forwarded-for (proxy), x-real-ip, then falls back to a default.
 */
export function getClientIp(headers: Headers): string {
  // x-forwarded-for may contain multiple IPs; take the first (client)
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const firstIp = forwarded.split(",")[0].trim();
    if (firstIp) return firstIp;
  }

  // Try x-real-ip
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp;

  // Fallback for local development
  return "127.0.0.1";
}

/**
 * Clear all rate limit stores.
 * Primarily for testing purposes.
 */
export function clearRateLimitStores(): void {
  ipStore.clear();
  userStore.clear();
}

/**
 * Get current store sizes.
 * Primarily for testing and monitoring.
 */
export function getRateLimitStoreSizes(): { ip: number; user: number } {
  return {
    ip: ipStore.size,
    user: userStore.size,
  };
}

/**
 * Clean up expired entries from rate limit stores.
 * Called periodically or manually for maintenance.
 */
export function cleanupExpiredEntries(): number {
  const now = Date.now();
  const ipConfig = getIpLimitConfig();
  const userConfig = getUserLimitConfig();
  let removed = 0;

  for (const [key, entry] of ipStore.entries()) {
    if (now - entry.windowStart >= ipConfig.windowMs) {
      ipStore.delete(key);
      removed++;
    }
  }

  for (const [key, entry] of userStore.entries()) {
    if (now - entry.windowStart >= userConfig.windowMs) {
      userStore.delete(key);
      removed++;
    }
  }

  return removed;
}
