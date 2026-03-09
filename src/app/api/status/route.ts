import { getPublicStats } from 'lib/analytics';
import { NextResponse } from 'next/server';

export async function GET() {
  const data = await getPublicStats();
  if (!data) {
    return NextResponse.json({ status: 'degraded' }, { status: 503 });
  }

  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 's-maxage=60, stale-while-revalidate=30',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
