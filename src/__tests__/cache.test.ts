import { beforeAll, describe, expect, test } from 'bun:test';
import { createClient, type RedisClientType } from 'redis';

const BASE_URL = 'http://localhost:3300';
let redis: RedisClientType;

beforeAll(async () => {
  redis = createClient({ url: 'redis://localhost:6379' });
  await redis.connect();
  // Clear any existing cache keys for clean test runs
  const keys = await redis.keys('pt:*');
  const icsKeys = await redis.keys('ics:*');
  if (keys.length) await redis.del(keys);
  if (icsKeys.length) await redis.del(icsKeys);
});

describe('L1 — Prayer data cache (per month)', () => {
  test('first request creates L1 cache keys for each month', async () => {
    const res = await fetch(`${BASE_URL}/api/prayer-times.ics?address=Cairo,Egypt&method=5&months=2`);
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toContain('text/calendar');

    // Wait briefly for fire-and-forget cache writes
    await new Promise((r) => setTimeout(r, 500));

    const keys = await redis.keys('pt:cairo,egypt:5:0:*');
    expect(keys.length).toBeGreaterThanOrEqual(2);
  });

  test('second identical request reuses L1 cache (no new keys created)', async () => {
    const keysBefore = await redis.keys('pt:cairo,egypt:5:0:*');

    const res = await fetch(`${BASE_URL}/api/prayer-times.ics?address=Cairo,Egypt&method=5&months=2`);
    expect(res.status).toBe(200);

    await new Promise((r) => setTimeout(r, 500));

    const keysAfter = await redis.keys('pt:cairo,egypt:5:0:*');
    expect(keysAfter.length).toBe(keysBefore.length);
  });

  test('requesting more months only creates keys for new months', async () => {
    const keysBefore = await redis.keys('pt:cairo,egypt:5:0:*');

    const res = await fetch(`${BASE_URL}/api/prayer-times.ics?address=Cairo,Egypt&method=5&months=5`);
    expect(res.status).toBe(200);

    await new Promise((r) => setTimeout(r, 500));

    const keysAfter = await redis.keys('pt:cairo,egypt:5:0:*');
    expect(keysAfter.length).toBeGreaterThan(keysBefore.length);
  });

  test('coordinate-based request creates cache keys with lat,lng', async () => {
    const res = await fetch(`${BASE_URL}/api/prayer-times.ics?latitude=51.5074&longitude=-0.1278&method=2&months=1`);
    expect(res.status).toBe(200);

    await new Promise((r) => setTimeout(r, 500));

    const keys = await redis.keys('pt:51.51,-0.13:2:0:*');
    expect(keys.length).toBeGreaterThanOrEqual(1);
  });
});

describe('L2 — ICS string cache', () => {
  test('first request creates an L2 cache entry', async () => {
    // Use a unique param combo to avoid collisions with L1 tests
    const res = await fetch(`${BASE_URL}/api/prayer-times.ics?address=London,UK&method=2&months=1`);
    expect(res.status).toBe(200);
    const body = await res.text();
    expect(body).toContain('BEGIN:VCALENDAR');

    await new Promise((r) => setTimeout(r, 500));

    const icsKeys = await redis.keys('ics:*');
    expect(icsKeys.length).toBeGreaterThanOrEqual(1);
  });

  test('second identical request returns cached ICS (same content)', async () => {
    const res1 = await fetch(`${BASE_URL}/api/prayer-times.ics?address=London,UK&method=2&months=1`);
    const body1 = await res1.text();

    const res2 = await fetch(`${BASE_URL}/api/prayer-times.ics?address=London,UK&method=2&months=1`);
    const body2 = await res2.text();

    expect(body1).toBe(body2);
  });
});

describe('Cache resilience', () => {
  test('valid ICS is returned regardless of cache state', async () => {
    const res = await fetch(`${BASE_URL}/api/prayer-times.ics?address=Tokyo,Japan&method=3&months=1`);
    expect(res.status).toBe(200);
    const body = await res.text();
    expect(body).toContain('BEGIN:VCALENDAR');
    expect(body).toContain('BEGIN:VEVENT');
    expect(body).toContain('END:VCALENDAR');
  });

  test('different method/school produces different cache keys', async () => {
    await fetch(`${BASE_URL}/api/prayer-times.ics?address=Cairo,Egypt&method=5&school=0&months=1`);
    await fetch(`${BASE_URL}/api/prayer-times.ics?address=Cairo,Egypt&method=5&school=1&months=1`);

    await new Promise((r) => setTimeout(r, 500));

    const school0Keys = await redis.keys('pt:cairo,egypt:5:0:*');
    const school1Keys = await redis.keys('pt:cairo,egypt:5:1:*');
    expect(school0Keys.length).toBeGreaterThanOrEqual(1);
    expect(school1Keys.length).toBeGreaterThanOrEqual(1);
  });
});
