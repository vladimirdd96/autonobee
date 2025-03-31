import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios, { AxiosError } from 'axios';
import { cacheService } from '@/lib/services/cache';

// Define types for trend data
interface Trend {
  name: string;
  url: string;
  tweet_volume: number | null;
}

interface TrendResponse {
  trends: Trend[];
  as_of: string;
  created_at: string;
  locations: Array<{
    name: string;
    woeid: number;
  }>;
}

// Mark route as dynamic
export const dynamic = 'force-dynamic';

/**
 * GET /api/x/trends
 * Returns trending topics from X.com
 */
export async function GET(request: NextRequest) {
  try {
    // Check for authentication
    const isAuthenticated = cookies().get('x_auth')?.value === 'true';
    const accessToken = cookies().get('x_access_token')?.value;
    
    if (!isAuthenticated || !accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get force refresh parameter
    const searchParams = request.nextUrl.searchParams;
    const forceRefresh = searchParams.get('force_refresh') === 'true';
    
    // Create cache key
    const cacheKey = 'trends:global';
    
    // Check cache if not forcing refresh
    if (!forceRefresh) {
      const cachedData = cacheService.get(cacheKey);
      if (cachedData) {
        return NextResponse.json(cachedData, {
          headers: {
            'X-Cache': 'HIT',
            'Cache-Control': 'public, max-age=300' // 5 minutes
          }
        });
      }
    }
    
    // Fetch trends data
    const response = await axios.get('https://api.twitter.com/2/trends/by/woeid/1', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      }
    });
    
    const trendsData: TrendResponse = response.data;
    
    // Cache the response
    cacheService.set(cacheKey, trendsData);
    
    return NextResponse.json(trendsData, {
      headers: {
        'X-Cache': 'MISS',
        'Cache-Control': 'public, max-age=300' // 5 minutes
      }
    });
  } catch (error) {
    console.error('Error fetching trends:', error);
    
    // Check for specific error types
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        // Handle expired token
        cookies().set('x_auth', '', { maxAge: 0, path: '/' });
        return NextResponse.json(
          { error: 'Authentication expired', code: 'AUTH_EXPIRED' },
          { status: 401 }
        );
      }
      
      // Handle rate limiting
      if (error.response?.status === 429) {
        // Try to get cached data if available
        const cachedData = cacheService.get('trends:global');
        if (cachedData) {
          return NextResponse.json(cachedData, {
            headers: {
              'X-Cache': 'HIT',
              'Cache-Control': 'public, max-age=300',
              'X-Rate-Limit-Exceeded': 'true'
            }
          });
        }
        
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch trends data' },
      { status: 500 }
    );
  }
} 