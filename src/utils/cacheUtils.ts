/**
 * Cache utilities for monitoring and managing prayer times cache
 */

interface CacheStats {
  hits: number;
  misses: number;
  errors: number;
  totalRequests: number;
  hitRate: number;
  lastReset: number;
}

class CacheMonitor {
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    errors: 0,
    totalRequests: 0,
    hitRate: 0,
    lastReset: Date.now(),
  };

  recordHit() {
    this.stats.hits++;
    this.stats.totalRequests++;
    this.updateHitRate();
  }

  recordMiss() {
    this.stats.misses++;
    this.stats.totalRequests++;
    this.updateHitRate();
  }

  recordError() {
    this.stats.errors++;
    this.stats.totalRequests++;
    this.updateHitRate();
  }

  private updateHitRate() {
    this.stats.hitRate = this.stats.totalRequests > 0 ? (this.stats.hits / this.stats.totalRequests) * 100 : 0;
  }

  getStats(): CacheStats {
    return { ...this.stats };
  }

  reset() {
    this.stats = {
      hits: 0,
      misses: 0,
      errors: 0,
      totalRequests: 0,
      hitRate: 0,
      lastReset: Date.now(),
    };
  }

  logStats() {
    console.log('Cache Statistics:', {
      ...this.stats,
      uptime: `${Math.round((Date.now() - this.stats.lastReset) / 1000 / 60)} minutes`,
    });
  }
}

// Global cache monitor instance
export const cacheMonitor = new CacheMonitor();

/**
 * Helper to validate cache key format
 */
export function isValidCacheKey(key: string): boolean {
  return typeof key === 'string' && key.length > 0 && key.length < 1000;
}

/**
 * Helper to estimate cache memory usage
 */
export function estimateCacheSize(cache: Map<string, any>): string {
  let totalSize = 0;

  for (const [key, value] of cache.entries()) {
    // Rough estimation: key size + JSON string size of value
    totalSize += key.length * 2; // UTF-16 characters
    totalSize += JSON.stringify(value).length * 2;
  }

  const sizeInKB = totalSize / 1024;
  const sizeInMB = sizeInKB / 1024;

  if (sizeInMB > 1) {
    return `${sizeInMB.toFixed(2)} MB`;
  } else {
    return `${sizeInKB.toFixed(2)} KB`;
  }
}

/**
 * Cache warming utility for popular locations
 */
export const POPULAR_LOCATIONS = [
  { address: 'Mecca, Saudi Arabia', method: '4' },
  { address: 'Medina, Saudi Arabia', method: '4' },
  { address: 'Cairo, Egypt', method: '5' },
  { address: 'Istanbul, Turkey', method: '9' },
  { address: 'London, UK', method: '2' },
  { address: 'New York, USA', method: '2' },
  { address: 'Dubai, UAE', method: '8' },
  { address: 'Kuala Lumpur, Malaysia', method: '11' },
  { address: 'Jakarta, Indonesia', method: '11' },
  { address: 'Karachi, Pakistan', method: '1' },
];

/**
 * Generate cache key for consistent caching across the app
 */
export function generateLocationCacheKey(
  location: { address?: string; latitude?: number; longitude?: number },
  method: string,
  date?: string,
): string {
  const dateKey = date || new Date().toISOString().split('T')[0];
  const locationKey = location.address || `${location.latitude || 0},${location.longitude || 0}`;
  return `prayer-times:${Buffer.from(locationKey).toString('base64').substring(0, 20)}:${method}:${dateKey}`;
}

/**
 * Cache health check
 */
export function checkCacheHealth(cache: Map<string, any>): {
  isHealthy: boolean;
  issues: string[];
  suggestions: string[];
} {
  const issues: string[] = [];
  const suggestions: string[] = [];

  const size = cache.size;
  const memoryUsage = estimateCacheSize(cache);

  if (size > 1000) {
    issues.push(`Large cache size: ${size} entries`);
    suggestions.push('Consider implementing LRU eviction or reducing TTL');
  }

  if (memoryUsage.includes('MB') && parseFloat(memoryUsage) > 50) {
    issues.push(`High memory usage: ${memoryUsage}`);
    suggestions.push('Consider compressing cache values or reducing data size');
  }

  const stats = cacheMonitor.getStats();
  if (stats.totalRequests > 100 && stats.hitRate < 50) {
    issues.push(`Low hit rate: ${stats.hitRate.toFixed(1)}%`);
    suggestions.push('Check cache key generation and TTL settings');
  }

  return {
    isHealthy: issues.length === 0,
    issues,
    suggestions,
  };
}
