import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

interface TrendData {
  name: string;
  url?: string;
  tweet_volume?: number | null;
  category: string;
  trend_name?: string;
  tweet_count?: number;
}

interface LocationData {
  name: string;
  woeid: number;
}

interface TrendsResponse {
  trends: TrendData[];
  asOf: string;
  location: LocationData;
}

// Mark route as dynamic
export const dynamic = 'force-dynamic';

/**
 * GET /api/x/trends/public
 * Returns public X.com trends
 */
export async function GET(request: NextRequest) {
  try {
    // Get WOEID parameter (default to worldwide: 1)
    const searchParams = request.nextUrl.searchParams;
    const woeid = parseInt(searchParams.get('woeid') || '1');
    
    // Prepare URL for the X API v2 endpoint
    const url = `https://api.x.com/2/trends/by/woeid/${woeid}`;
    
    // Get bearer token for authentication
    const bearerToken = process.env.X_BEARER_TOKEN || process.env.NEXT_PUBLIC_BEARER_TOKEN;
    
    if (!bearerToken) {
      console.error('Bearer token is not set');
      return NextResponse.json(
        { error: 'API configuration error - Bearer token missing' },
        { status: 500 }
      );
    }
    
    // Make request to X.com API v2 with Bearer token
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
      }
    });
    
    // Format trends data for UI
    const formattedData = formatTrendsForUI(response.data);
    
    return NextResponse.json(formattedData);
  } catch (error: any) {
    console.error('Error fetching public trends:', error);
    
    // Return detailed error information
    const errorDetail = error.response?.data || error.message || 'Unknown error';
    console.error('Error detail:', errorDetail);
    
    return NextResponse.json(
      { error: 'Failed to fetch X trends', detail: errorDetail },
      { status: error.response?.status || 500 }
    );
  }
}

/**
 * Format trends data for UI consumption
 */
function formatTrendsForUI(trendsData: any): TrendsResponse {
  if (!trendsData || !trendsData.data) {
    return {
      trends: [],
      asOf: new Date().toISOString(),
      location: {
        name: 'Worldwide',
        woeid: 1
      }
    };
  }
  
  // Extract location info - in v2, we don't get location info directly
  const location = {
    name: getLocationNameFromWoeid(trendsData.woeid) || 'Worldwide',
    woeid: trendsData.woeid || 1
  };
  
  // For worldwide trends (woeid=1), always use "Worldwide" as name
  if (location.woeid === 1) {
    location.name = 'Worldwide';
  }
  
  // Map trends to a more usable format with categories - V2 API has a different structure
  const trends = trendsData.data.map((trend: any) => ({
    name: trend.trend_name,
    tweet_volume: trend.tweet_count,
    category: categorizeTrend(trend.trend_name)
  }));
  
  return {
    trends,
    asOf: new Date().toISOString(), // V2 API doesn't provide as_of time
    location
  };
}

/**
 * Map WOEID to location name
 */
function getLocationNameFromWoeid(woeid: number): string {
  const locations: Record<number, string> = {
    1: 'Worldwide',
    23424975: 'United Kingdom',
    23424977: 'United States',
    2459115: 'New York',
    2442047: 'Los Angeles',
    44418: 'London',
    615702: 'Paris',
    766273: 'Toronto'
  };
  
  return locations[woeid] || 'Unknown';
}

/**
 * Simple categorization of trends based on name
 */
function categorizeTrend(trendName: string): string {
  const lowerName = trendName.toLowerCase();
  
  if (lowerName.startsWith('#')) return 'Hashtag';
  if (lowerName.includes('crypto') || lowerName.includes('bitcoin') || lowerName.includes('eth')) return 'Crypto';
  if (lowerName.includes('sport') || lowerName.includes('football') || lowerName.includes('basketball')) return 'Sports';
  if (lowerName.includes('tech') || lowerName.includes('ai') || lowerName.includes('apple')) return 'Technology';
  if (lowerName.includes('movie') || lowerName.includes('film') || lowerName.includes('tv')) return 'Entertainment';
  if (lowerName.includes('politics') || lowerName.includes('government')) return 'Politics';
  
  return 'General';
} 