import { NextRequest, NextResponse } from "next/server";

// Simple in-memory store for rate limiting
// In production, you should use Redis or a similar distributed store
const rateLimit = new Map<string, { count: number; resetTime: number }>();

interface RateLimitConfig {
  // Maximum number of requests allowed in the time window
  limit: number;
  // Time window in seconds
  windowInSeconds: number;
  // Optional identifier function (defaults to IP address)
  identifierFn?: (req: NextRequest) => string;
}

// Function to get client IP from request
function getClientIp(req: NextRequest): string {
  // Use forwarded IP if available (e.g., when behind a proxy)
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  
  // Try to get IP from request
  // NextRequest doesn't have direct IP property in all Next.js versions
  // so we'll need to extract it from headers or connection
  const remoteAddr = req.headers.get("x-real-ip") || "unknown";
  return remoteAddr;
}

// Default configuration
const defaultConfig: RateLimitConfig = {
  limit: 10,
  windowInSeconds: 60, // 1 minute
  identifierFn: getClientIp,
};

/**
 * Rate limiting middleware for API routes
 */
export function rateLimiter(config?: Partial<RateLimitConfig>) {
  const { limit, windowInSeconds, identifierFn } = {
    ...defaultConfig,
    ...config,
  };

  return async function handleRateLimit(req: NextRequest) {
    // Use the identifier function with fallback
    const identifier = identifierFn ? identifierFn(req) : getClientIp(req);
    const now = Date.now();
    
    // Clean up expired entries occasionally (every ~5% of requests)
    if (Math.random() < 0.05) {
      for (const [key, value] of rateLimit.entries()) {
        if (now > value.resetTime) {
          rateLimit.delete(key);
        }
      }
    }
    
    // Get or create rate limit entry
    const entry = rateLimit.get(identifier) || {
      count: 0,
      resetTime: now + windowInSeconds * 1000,
    };
    
    // Reset if time window has passed
    if (now > entry.resetTime) {
      entry.count = 0;
      entry.resetTime = now + windowInSeconds * 1000;
    }
    
    // Increment count
    entry.count++;
    
    // Update the store
    rateLimit.set(identifier, entry);
    
    // Check if limit is exceeded
    if (entry.count > limit) {
      const resetInSeconds = Math.ceil((entry.resetTime - now) / 1000);
      
      return NextResponse.json(
        { 
          error: "Too many requests", 
          message: "Please try again later" 
        },
        { 
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": resetInSeconds.toString(),
            "Retry-After": resetInSeconds.toString(),
          }
        }
      );
    }
    
    // Continue to the next middleware or API handler
    return null;
  };
} 