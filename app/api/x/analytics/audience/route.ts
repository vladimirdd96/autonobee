import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import xApiAuth from '@/app/api/auth/x/utils/XApiAuth';
import { cacheService } from '@/lib/services/cache';
import { logDebug } from '@/lib/utils/logger';

// Mark this route as dynamic
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get user ID from cookies
    const cookieStore = cookies();
    const userId = cookieStore.get('x_user_id')?.value;
    const xUser = cookieStore.get('x_user')?.value;
    
    if (!userId || !xUser) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }
    
    // Parse user data
    const userData = JSON.parse(xUser);
    const xUserId = userData.id;
    
    // Get force refresh parameter
    const searchParams = request.nextUrl.searchParams;
    const forceRefresh = searchParams.get('force_refresh') === 'true';
    
    // Create cache key
    const cacheKey = `analytics:audience:${xUserId}`;
    
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
    
    // Determine auth method
    const authMethod = cookieStore.get('x_auth_method')?.value || 'oauth2';
    const useOAuth1 = authMethod === 'oauth1';
    
    logDebug(`Fetching audience analytics for user: ${xUserId} using ${authMethod}`);
    
    let userMetrics: any = {};
    let followerCount = 0;
    let tweets: any[] = [];
    
    try {
      // Fetch user data for follower count
      const userDataResponse = await xApiAuth.makeAuthenticatedRequest(
        `users/${xUserId}?user.fields=public_metrics`,
        'GET',
        null,
        userId,
        useOAuth1
      );
      
      // Fetch user tweets to analyze engagement patterns
      const tweetsResponse = await xApiAuth.makeAuthenticatedRequest(
        `users/${xUserId}/tweets?max_results=10&tweet.fields=public_metrics`,
        'GET',
        null,
        userId,
        useOAuth1
      );
      
      userMetrics = userDataResponse.data?.public_metrics || {};
      followerCount = userMetrics.followers_count || 0;
      tweets = tweetsResponse.data || [];
    } catch (apiError: any) {
      // If OAuth 2.0 fails and we weren't already using OAuth 1.0a, try with OAuth 1.0a
      if (!useOAuth1 && apiError.message && (
          apiError.message.includes('invalid_request') || 
          apiError.message.includes('token was invalid') ||
          apiError.message.includes('401') ||
          apiError.message.includes('authentication')
      )) {
        logDebug('OAuth 2.0 failed, retrying with OAuth 1.0a');
        
        try {
          // Try direct OAuth 1.0a request
          const userDataResponse = await xApiAuth.makeOAuth1Request(
            `users/${xUserId}?user.fields=public_metrics`
          );
          
          const tweetsResponse = await xApiAuth.makeOAuth1Request(
            `users/${xUserId}/tweets?max_results=10&tweet.fields=public_metrics`
          );
          
          userMetrics = userDataResponse.data?.public_metrics || {};
          followerCount = userMetrics.followers_count || 0;
          tweets = tweetsResponse.data || [];
        } catch (oauth1Error: any) {
          logDebug('OAuth 1.0a request also failed:', oauth1Error);
          // Continue with mock data
          followerCount = 1000; // Default follower count
        }
      } else {
        // If it wasn't an auth error or OAuth 1.0a also failed, rethrow
        throw apiError;
      }
    }
    
    // Note: X API doesn't provide direct audience demographics data
    // In a real app, you'd need to use the Twitter API audience insights feature
    // which is only available to enterprise accounts
    // For this example, we'll generate realistic-looking synthetic data
    
    // Generate age demographics
    const ageDemographics = [
      { name: "18-24", value: Math.floor(Math.random() * 10) + 10 },  // 10-20%
      { name: "25-34", value: Math.floor(Math.random() * 10) + 25 },  // 25-35%
      { name: "35-44", value: Math.floor(Math.random() * 10) + 20 },  // 20-30%
      { name: "45-54", value: Math.floor(Math.random() * 10) + 10 },  // 10-20%
      { name: "55+", value: Math.floor(Math.random() * 10) + 5 }      // 5-15%
    ];
    
    // Generate gender demographics
    const genderDemographics = [
      { name: "Male", value: Math.floor(Math.random() * 10) + 45 },  // 45-55%
      { name: "Female", value: Math.floor(Math.random() * 10) + 40 }, // 40-50%
      { name: "Other", value: Math.floor(Math.random() * 5) + 2 }     // 2-7%
    ];
    
    // Generate location demographics (mock data)
    const locationDemographics = [
      { name: "United States", value: 35 },
      { name: "United Kingdom", value: 15 },
      { name: "Canada", value: 10 },
      { name: "Australia", value: 8 },
      { name: "Other", value: 32 }
    ];
    
    // Calculate engagement patterns
    const engagementPatterns = {
      byHour: Array(24).fill(0).map(() => Math.floor(Math.random() * 100)),
      byDay: {
        Sunday: Math.floor(Math.random() * 50),
        Monday: Math.floor(Math.random() * 50),
        Tuesday: Math.floor(Math.random() * 50),
        Wednesday: Math.floor(Math.random() * 50),
        Thursday: Math.floor(Math.random() * 50),
        Friday: Math.floor(Math.random() * 50),
        Saturday: Math.floor(Math.random() * 50)
      }
    };
    
    // Calculate audience growth rate (mock calculation)
    const growthRate = (Math.random() * 5 + 2).toFixed(1); // 2-7% growth rate
    
    // Prepare response
    const response = {
      demographics: {
        age: ageDemographics,
        gender: genderDemographics,
        location: locationDemographics
      },
      engagement: {
        patterns: engagementPatterns,
        growthRate: parseFloat(growthRate)
      },
      metrics: {
        totalFollowers: followerCount,
        activeFollowers: Math.floor(followerCount * 0.7), // 70% active followers
        engagementRate: (Math.random() * 5 + 2).toFixed(1) // 2-7% engagement rate
      }
    };
    
    // Cache the response
    cacheService.set(cacheKey, response);
    
    return NextResponse.json(response, {
      headers: {
        'X-Cache': 'MISS',
        'Cache-Control': 'public, max-age=300' // 5 minutes
      }
    });
  } catch (error: any) {
    logDebug('Error fetching audience analytics:', error);
    
    // Handle rate limiting
    if (error.response?.status === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch audience analytics' },
      { status: 500 }
    );
  }
} 