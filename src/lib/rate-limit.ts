import { NextResponse } from "next/server";

type RateLimitRecord = {
  count: number;
  resetTime: number;
};

// In-memory store for rate limiting with automatic cleanup
const ipStore = new Map<string, RateLimitRecord>();

// Clean up stale entries every 5 minutes to prevent memory leaks
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of ipStore.entries()) {
      if (now > value.resetTime) {
        ipStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  const cfIp = req.headers.get("cf-connecting-ip");
  if (cfIp) {
    return cfIp.trim();
  }
  return "127.0.0.1";
}

export interface RateLimitConfig {
  maxRequests: number; // Maximum allowed requests
  windowMs: number;    // Time window in milliseconds
  identifier?: string; // Optional namespace for the endpoint
}

export function rateLimit(
  req: Request,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetInSec: number; errorResponse?: NextResponse } {
  const ip = getClientIp(req);
  const key = `${config.identifier || "global"}:${ip}`;
  const now = Date.now();

  const record = ipStore.get(key);

  if (!record || now > record.resetTime) {
    // New window
    ipStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetInSec: Math.ceil(config.windowMs / 1000),
    };
  }

  if (record.count >= config.maxRequests) {
    const resetInSec = Math.ceil((record.resetTime - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetInSec,
      errorResponse: NextResponse.json(
        {
          error: "Too many requests. Please slow down and try again later.",
          retryAfter: resetInSec,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(resetInSec),
            "X-RateLimit-Limit": String(config.maxRequests),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(Math.ceil(record.resetTime / 1000)),
          },
        }
      ),
    };
  }

  record.count += 1;
  return {
    allowed: true,
    remaining: config.maxRequests - record.count,
    resetInSec: Math.ceil((record.resetTime - now) / 1000),
  };
}
