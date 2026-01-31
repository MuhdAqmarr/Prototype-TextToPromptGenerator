export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export interface RateLimiter {
  check(key: string): RateLimitResult;
  consume(key: string): RateLimitResult;
}

interface BucketState {
  tokens: number;
  lastRefill: number;
}

export class MemoryTokenBucket implements RateLimiter {
  private buckets: Map<string, BucketState> = new Map();
  private maxTokens: number;
  private refillRate: number;
  private refillInterval: number;

  constructor(
    maxTokens: number = 10,
    refillRate: number = 1,
    refillIntervalMs: number = 1000
  ) {
    this.maxTokens = maxTokens;
    this.refillRate = refillRate;
    this.refillInterval = refillIntervalMs;
  }

  private getBucket(key: string): BucketState {
    let bucket = this.buckets.get(key);
    if (!bucket) {
      bucket = { tokens: this.maxTokens, lastRefill: Date.now() };
      this.buckets.set(key, bucket);
    }
    return bucket;
  }

  private refill(bucket: BucketState): void {
    const now = Date.now();
    const elapsed = now - bucket.lastRefill;
    const tokensToAdd = Math.floor(elapsed / this.refillInterval) * this.refillRate;

    if (tokensToAdd > 0) {
      bucket.tokens = Math.min(this.maxTokens, bucket.tokens + tokensToAdd);
      bucket.lastRefill = now;
    }
  }

  check(key: string): RateLimitResult {
    const bucket = this.getBucket(key);
    this.refill(bucket);

    return {
      allowed: bucket.tokens > 0,
      remaining: bucket.tokens,
      resetAt: bucket.lastRefill + this.refillInterval,
    };
  }

  consume(key: string): RateLimitResult {
    const bucket = this.getBucket(key);
    this.refill(bucket);

    if (bucket.tokens > 0) {
      bucket.tokens -= 1;
      return {
        allowed: true,
        remaining: bucket.tokens,
        resetAt: bucket.lastRefill + this.refillInterval,
      };
    }

    return {
      allowed: false,
      remaining: 0,
      resetAt: bucket.lastRefill + this.refillInterval,
    };
  }
}

const globalRateLimiter = new MemoryTokenBucket(20, 2, 1000);

export function getRateLimiter(): RateLimiter {
  return globalRateLimiter;
}
