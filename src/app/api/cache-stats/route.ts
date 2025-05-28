import { NextResponse } from 'next/server';
import { cacheMonitor } from '../../../utils/cacheUtils';

export async function GET() {
  try {
    const stats = cacheMonitor.getStats();

    // Calculate some additional metrics
    const uptime = Math.round((Date.now() - stats.lastReset) / 1000 / 60); // minutes
    const missRate = stats.totalRequests > 0 ? (stats.misses / stats.totalRequests) * 100 : 0;
    const errorRate = stats.totalRequests > 0 ? (stats.errors / stats.totalRequests) * 100 : 0;

    const response = {
      ...stats,
      missRate: parseFloat(missRate.toFixed(2)),
      errorRate: parseFloat(errorRate.toFixed(2)),
      uptime: `${uptime} minutes`,
      status: stats.hitRate >= 70 ? 'healthy' : stats.hitRate >= 50 ? 'warning' : 'critical',
      recommendations: generateRecommendations(stats),
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching cache stats:', error);
    return NextResponse.json({ error: 'Failed to fetch cache statistics' }, { status: 500 });
  }
}

function generateRecommendations(stats: any): string[] {
  const recommendations: string[] = [];

  if (stats.totalRequests === 0) {
    recommendations.push('No requests recorded yet');
  } else if (stats.hitRate < 50) {
    recommendations.push('Low cache hit rate - consider reviewing cache key generation');
    recommendations.push('Check if TTL settings are appropriate for your use case');
  } else if (stats.hitRate < 70) {
    recommendations.push('Moderate cache performance - monitor for patterns');
  } else {
    recommendations.push('Good cache performance');
  }

  if (stats.errorRate > 10) {
    recommendations.push('High error rate detected - check external API availability');
  }

  return recommendations;
}

// Optional: Reset endpoint for debugging
export async function DELETE() {
  try {
    cacheMonitor.reset();
    return NextResponse.json({ message: 'Cache statistics reset successfully' });
  } catch (error) {
    console.error('Error resetting cache stats:', error);
    return NextResponse.json({ error: 'Failed to reset cache statistics' }, { status: 500 });
  }
}
