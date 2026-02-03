import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { createClient, type RedisClientType } from 'redis';

const BASE_URL = 'http://localhost:3300';
let redis: RedisClientType;

beforeAll(async () => {
  redis = createClient({ url: 'redis://localhost:6379' });
  await redis.connect();
  // Clear all cache keys for clean test runs
  await clearAllCacheKeys();
});

afterAll(async () => {
  await redis.quit();
});

async function clearAllCacheKeys() {
  const ptKeys = await redis.keys('pt:*');
  const icsKeys = await redis.keys('ics:*');
  const geoKeys = await redis.keys('geo:*');
  if (ptKeys.length) await redis.del(ptKeys);
  if (icsKeys.length) await redis.del(icsKeys);
  if (geoKeys.length) await redis.del(geoKeys);
}

async function waitForCache(ms = 500) {
  await new Promise((r) => setTimeout(r, ms));
}

async function getL1Keys(pattern: string): Promise<string[]> {
  return redis.keys(`pt:${pattern}`);
}

async function getL2Keys(): Promise<string[]> {
  return redis.keys('ics:*');
}

// ============================================================================
// L1 CACHE TESTS - Prayer Data Cache
// ============================================================================

describe('L1 Cache - Basic Functionality', () => {
  beforeAll(async () => {
    await clearAllCacheKeys();
  });

  test('first request creates L1 cache keys for each requested month', async () => {
    const res = await fetch(`${BASE_URL}/api/prayer-times.ics?latitude=30.04&longitude=31.24&method=5&months=2`);
    expect(res.status).toBe(200);

    await waitForCache();

    // Key format: pt:location:method:school:shafaq:tune:midnightMode:latAdjMethod:adjustment:yearMonth
    const keys = await getL1Keys('30.04,31.24:5:0:general::0:1:0:*');
    expect(keys.length).toBeGreaterThanOrEqual(2);
  });

  test('second identical request reuses L1 cache (no new keys created)', async () => {
    const keysBefore = await getL1Keys('30.04,31.24:5:0:general::0:1:0:*');

    const res = await fetch(`${BASE_URL}/api/prayer-times.ics?latitude=30.04&longitude=31.24&method=5&months=2`);
    expect(res.status).toBe(200);

    await waitForCache();

    const keysAfter = await getL1Keys('30.04,31.24:5:0:general::0:1:0:*');
    expect(keysAfter.length).toBe(keysBefore.length);
  });

  test('requesting more months only creates keys for new months', async () => {
    const keysBefore = await getL1Keys('30.04,31.24:5:0:general::0:1:0:*');

    const res = await fetch(`${BASE_URL}/api/prayer-times.ics?latitude=30.04&longitude=31.24&method=5&months=5`);
    expect(res.status).toBe(200);

    await waitForCache();

    const keysAfter = await getL1Keys('30.04,31.24:5:0:general::0:1:0:*');
    expect(keysAfter.length).toBeGreaterThan(keysBefore.length);
  });
});

describe('L1 Cache - Method Parameter', () => {
  beforeAll(async () => {
    await clearAllCacheKeys();
  });

  test('different method values produce different cache keys', async () => {
    await fetch(`${BASE_URL}/api/prayer-times.ics?latitude=40.71&longitude=-74.01&method=2&months=1`);
    await fetch(`${BASE_URL}/api/prayer-times.ics?latitude=40.71&longitude=-74.01&method=5&months=1`);

    await waitForCache();

    const method2Keys = await getL1Keys('40.71,-74.01:2:0:*');
    const method5Keys = await getL1Keys('40.71,-74.01:5:0:*');

    expect(method2Keys.length).toBeGreaterThanOrEqual(1);
    expect(method5Keys.length).toBeGreaterThanOrEqual(1);

    // Keys should be completely different
    const intersection = method2Keys.filter((k) => method5Keys.includes(k));
    expect(intersection.length).toBe(0);
  });
});

describe('L1 Cache - School Parameter', () => {
  beforeAll(async () => {
    await clearAllCacheKeys();
  });

  test('different school values produce different cache keys', async () => {
    await fetch(`${BASE_URL}/api/prayer-times.ics?latitude=41.01&longitude=28.98&method=13&school=0&months=1`);
    await fetch(`${BASE_URL}/api/prayer-times.ics?latitude=41.01&longitude=28.98&method=13&school=1&months=1`);

    await waitForCache();

    const school0Keys = await getL1Keys('41.01,28.98:13:0:*');
    const school1Keys = await getL1Keys('41.01,28.98:13:1:*');

    expect(school0Keys.length).toBeGreaterThanOrEqual(1);
    expect(school1Keys.length).toBeGreaterThanOrEqual(1);

    // Keys should be completely different
    const intersection = school0Keys.filter((k) => school1Keys.includes(k));
    expect(intersection.length).toBe(0);
  });
});

describe('L1 Cache - Shafaq Parameter (CRITICAL - Previously Missing)', () => {
  beforeAll(async () => {
    await clearAllCacheKeys();
  });

  test('different shafaq values produce different cache keys', async () => {
    await fetch(`${BASE_URL}/api/prayer-times.ics?latitude=51.51&longitude=-0.13&method=2&shafaq=general&months=1`);
    await fetch(`${BASE_URL}/api/prayer-times.ics?latitude=51.51&longitude=-0.13&method=2&shafaq=ahmer&months=1`);
    await fetch(`${BASE_URL}/api/prayer-times.ics?latitude=51.51&longitude=-0.13&method=2&shafaq=abyad&months=1`);

    await waitForCache();

    const generalKeys = await getL1Keys('51.51,-0.13:2:0:general:*');
    const ahmerKeys = await getL1Keys('51.51,-0.13:2:0:ahmer:*');
    const abyadKeys = await getL1Keys('51.51,-0.13:2:0:abyad:*');

    expect(generalKeys.length).toBeGreaterThanOrEqual(1);
    expect(ahmerKeys.length).toBeGreaterThanOrEqual(1);
    expect(abyadKeys.length).toBeGreaterThanOrEqual(1);
  });

  test('default shafaq (general) matches explicit shafaq=general', async () => {
    await clearAllCacheKeys();

    // Request without shafaq (defaults to general)
    await fetch(`${BASE_URL}/api/prayer-times.ics?latitude=52.52&longitude=13.40&method=3&months=1`);
    await waitForCache();

    const keysBefore = await getL1Keys('52.52,13.40:3:0:general:*');
    expect(keysBefore.length).toBeGreaterThanOrEqual(1);

    // Request with explicit shafaq=general should hit same cache
    await fetch(`${BASE_URL}/api/prayer-times.ics?latitude=52.52&longitude=13.40&method=3&shafaq=general&months=1`);
    await waitForCache();

    const keysAfter = await getL1Keys('52.52,13.40:3:0:general:*');
    expect(keysAfter.length).toBe(keysBefore.length);
  });
});

describe('L1 Cache - Tune Parameter (CRITICAL - Previously Missing)', () => {
  beforeAll(async () => {
    await clearAllCacheKeys();
  });

  test('different tune values produce different cache keys', async () => {
    // Default (no tune)
    await fetch(`${BASE_URL}/api/prayer-times.ics?latitude=35.69&longitude=139.69&method=3&months=1`);
    // Custom tune: Fajr +5, Isha +10
    await fetch(
      `${BASE_URL}/api/prayer-times.ics?latitude=35.69&longitude=139.69&method=3&tune=5,0,0,0,0,0,10,0,0&months=1`,
    );

    await waitForCache();

    const defaultKeys = await getL1Keys('35.69,139.69:3:0:general::*');
    const tunedKeys = await getL1Keys('35.69,139.69:3:0:general:5,0,0,0,0,0,10,0,0:*');

    expect(defaultKeys.length).toBeGreaterThanOrEqual(1);
    expect(tunedKeys.length).toBeGreaterThanOrEqual(1);
  });

  test('same tune value reuses cache', async () => {
    await clearAllCacheKeys();

    await fetch(
      `${BASE_URL}/api/prayer-times.ics?latitude=37.77&longitude=-122.42&method=2&tune=5,5,0,0,0,0,0,0,0&months=1`,
    );
    await waitForCache();

    const keysBefore = await getL1Keys('37.77,-122.42:2:0:general:5,5,0,0,0,0,0,0,0:*');

    await fetch(
      `${BASE_URL}/api/prayer-times.ics?latitude=37.77&longitude=-122.42&method=2&tune=5,5,0,0,0,0,0,0,0&months=1`,
    );
    await waitForCache();

    const keysAfter = await getL1Keys('37.77,-122.42:2:0:general:5,5,0,0,0,0,0,0,0:*');

    expect(keysAfter.length).toBe(keysBefore.length);
  });
});

describe('L1 Cache - MidnightMode Parameter (CRITICAL - Previously Missing)', () => {
  beforeAll(async () => {
    await clearAllCacheKeys();
  });

  test('different midnightMode values produce different cache keys', async () => {
    // Standard midnight (0)
    await fetch(`${BASE_URL}/api/prayer-times.ics?latitude=21.42&longitude=39.83&method=4&midnightMode=0&months=1`);
    // Jafari midnight (1)
    await fetch(`${BASE_URL}/api/prayer-times.ics?latitude=21.42&longitude=39.83&method=4&midnightMode=1&months=1`);

    await waitForCache();

    const mode0Keys = await getL1Keys('21.42,39.83:4:0:general::0:*');
    const mode1Keys = await getL1Keys('21.42,39.83:4:0:general::1:*');

    expect(mode0Keys.length).toBeGreaterThanOrEqual(1);
    expect(mode1Keys.length).toBeGreaterThanOrEqual(1);
  });
});

describe('L1 Cache - LatitudeAdjustmentMethod Parameter (CRITICAL - Previously Missing)', () => {
  beforeAll(async () => {
    await clearAllCacheKeys();
  });

  test('different latitudeAdjustmentMethod values produce different cache keys', async () => {
    // High latitude location (Stockholm)
    await fetch(
      `${BASE_URL}/api/prayer-times.ics?latitude=59.33&longitude=18.07&method=3&latitudeAdjustmentMethod=1&months=1`,
    );
    await fetch(
      `${BASE_URL}/api/prayer-times.ics?latitude=59.33&longitude=18.07&method=3&latitudeAdjustmentMethod=2&months=1`,
    );
    await fetch(
      `${BASE_URL}/api/prayer-times.ics?latitude=59.33&longitude=18.07&method=3&latitudeAdjustmentMethod=3&months=1`,
    );

    await waitForCache();

    const method1Keys = await getL1Keys('59.33,18.07:3:0:general::0:1:*');
    const method2Keys = await getL1Keys('59.33,18.07:3:0:general::0:2:*');
    const method3Keys = await getL1Keys('59.33,18.07:3:0:general::0:3:*');

    expect(method1Keys.length).toBeGreaterThanOrEqual(1);
    expect(method2Keys.length).toBeGreaterThanOrEqual(1);
    expect(method3Keys.length).toBeGreaterThanOrEqual(1);
  });
});

describe('L1 Cache - Adjustment Parameter (CRITICAL - Previously Missing)', () => {
  beforeAll(async () => {
    await clearAllCacheKeys();
  });

  test('different adjustment values produce different cache keys', async () => {
    // No adjustment (default 0)
    await fetch(`${BASE_URL}/api/prayer-times.ics?latitude=24.47&longitude=54.37&method=16&adjustment=0&months=1`);
    // +1 day adjustment
    await fetch(`${BASE_URL}/api/prayer-times.ics?latitude=24.47&longitude=54.37&method=16&adjustment=1&months=1`);
    // -1 day adjustment
    await fetch(`${BASE_URL}/api/prayer-times.ics?latitude=24.47&longitude=54.37&method=16&adjustment=-1&months=1`);

    await waitForCache();

    const adj0Keys = await getL1Keys('24.47,54.37:16:0:general::0:1:0:*');
    const adj1Keys = await getL1Keys('24.47,54.37:16:0:general::0:1:1:*');
    const adjNeg1Keys = await getL1Keys('24.47,54.37:16:0:general::0:1:-1:*');

    expect(adj0Keys.length).toBeGreaterThanOrEqual(1);
    expect(adj1Keys.length).toBeGreaterThanOrEqual(1);
    expect(adjNeg1Keys.length).toBeGreaterThanOrEqual(1);
  });
});

describe('L1 Cache - Location Normalization', () => {
  beforeAll(async () => {
    await clearAllCacheKeys();
  });

  test('coordinates are normalized to 2 decimal places', async () => {
    // These should all normalize to the same location: 51.51,-0.13
    await fetch(`${BASE_URL}/api/prayer-times.ics?latitude=51.5074&longitude=-0.1278&method=2&months=1`);
    await waitForCache();

    const keys = await getL1Keys('51.51,-0.13:2:0:*');
    expect(keys.length).toBeGreaterThanOrEqual(1);
  });

  test('slightly different coordinates within rounding produce same cache key', async () => {
    await clearAllCacheKeys();

    await fetch(`${BASE_URL}/api/prayer-times.ics?latitude=51.5074&longitude=-0.1278&method=2&months=1`);
    await waitForCache();
    const keysBefore = await getL1Keys('51.51,-0.13:2:0:*');

    // Slightly different coords that round to same value
    await fetch(`${BASE_URL}/api/prayer-times.ics?latitude=51.5099&longitude=-0.1299&method=2&months=1`);
    await waitForCache();
    const keysAfter = await getL1Keys('51.51,-0.13:2:0:*');

    expect(keysAfter.length).toBe(keysBefore.length);
  });

  test('address-based requests use resolved coordinates in cache key', async () => {
    await clearAllCacheKeys();

    // First request with address - will resolve to coordinates
    const res = await fetch(`${BASE_URL}/api/prayer-times.ics?address=Mecca,Saudi%20Arabia&method=4&months=1`);
    expect(res.status).toBe(200);
    await waitForCache(1000); // Longer wait for address resolution + cache write

    // Check that a coordinate-based key was created (not address-based)
    // Mecca coordinates vary slightly by geocoder, check for any numeric coordinate key with method 4
    const allKeys = await redis.keys('pt:*:4:0:general:*');
    const coordBasedKeys = allKeys.filter((k) => /^pt:\d+\.\d+,\d+\.\d+:/.test(k));
    expect(coordBasedKeys.length).toBeGreaterThanOrEqual(1);
  });
});

describe('L1 Cache - Combined Parameters', () => {
  beforeAll(async () => {
    await clearAllCacheKeys();
  });

  test('all parameters combined create unique cache keys', async () => {
    // Base request
    await fetch(
      `${BASE_URL}/api/prayer-times.ics?latitude=33.89&longitude=35.50&method=5&school=1&shafaq=ahmer&tune=5,0,0,0,0,0,0,0,0&midnightMode=1&latitudeAdjustmentMethod=2&adjustment=1&months=1`,
    );
    await waitForCache();

    const specificKey = await getL1Keys('33.89,35.50:5:1:ahmer:5,0,0,0,0,0,0,0,0:1:2:1:*');
    expect(specificKey.length).toBeGreaterThanOrEqual(1);

    // Change just one parameter - should create new key
    await fetch(
      `${BASE_URL}/api/prayer-times.ics?latitude=33.89&longitude=35.50&method=5&school=1&shafaq=general&tune=5,0,0,0,0,0,0,0,0&midnightMode=1&latitudeAdjustmentMethod=2&adjustment=1&months=1`,
    );
    await waitForCache();

    const differentShafaqKey = await getL1Keys('33.89,35.50:5:1:general:5,0,0,0,0,0,0,0,0:1:2:1:*');
    expect(differentShafaqKey.length).toBeGreaterThanOrEqual(1);
  });
});

// ============================================================================
// L2 CACHE TESTS - ICS String Cache
// ============================================================================

describe('L2 Cache - Basic Functionality', () => {
  beforeAll(async () => {
    await clearAllCacheKeys();
  });

  test('first request creates an L2 cache entry', async () => {
    const res = await fetch(`${BASE_URL}/api/prayer-times.ics?latitude=48.86&longitude=2.35&method=12&months=1`);
    expect(res.status).toBe(200);
    const body = await res.text();
    expect(body).toContain('BEGIN:VCALENDAR');

    await waitForCache();

    const icsKeys = await getL2Keys();
    expect(icsKeys.length).toBeGreaterThanOrEqual(1);
  });

  test('second identical request returns cached ICS (same content)', async () => {
    const res1 = await fetch(`${BASE_URL}/api/prayer-times.ics?latitude=48.86&longitude=2.35&method=12&months=1`);
    const body1 = await res1.text();

    const res2 = await fetch(`${BASE_URL}/api/prayer-times.ics?latitude=48.86&longitude=2.35&method=12&months=1`);
    const body2 = await res2.text();

    expect(body1).toBe(body2);
  });
});

describe('L2 Cache - UI Parameters (Should Create Different L2 Keys)', () => {
  beforeAll(async () => {
    await clearAllCacheKeys();
  });

  test('different alarm values produce different L2 cache entries', async () => {
    const res1 = await fetch(
      `${BASE_URL}/api/prayer-times.ics?latitude=55.75&longitude=37.62&method=3&alarm=5&months=1`,
    );
    const body1 = await res1.text();

    await waitForCache();
    const keysAfterFirst = await getL2Keys();

    const res2 = await fetch(
      `${BASE_URL}/api/prayer-times.ics?latitude=55.75&longitude=37.62&method=3&alarm=10,15&months=1`,
    );
    const body2 = await res2.text();

    await waitForCache();
    const keysAfterSecond = await getL2Keys();

    expect(keysAfterSecond.length).toBeGreaterThan(keysAfterFirst.length);
    expect(body1).not.toBe(body2);
  });

  test('different duration values produce different L2 cache entries', async () => {
    await clearAllCacheKeys();

    await fetch(`${BASE_URL}/api/prayer-times.ics?latitude=34.05&longitude=-118.24&method=2&duration=25&months=1`);
    await waitForCache();
    const keysAfterFirst = await getL2Keys();

    await fetch(`${BASE_URL}/api/prayer-times.ics?latitude=34.05&longitude=-118.24&method=2&duration=45&months=1`);
    await waitForCache();
    const keysAfterSecond = await getL2Keys();

    expect(keysAfterSecond.length).toBeGreaterThan(keysAfterFirst.length);
  });

  test('different events filter produces different L2 cache entries', async () => {
    await clearAllCacheKeys();

    // All events (default)
    const res1 = await fetch(`${BASE_URL}/api/prayer-times.ics?latitude=25.20&longitude=55.27&method=16&months=1`);
    const body1 = await res1.text();
    await waitForCache();

    // Only Fajr, Dhuhr, Asr, Maghrib, Isha (indices 0,2,3,4,5)
    const res2 = await fetch(
      `${BASE_URL}/api/prayer-times.ics?latitude=25.20&longitude=55.27&method=16&events=0,2,3,4,5&months=1`,
    );
    const body2 = await res2.text();

    expect(body1).toContain('Sunrise');
    expect(body2).not.toContain('Sunrise');
  });

  test('different lang values produce different L2 cache entries', async () => {
    await clearAllCacheKeys();

    const res1 = await fetch(
      `${BASE_URL}/api/prayer-times.ics?latitude=31.95&longitude=35.93&method=4&lang=en&months=1`,
    );
    const body1 = await res1.text();

    const res2 = await fetch(
      `${BASE_URL}/api/prayer-times.ics?latitude=31.95&longitude=35.93&method=4&lang=ar&months=1`,
    );
    const body2 = await res2.text();

    expect(body1).toContain('Fajr');
    expect(body2).toContain('الفجر');
  });

  test('different color values produce different L2 cache entries', async () => {
    await clearAllCacheKeys();

    await fetch(`${BASE_URL}/api/prayer-times.ics?latitude=43.65&longitude=-79.38&method=2&color=%23FF0000&months=1`);
    await waitForCache();
    const keysAfterFirst = await getL2Keys();

    await fetch(`${BASE_URL}/api/prayer-times.ics?latitude=43.65&longitude=-79.38&method=2&color=%2300FF00&months=1`);
    await waitForCache();
    const keysAfterSecond = await getL2Keys();

    expect(keysAfterSecond.length).toBeGreaterThan(keysAfterFirst.length);
  });

  test('traveler mode produces different L2 cache entry', async () => {
    await clearAllCacheKeys();

    const res1 = await fetch(
      `${BASE_URL}/api/prayer-times.ics?latitude=1.35&longitude=103.82&method=3&traveler=false&months=1`,
    );
    const body1 = await res1.text();

    const res2 = await fetch(
      `${BASE_URL}/api/prayer-times.ics?latitude=1.35&longitude=103.82&method=3&traveler=true&months=1`,
    );
    const body2 = await res2.text();

    // Traveler mode adds Qasr indication
    expect(body2).toContain('Qasr');
    expect(body1).not.toContain('Qasr');
  });

  test('jumuah mode produces different L2 cache entry', async () => {
    await clearAllCacheKeys();

    await fetch(`${BASE_URL}/api/prayer-times.ics?latitude=39.90&longitude=116.40&method=3&jumuah=false&months=1`);
    await waitForCache();
    const keysAfterFirst = await getL2Keys();

    await fetch(`${BASE_URL}/api/prayer-times.ics?latitude=39.90&longitude=116.40&method=3&jumuah=true&months=1`);
    await waitForCache();
    const keysAfterSecond = await getL2Keys();

    expect(keysAfterSecond.length).toBeGreaterThan(keysAfterFirst.length);
  });

  test('ramadan mode produces different L2 cache entry', async () => {
    await clearAllCacheKeys();

    await fetch(`${BASE_URL}/api/prayer-times.ics?latitude=36.82&longitude=10.17&method=5&ramadanMode=false&months=1`);
    await waitForCache();
    const keysAfterFirst = await getL2Keys();

    await fetch(`${BASE_URL}/api/prayer-times.ics?latitude=36.82&longitude=10.17&method=5&ramadanMode=true&months=1`);
    await waitForCache();
    const keysAfterSecond = await getL2Keys();

    expect(keysAfterSecond.length).toBeGreaterThan(keysAfterFirst.length);
  });

  test('qibla mode produces different L2 cache entry', async () => {
    await clearAllCacheKeys();

    const res1 = await fetch(
      `${BASE_URL}/api/prayer-times.ics?latitude=6.93&longitude=79.85&method=8&qibla=false&months=1`,
    );
    const body1 = await res1.text();

    const res2 = await fetch(
      `${BASE_URL}/api/prayer-times.ics?latitude=6.93&longitude=79.85&method=8&qibla=true&months=1`,
    );
    const body2 = await res2.text();

    expect(body2).toContain('Qibla');
    expect(body1).not.toContain('Qibla');
  });

  test('dua mode produces different L2 cache entry', async () => {
    await clearAllCacheKeys();

    await fetch(`${BASE_URL}/api/prayer-times.ics?latitude=23.81&longitude=90.41&method=1&dua=false&months=1`);
    await waitForCache();
    const keysAfterFirst = await getL2Keys();

    await fetch(`${BASE_URL}/api/prayer-times.ics?latitude=23.81&longitude=90.41&method=1&dua=true&months=1`);
    await waitForCache();
    const keysAfterSecond = await getL2Keys();

    expect(keysAfterSecond.length).toBeGreaterThan(keysAfterFirst.length);
  });

  test('iqama offsets produce different L2 cache entry', async () => {
    await clearAllCacheKeys();

    await fetch(`${BASE_URL}/api/prayer-times.ics?latitude=41.38&longitude=2.17&method=12&months=1`);
    await waitForCache();
    const keysAfterFirst = await getL2Keys();

    await fetch(
      `${BASE_URL}/api/prayer-times.ics?latitude=41.38&longitude=2.17&method=12&iqama=20,0,15,15,5,20,0&months=1`,
    );
    await waitForCache();
    const keysAfterSecond = await getL2Keys();

    expect(keysAfterSecond.length).toBeGreaterThan(keysAfterFirst.length);
  });

  test('hijri display mode produces different L2 cache entry', async () => {
    await clearAllCacheKeys();

    const res1 = await fetch(
      `${BASE_URL}/api/prayer-times.ics?latitude=29.98&longitude=31.13&method=5&hijri=none&months=1`,
    );
    const body1 = await res1.text();

    const res2 = await fetch(
      `${BASE_URL}/api/prayer-times.ics?latitude=29.98&longitude=31.13&method=5&hijri=title&months=1`,
    );
    const body2 = await res2.text();

    // hijri=title includes Hijri date in event title
    expect(body1).not.toMatch(/Fajr \(\d+/);
    expect(body2).toMatch(/Fajr \(\d+/);
  });

  test('different months count produces different L2 cache entry', async () => {
    await clearAllCacheKeys();

    const res1 = await fetch(`${BASE_URL}/api/prayer-times.ics?latitude=19.43&longitude=-99.13&method=3&months=1`);
    const body1 = await res1.text();

    const res2 = await fetch(`${BASE_URL}/api/prayer-times.ics?latitude=19.43&longitude=-99.13&method=3&months=6`);
    const body2 = await res2.text();

    // More months = more events
    const eventCount1 = (body1.match(/BEGIN:VEVENT/g) || []).length;
    const eventCount2 = (body2.match(/BEGIN:VEVENT/g) || []).length;

    expect(eventCount2).toBeGreaterThan(eventCount1);
  });
});

describe('L2 Cache - Same L1 Data, Different L2 Output', () => {
  beforeAll(async () => {
    await clearAllCacheKeys();
  });

  test('UI-only param changes reuse L1 cache but create new L2 cache', async () => {
    // First request - creates both L1 and L2
    await fetch(`${BASE_URL}/api/prayer-times.ics?latitude=45.42&longitude=-75.69&method=2&alarm=5&months=1`);
    await waitForCache();

    const l1KeysAfterFirst = await getL1Keys('45.42,-75.69:2:0:*');
    const l2KeysAfterFirst = await getL2Keys();

    // Second request - same L1 params, different L2 param (alarm)
    // Should reuse L1 but create new L2
    await fetch(`${BASE_URL}/api/prayer-times.ics?latitude=45.42&longitude=-75.69&method=2&alarm=10&months=1`);
    await waitForCache();

    const l1KeysAfterSecond = await getL1Keys('45.42,-75.69:2:0:*');
    const l2KeysAfterSecond = await getL2Keys();

    // L1 should not have new keys (same prayer data)
    expect(l1KeysAfterSecond.length).toBe(l1KeysAfterFirst.length);

    // L2 should have new key (different alarm)
    expect(l2KeysAfterSecond.length).toBeGreaterThan(l2KeysAfterFirst.length);
  });
});

// ============================================================================
// CACHE ISOLATION TESTS - Verify No Cross-Contamination
// ============================================================================

describe('Cache Isolation - User Data Protection', () => {
  beforeAll(async () => {
    await clearAllCacheKeys();
  });

  test('users with different shafaq get different prayer times', async () => {
    // User A with shafaq=general
    const res1 = await fetch(
      `${BASE_URL}/api/prayer-times.ics?latitude=51.51&longitude=-0.13&method=2&shafaq=general&months=1`,
    );
    const body1 = await res1.text();

    // User B with shafaq=abyad (should get different Isha time)
    const res2 = await fetch(
      `${BASE_URL}/api/prayer-times.ics?latitude=51.51&longitude=-0.13&method=2&shafaq=abyad&months=1`,
    );
    const body2 = await res2.text();

    // The ICS content should be different (different Isha calculations)
    expect(body1).not.toBe(body2);
  });

  test('users with different tune offsets get different prayer times', async () => {
    // User A with no tune
    const res1 = await fetch(`${BASE_URL}/api/prayer-times.ics?latitude=40.71&longitude=-74.01&method=2&months=1`);
    const body1 = await res1.text();

    // User B with tune offset for Fajr (+10 minutes)
    const res2 = await fetch(
      `${BASE_URL}/api/prayer-times.ics?latitude=40.71&longitude=-74.01&method=2&tune=10,0,0,0,0,0,0,0,0&months=1`,
    );
    const body2 = await res2.text();

    // The ICS content should be different
    expect(body1).not.toBe(body2);
  });

  test('users with different adjustment values get different prayer times', async () => {
    // User A with no adjustment
    const res1 = await fetch(
      `${BASE_URL}/api/prayer-times.ics?latitude=24.47&longitude=54.37&method=16&adjustment=0&months=1`,
    );
    const body1 = await res1.text();

    // User B with +1 adjustment
    const res2 = await fetch(
      `${BASE_URL}/api/prayer-times.ics?latitude=24.47&longitude=54.37&method=16&adjustment=1&months=1`,
    );
    const body2 = await res2.text();

    // The ICS content should be different
    expect(body1).not.toBe(body2);
  });
});

// ============================================================================
// CACHE KEY FORMAT VERIFICATION
// ============================================================================

describe('Cache Key Format Verification', () => {
  beforeAll(async () => {
    await clearAllCacheKeys();
  });

  test('L1 key contains all required parameters in correct order', async () => {
    await fetch(
      `${BASE_URL}/api/prayer-times.ics?latitude=35.68&longitude=139.76&method=3&school=1&shafaq=ahmer&tune=5,5,0,0,0,0,0,0,0&midnightMode=1&latitudeAdjustmentMethod=2&adjustment=1&months=1`,
    );
    await waitForCache();

    const allKeys = await redis.keys('pt:*');
    const matchingKey = allKeys.find((k) => k.includes('35.68,139.76'));

    expect(matchingKey).toBeDefined();

    // Verify key format: pt:location:method:school:shafaq:tune:midnightMode:latAdjMethod:adjustment:yearMonth
    const parts = matchingKey!.split(':');
    expect(parts[0]).toBe('pt');
    expect(parts[1]).toBe('35.68,139.76'); // location
    expect(parts[2]).toBe('3'); // method
    expect(parts[3]).toBe('1'); // school
    expect(parts[4]).toBe('ahmer'); // shafaq
    expect(parts[5]).toBe('5,5,0,0,0,0,0,0,0'); // tune
    expect(parts[6]).toBe('1'); // midnightMode
    expect(parts[7]).toBe('2'); // latitudeAdjustmentMethod
    expect(parts[8]).toBe('1'); // adjustment
    expect(parts[9]).toMatch(/^\d{4}-\d{2}$/); // yearMonth (YYYY-MM)
  });

  test('L2 key uses hash format', async () => {
    await clearAllCacheKeys();

    await fetch(`${BASE_URL}/api/prayer-times.ics?latitude=48.86&longitude=2.35&method=12&months=1`);
    await waitForCache();

    const icsKeys = await getL2Keys();
    expect(icsKeys.length).toBeGreaterThanOrEqual(1);

    // L2 key format: ics:<16-char-hash>:YYYY-MM
    const keyParts = icsKeys[0].split(':');
    expect(keyParts[0]).toBe('ics');
    expect(keyParts[1]).toMatch(/^[a-f0-9]{16}$/); // 16 char hex hash
    expect(keyParts[2]).toMatch(/^\d{4}-\d{2}$/); // YYYY-MM
  });
});

// ============================================================================
// EDGE CASES AND ERROR HANDLING
// ============================================================================

describe('Edge Cases', () => {
  beforeAll(async () => {
    await clearAllCacheKeys();
  });

  test('empty tune is equivalent to no tune parameter', async () => {
    await clearAllCacheKeys();

    // Request without tune
    await fetch(`${BASE_URL}/api/prayer-times.ics?latitude=52.37&longitude=4.90&method=3&months=1`);
    await waitForCache();
    const keysBefore = await getL1Keys('52.37,4.90:3:0:general::*');

    // Request with empty tune should hit same cache
    await fetch(`${BASE_URL}/api/prayer-times.ics?latitude=52.37&longitude=4.90&method=3&tune=&months=1`);
    await waitForCache();
    const keysAfter = await getL1Keys('52.37,4.90:3:0:general::*');

    expect(keysAfter.length).toBe(keysBefore.length);
  });

  test('default parameter values match explicit defaults', async () => {
    await clearAllCacheKeys();

    // Request with all defaults implicit
    await fetch(`${BASE_URL}/api/prayer-times.ics?latitude=55.68&longitude=12.57&method=3&months=1`);
    await waitForCache();
    const keysImplicit = await getL1Keys('55.68,12.57:3:0:general::0:1:0:*');

    // Request with all defaults explicit
    await fetch(
      `${BASE_URL}/api/prayer-times.ics?latitude=55.68&longitude=12.57&method=3&school=0&shafaq=general&midnightMode=0&latitudeAdjustmentMethod=1&adjustment=0&months=1`,
    );
    await waitForCache();
    const keysExplicit = await getL1Keys('55.68,12.57:3:0:general::0:1:0:*');

    // Should be same cache keys
    expect(keysExplicit.length).toBe(keysImplicit.length);
  });

  test('valid ICS is returned regardless of cache state', async () => {
    await clearAllCacheKeys();

    const res = await fetch(`${BASE_URL}/api/prayer-times.ics?latitude=-33.87&longitude=151.21&method=3&months=1`);
    expect(res.status).toBe(200);

    const body = await res.text();
    expect(body).toContain('BEGIN:VCALENDAR');
    expect(body).toContain('BEGIN:VEVENT');
    expect(body).toContain('END:VCALENDAR');
  });

  test('invalid method defaults gracefully', async () => {
    const res = await fetch(`${BASE_URL}/api/prayer-times.ics?latitude=50.08&longitude=14.44&method=999&months=1`);
    expect(res.status).toBe(200);

    const body = await res.text();
    expect(body).toContain('BEGIN:VCALENDAR');
  });

  test('missing location returns error', async () => {
    const res = await fetch(`${BASE_URL}/api/prayer-times.ics?method=3&months=1`);
    expect(res.status).toBe(400);
  });
});

// ============================================================================
// GEO CACHE TESTS
// ============================================================================

describe('Geo Cache - Address Resolution', () => {
  beforeAll(async () => {
    await clearAllCacheKeys();
  });

  test('address resolution is cached for subsequent requests', async () => {
    // First request with address
    await fetch(`${BASE_URL}/api/prayer-times.ics?address=Paris,France&method=12&months=1`);
    await waitForCache();

    // Check geo cache was created
    const geoKeys = await redis.keys('geo:*');
    const parisKey = geoKeys.find((k) => k.includes('paris'));
    expect(parisKey).toBeDefined();

    // Verify cached coordinates
    const coords = await redis.get(parisKey!);
    expect(coords).toMatch(/^\d+\.\d+,\d+\.\d+$/);
  });

  test('address normalization handles case and whitespace', async () => {
    await clearAllCacheKeys();

    // Request with different case/whitespace
    await fetch(`${BASE_URL}/api/prayer-times.ics?address=LONDON,UK&method=2&months=1`);
    await waitForCache();

    const geoKeys = await redis.keys('geo:london*');
    expect(geoKeys.length).toBeGreaterThanOrEqual(1);
  });
});

// ============================================================================
// REGRESSION TESTS - Previously Reported Bugs
// ============================================================================

describe('Regression Tests - Previously Reported Issues', () => {
  beforeAll(async () => {
    await clearAllCacheKeys();
  });

  test('REGRESSION: Different shafaq users should NOT share cache (was causing wrong Isha times)', async () => {
    // This was the main bug - users with different shafaq were getting cached data from other users

    // Clear and setup
    await clearAllCacheKeys();

    // User A requests with shafaq=general
    const res1 = await fetch(
      `${BASE_URL}/api/prayer-times.ics?latitude=51.51&longitude=-0.13&method=2&shafaq=general&months=1`,
    );
    expect(res1.status).toBe(200);
    const body1 = await res1.text();

    await waitForCache(1000); // Longer wait for cache write

    // User B requests with shafaq=abyad - should NOT get User A's cached data
    const res2 = await fetch(
      `${BASE_URL}/api/prayer-times.ics?latitude=51.51&longitude=-0.13&method=2&shafaq=abyad&months=1`,
    );
    expect(res2.status).toBe(200);
    const body2 = await res2.text();

    await waitForCache(1000); // Wait for second cache write

    // Verify they got different ICS content
    expect(body1).not.toBe(body2);

    // Verify separate L1 cache keys exist
    const generalKeys = await getL1Keys('51.51,-0.13:2:0:general:*');
    const abyadKeys = await getL1Keys('51.51,-0.13:2:0:abyad:*');

    expect(generalKeys.length).toBeGreaterThanOrEqual(1);
    expect(abyadKeys.length).toBeGreaterThanOrEqual(1);
  });

  test('REGRESSION: Different tune users should NOT share cache (was causing wrong adjusted times)', async () => {
    await clearAllCacheKeys();

    // User A with default tune
    const res1 = await fetch(`${BASE_URL}/api/prayer-times.ics?latitude=30.04&longitude=31.24&method=5&months=1`);

    // User B with custom tune
    const res2 = await fetch(
      `${BASE_URL}/api/prayer-times.ics?latitude=30.04&longitude=31.24&method=5&tune=10,0,0,0,0,0,10,0,0&months=1`,
    );

    const body1 = await res1.text();
    const body2 = await res2.text();

    expect(body1).not.toBe(body2);
  });

  test('REGRESSION: Different adjustment users should NOT share cache', async () => {
    await clearAllCacheKeys();

    const res1 = await fetch(
      `${BASE_URL}/api/prayer-times.ics?latitude=21.42&longitude=39.83&method=4&adjustment=0&months=1`,
    );
    const res2 = await fetch(
      `${BASE_URL}/api/prayer-times.ics?latitude=21.42&longitude=39.83&method=4&adjustment=1&months=1`,
    );

    const body1 = await res1.text();
    const body2 = await res2.text();

    expect(body1).not.toBe(body2);
  });
});
