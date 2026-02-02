import { getRedis } from 'lib/redis';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get('key');
  const expected = process.env.ANALYTICS_KEY;

  if (!expected || key !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const redis = await getRedis();
  if (!redis) {
    return NextResponse.json({ status: 'unavailable', message: 'Redis not connected' }, { status: 503 });
  }

  try {
    const [l1Keys, l2Keys, info] = await Promise.all([redis.keys('pt:*'), redis.keys('ics:*'), redis.info('memory')]);

    // Extract unique locations from L1 keys (pt:location:method:school:month)
    const locations = new Set<string>();
    for (const k of l1Keys) {
      const parts = k.split(':');
      // Location is everything between first and last 3 segments (method:school:month)
      const location = parts.slice(1, -3).join(':');
      if (location) locations.add(location);
    }

    // Parse memory info
    const usedMemory = info.match(/used_memory_human:(\S+)/)?.[1] || 'unknown';

    return NextResponse.json({
      status: 'connected',
      memory: usedMemory,
      l1: {
        keys: l1Keys.length,
        uniqueLocations: locations.size,
        locations: [...locations].sort(),
      },
      l2: {
        keys: l2Keys.length,
      },
      total: l1Keys.length + l2Keys.length,
    });
  } catch (error) {
    return NextResponse.json({ status: 'error', message: (error as Error).message }, { status: 500 });
  }
}
