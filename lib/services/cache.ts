import { LRUCache } from 'lru-cache';

interface CacheEntry {
  data: any;
  timestamp: number;
}

class CacheService {
  private static instance: CacheService;
  private cache: LRUCache<string, CacheEntry>;
  private defaultTTL: number = 30 * 60 * 1000; // 30 minutes default TTL

  private constructor() {
    this.cache = new LRUCache({
      max: 500, // Maximum number of items to store
      ttl: this.defaultTTL, // Time to live for each item
      updateAgeOnGet: true, // Update item age on access
      updateAgeOnHas: true, // Update item age on check
    });
  }

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  public set(key: string, data: any, ttl?: number): void {
    const entry: CacheEntry = {
      data,
      timestamp: Date.now(),
    };
    this.cache.set(key, entry, { ttl: ttl || this.defaultTTL });
  }

  public get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    return entry.data;
  }

  public has(key: string): boolean {
    return this.cache.has(key);
  }

  public delete(key: string): void {
    this.cache.delete(key);
  }

  public clear(): void {
    this.cache.clear();
  }

  public invalidatePattern(pattern: RegExp): void {
    const keys = this.cache.keys();
    keys.forEach(key => {
      if (pattern.test(key)) {
        this.delete(key);
      }
    });
  }

  public getRemainingTTL(key: string): number | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    const remaining = this.cache.getRemainingTTL(key);
    return remaining;
  }
}

export const cacheService = CacheService.getInstance(); 