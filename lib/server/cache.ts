// Simple in-memory cache for frequently accessed data
interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

class MemoryCache {
  private cache = new Map<string, CacheEntry<any>>()

  set<T>(key: string, data: T, ttlMs = 300000): void { // 5 minutes default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
    })
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.data
  }

  delete(key: string): void {
    this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key)
      }
    }
  }
}

export const cache = new MemoryCache()

// Auto cleanup every 10 minutes
if (typeof window === 'undefined') {
  setInterval(() => cache.cleanup(), 600000)
}

// Helper function for cache-or-fetch pattern
export async function cacheOrFetch<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttlMs = 300000
): Promise<T> {
  const cached = cache.get<T>(key)
  if (cached !== null) return cached

  const data = await fetchFn()
  cache.set(key, data, ttlMs)
  return data
}
