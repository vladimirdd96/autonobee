import { NextRequest, NextResponse } from 'next/server';
import xApiAuth from '@/app/api/auth/x/utils/XApiAuth';

// Debug logger
const logDebug = (message: string, data?: any) => {
  console.log(`[X API PUBLIC DEBUG] ${message}`, data ? data : '');
};

export async function GET(request: NextRequest) {
  try {
    // First, find closest location using trends/closest
    const closestEndpoint = 'trends/closest?lat=37.7749&long=-122.4194'; // Default to San Francisco
    logDebug(`Finding closest location for trends with endpoint: ${closestEndpoint}`);
    
    // Use app-only auth for this request (userId is null)
    const closestData = await xApiAuth.makeAuthenticatedRequest(closestEndpoint, 'GET', null, null);
    logDebug('Closest location data received', closestData);
    
    if (!closestData || !Array.isArray(closestData) || closestData.length === 0) {
      throw new Error('No location data found');
    }
    
    // Get the WOEID (Where On Earth ID) from the first result
    const woeid = closestData[0]?.woeid || 1; // Default to worldwide (1) if not found
    
    // Now fetch trends for this location
    const trendsEndpoint = `trends/place?id=${woeid}`;
    logDebug(`Fetching trends with endpoint: ${trendsEndpoint}`);
    
    const trendsData = await xApiAuth.makeAuthenticatedRequest(trendsEndpoint, 'GET', null, null);
    logDebug('Trends data received', trendsData);
    
    // Transform the data to match our expected format
    const transformedData = {
      data: (trendsData?.[0]?.trends || []).slice(0, 10).map((trend: any) => ({
        trend_name: trend.name,
        category: 'Trending', // Default category
        post_count: parseInt(trend.tweet_volume || '1000'), // Fallback to 1000 if no volume
        trending_since: new Date().toISOString() // Current time as fallback
      })),
      location: closestData[0]?.name || 'Global'
    };
    
    return NextResponse.json(transformedData);
  } catch (error: any) {
    console.error('Error fetching public trends:', error);
    
    return NextResponse.json({
      error: error.code || 'FETCH_ERROR',
      message: error.message || 'Failed to fetch public trends'
    }, { status: 500 });
  }
} 