# Caching Strategy for PrayerCalendar

This document outlines the multi-layered caching strategy implemented in the PrayerCalendar application to optimize performance and reduce external API calls.

## Overview

The application implements a comprehensive caching strategy with four main layers:

1. **CDN/Edge Caching** via Vercel's edge network
2. **Next.js Data Cache** for external API calls
3. **In-Memory Serverless Cache** for function-level caching
4. **Client-Side Cache** for preview data

## 1. CDN/Edge Caching

### Implementation

- Location: `src/app/api/prayer-times.ics/route.ts`
- Uses `Cache-Control` headers to leverage Vercel's edge network
- Dynamic cache duration based on time of day

### Cache Duration Logic

```typescript
// Near midnight (2 hours): 1 hour cache
// Morning (2-6 hours until midnight): 4 hour cache
// Rest of day: 24 hour cache
```

### Headers

- `s-maxage`: CDN cache duration
- `stale-while-revalidate`: Allows serving stale content while fetching fresh
- `Cache-Tag`: For cache invalidation
- `ETag`: For cache validation
- `Vary: Accept-Encoding`: Handles compression

## 2. Next.js Data Cache

### Implementation

- Location: `src/prayerTimes.ts`
- Uses `fetch()` with `next: { revalidate: 86400 }`
- Caches external AlAdhan API responses for 24 hours

### Benefits

- Automatic cache management by Next.js
- Regional caching in Vercel's data cache
- Built-in cache invalidation and revalidation

## 3. In-Memory Serverless Cache

### Implementation

- Location: `src/prayerTimes.ts`
- Simple `Map<string, CacheEntry>` stored in module scope
- Persists across function invocations in the same instance

### Cache Key Generation

```typescript
const cacheKey = JSON.stringify({
  // All original request parameters including:
  address: params.address || '',
  latitude: params.latitude || 0,
  longitude: params.longitude || 0,
  method: params.method,
  alarm: params.alarm,
  duration: params.duration,
  events: params.events,
  lang: params.lang,
  months: params.months,
  // ... all other prayer calculation parameters
  date: moment().format('YYYY-MM-DD'), // Daily invalidation
});
```

**Important**: The cache key includes ALL request parameters, not just the core prayer calculation parameters. This ensures that requests with different `alarm`, `duration`, `events`, `lang`, or `months` parameters create separate cache entries, since these parameters affect the final ICS calendar output even though they don't change the underlying prayer times data.

### Cache Invalidation

- **TTL**: 24 hours maximum
- **Conservative TTL**: 18 hours to account for timezones
- **Date-based**: Automatically invalidates on new day
- **Periodic cleanup**: 10% chance on each call

## 4. Client-Side Cache

### Implementation

- Location: `src/hooks/useTimingsPreview.ts`
- Caches preview data (today's timings and next prayer)
- 5-minute TTL for responsive UI

### Benefits

- Reduces API calls during user interaction
- Improves perceived performance
- Automatic cleanup of expired entries

## Cache Monitoring

### Cache Statistics API

- Endpoint: `/api/cache-stats`
- Provides hit rate, miss rate, error rate
- Health status and recommendations

### Monitoring Utilities

- Location: `src/utils/cacheUtils.ts`
- Cache performance tracking
- Memory usage estimation
- Health checks and recommendations

### Example Response

```json
{
  "hits": 150,
  "misses": 50,
  "errors": 2,
  "totalRequests": 202,
  "hitRate": 74.26,
  "missRate": 24.75,
  "errorRate": 0.99,
  "uptime": "45 minutes",
  "status": "healthy",
  "recommendations": ["Good cache performance"]
}
```

## Performance Benefits

### Expected Improvements

1. **Reduced External API Calls**: 70-90% reduction in AlAdhan API calls
2. **Faster Response Times**:
   - Cache hit: ~50-100ms
   - Cache miss: ~500-1500ms (depending on AlAdhan API)
3. **Better User Experience**: Immediate responses for repeat requests
4. **Cost Reduction**: Fewer serverless function invocations

### Cache Hit Scenarios

- **Same location, same day**: Memory cache hit (~50ms)
- **Same location, different instance**: Next.js data cache hit (~100ms)
- **Popular location**: CDN cache hit (~50-200ms globally)

## Cache Invalidation Strategy

### Automatic Invalidation

- **Daily**: All caches invalidate based on date
- **Time-based**: Conservative 18-hour TTL prevents stale data
- **Error fallback**: Stale cache served if API fails

### Manual Invalidation

- Reset cache stats: `DELETE /api/cache-stats`
- Function restart: Clears in-memory cache
- Deploy: Clears all caches

## Best Practices

### For Developers

1. **Cache Key Consistency**: Always include location and date in keys
2. **Error Handling**: Provide fallback to stale cache
3. **Monitoring**: Check cache stats regularly
4. **Memory Management**: Implement periodic cleanup

### For Operations

1. **Monitor Cache Health**: Check `/api/cache-stats` regularly
2. **Watch Hit Rates**: Target 70%+ hit rate
3. **Error Monitoring**: Alert on high error rates
4. **Performance Testing**: Verify cache effectiveness

## Configuration

### Environment Variables

No special environment variables required. All caching is configured via:

- Next.js built-in features
- Vercel platform features
- Application-level settings

### Tuning Parameters

- **TTL**: Adjust `CACHE_TTL_MS` in `prayerTimes.ts`
- **Cleanup Frequency**: Modify random cleanup probability
- **Conservative TTL**: Adjust `CONSERVATIVE_TTL_MS` for timezone safety

## Troubleshooting

### Low Hit Rate

1. Check cache key generation logic
2. Verify TTL settings aren't too aggressive
3. Monitor for high cache churn

### High Memory Usage

1. Check cache cleanup frequency
2. Monitor cache size growth
3. Consider implementing LRU eviction

### Stale Data Issues

1. Verify date-based invalidation
2. Check timezone handling
3. Review conservative TTL settings

## Future Improvements

### Potential Enhancements

1. **Redis Cache**: For persistent, shared caching across instances
2. **Edge Config**: For global cache sharing
3. **Compression**: For large cache values
4. **LRU Eviction**: For memory-constrained environments
5. **Cache Warming**: Pre-populate popular locations
6. **Metrics Integration**: Detailed performance monitoring
