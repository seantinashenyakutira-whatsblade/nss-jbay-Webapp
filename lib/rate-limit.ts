interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

const defaultLimits: Record<string, RateLimitConfig> = {
  auth: { maxRequests: 5, windowMs: 15 * 60 * 1000 },
  contact: { maxRequests: 3, windowMs: 60 * 60 * 1000 },
  bookings: { maxRequests: 10, windowMs: 60 * 60 * 1000 },
  default: { maxRequests: 50, windowMs: 60 * 1000 },
};

function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export function checkRateLimit(
  request: Request,
  category: string = "default"
): { allowed: boolean; remaining: number; resetAt: number } {
  const config = defaultLimits[category] || defaultLimits.default;
  const ip = getClientIp(request);
  const key = `${category}:${ip}`;

  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + config.windowMs });
    return { allowed: true, remaining: config.maxRequests - 1, resetAt: entry?.resetAt || now + config.windowMs };
  }

  if (entry.count >= config.maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  return { allowed: true, remaining: config.maxRequests - entry.count, resetAt: entry.resetAt };
}

export function cleanupExpiredEntries() {
  const now = Date.now();
  store.forEach((entry, key) => {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  });
}

setInterval(cleanupExpiredEntries, 5 * 60 * 1000);
