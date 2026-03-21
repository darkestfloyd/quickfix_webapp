import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Lazy-initialize so missing env vars only error at runtime (not build time)
let ratelimit: Ratelimit | null = null;

function getRatelimit(): Ratelimit {
  if (!ratelimit) {
    ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(5, "60 s"),
      analytics: false,
      prefix: "qf_quote",
    });
  }
  return ratelimit;
}

export async function checkRateLimit(identifier: string): Promise<{
  success: boolean;
  remaining: number;
  reset: number;
}> {
  try {
    const result = await getRatelimit().limit(identifier);
    return {
      success: result.success,
      remaining: result.remaining,
      reset: result.reset,
    };
  } catch {
    // If Redis is unavailable, fail open (allow the request)
    return { success: true, remaining: 1, reset: 0 };
  }
}
