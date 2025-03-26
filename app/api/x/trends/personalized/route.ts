import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import xApiAuth from '@/app/api/auth/x/utils/XApiAuth';

// Debug logger
const logDebug = (message: string, data?: any) => {
  console.log(`[X API DEBUG] ${message}`, data ? data : '');
};

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const userId = cookieStore.get('x_user_id')?.value;
  
  try {
    // Use the xApiAuth manager to make the authenticated request
    // For v1.1 API, we'll use the "get trending topics" from a location
    const endpoint = `trends/place?id=1`; // WOEID 1 = Worldwide trends
    logDebug(`Fetching trends with endpoint: ${endpoint}`);
    
    // First try with user auth if userId exists, fall back to app-only auth
    let rawData;
    try {
      if (userId) {
        logDebug(`Using user auth with ID: ${userId}`);
        rawData = await xApiAuth.makeAuthenticatedRequest(endpoint, 'GET', null, userId);
      } else {
        throw new Error('No user ID found, using app-only auth');
      }
    } catch (userAuthError) {
      // Fall back to app-only auth
      logDebug('Falling back to app-only auth', userAuthError);
      rawData = await xApiAuth.makeAuthenticatedRequest(endpoint, 'GET', null, null);
    }
    
    logDebug('Raw trends data received', rawData);
    
    // Transform the raw data to match our expected format
    const transformedData = {
      data: (rawData?.[0]?.trends || []).slice(0, 10).map((trend: any) => ({
        trend_name: trend.name,
        category: 'Trending', // Default category
        post_count: parseInt(trend.tweet_volume || '1000'), // Fallback to 1000 if no volume
        trending_since: new Date().toISOString() // Current time as fallback
      }))
    };
    
    logDebug('Transformed trends data', transformedData);
    
    // Get the latest tokens from the tokenStore to update cookies if user is authenticated
    let response = NextResponse.json(transformedData);
    
    if (userId) {
      const latestTokens = xApiAuth.tokenStore.get(userId);
      if (latestTokens) {
        logDebug('Updating cookies with latest tokens');
        // Update cookies with the latest tokens
        response.cookies.set('x_access_token', latestTokens.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 1 week
        });
        
        if (latestTokens.refresh_token) {
          response.cookies.set('x_refresh_token', latestTokens.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30, // 30 days
          });
        }
      }
    }
    
    return response;
  } catch (error: any) {
    console.error('Error fetching personalized trends:', error);
    logDebug('Error details', {
      message: error.message,
      code: error.code,
      details: error.details || 'None'
    });
    
    // Handle different error types
    if (error.code === 'TOKEN_EXPIRED' || error.code === 'INVALID_TOKEN') {
      return NextResponse.json({
        error: error.code,
        message: 'Your X session has expired. Please reconnect your account.'
      }, { status: 401 });
    }
    
    if (error.code === 'RATE_LIMIT') {
      return NextResponse.json({
        error: error.code,
        message: 'Rate limit exceeded. Please try again later.'
      }, { status: 429 });
    }
    
    return NextResponse.json({
      error: error.code || 'FETCH_ERROR',
      message: error.message || 'Failed to fetch personalized trends'
    }, { status: 500 });
  }
} 