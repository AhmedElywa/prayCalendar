import { getPublicStats } from 'lib/analytics';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const data = await getPublicStats();
  if (!data) {
    return NextResponse.json({ status: 'degraded' }, { status: 503 });
  }

  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'no-store',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
