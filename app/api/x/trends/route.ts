import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { XTrendsService } from '@/lib/services/x-trends';

/**
 * GET /api/x/trends
 * Returns current X.com trends
 */
export async function GET(request: NextRequest) {
  try {
    // Get WOEID parameter (default to worldwide: 1)
    const searchParams = request.nextUrl.searchParams;
    const woeid = parseInt(searchParams.get('woeid') || '1');
    
    // Get X trends
    const trendsData = await XTrendsService.getTrends(woeid);
    
    // Format trends data for UI
    const formattedData = XTrendsService.formatTrendsForUI(trendsData);
    
    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Error fetching trends:', error);
    return NextResponse.json(
      { error: 'Failed to fetch X trends' },
      { status: 500 }
    );
  }
} 