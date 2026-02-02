import { getAnalytics } from 'lib/analytics';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get('key');
  const expected = process.env.ANALYTICS_KEY;

  if (!expected || key !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await getAnalytics();
  if (!data) {
    return NextResponse.json({ error: 'Analytics unavailable (Redis down)' }, { status: 503 });
  }

  return NextResponse.json(data);
}
