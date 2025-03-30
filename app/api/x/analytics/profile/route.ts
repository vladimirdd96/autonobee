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
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }
    
    // Parse user data
    const userData = JSON.parse(xUser);
    const xUserId = userData.id;
    
    // Get force refresh parameter
    const searchParams = request.nextUrl.searchParams;
    const forceRefresh = searchParams.get('force_refresh') === 'true';
    
    // Create cache key
    const cacheKey = `analytics:profile:${xUserId}`;
    
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
    
    logDebug(`Fetching profile analytics for user: ${xUserId} using ${authMethod}`);
    
    let userMetrics: any = {};
    let tweets: any[] = [];
    
    try {
      // Fetch user data
      const userDataResponse = await xApiAuth.makeAuthenticatedRequest(
        `users/${xUserId}?user.fields=public_metrics`, 
        'GET',
        null,
        userId,
        useOAuth1
      );
      
      // Fetch user tweets for engagement metrics
      const tweetsResponse = await xApiAuth.makeAuthenticatedRequest(
        `users/${xUserId}/tweets?max_results=5&tweet.fields=public_metrics,created_at&expansions=referenced_tweets.id`,
        'GET',
        null,
        userId,
        useOAuth1
      );
      
      // Calculate analytics from the responses
      userMetrics = userDataResponse.data?.public_metrics || {};
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
            `users/${xUserId}/tweets?max_results=5&tweet.fields=public_metrics,created_at`
          );
          
          userMetrics = userDataResponse.data?.public_metrics || {};
          tweets = tweetsResponse.data || [];
        } catch (oauth1Error: any) {
          logDebug('OAuth 1.0a request also failed:', oauth1Error);
          throw new Error('Authentication failed with both OAuth methods');
        }
      } else {
        // If it wasn't an auth error or OAuth 1.0a also failed, rethrow
        throw apiError;
      }
    }
    
    // Calculate engagement metrics from recent tweets
    const totalEngagement = tweets.reduce((sum: number, tweet: any) => {
      const metrics = tweet.public_metrics || {};
      return sum + (metrics.like_count || 0) + (metrics.reply_count || 0) + 
        (metrics.retweet_count || 0) + (metrics.quote_count || 0);
    }, 0);
    
    const avgEngagement = tweets.length > 0 ? totalEngagement / tweets.length : 0;
    
    // Calculate engagement rate (percentage)
    const engagementRate = userMetrics.followers_count > 0 
      ? (avgEngagement / userMetrics.followers_count) * 100
      : 0;
    
    // Calculate growth metrics (mock calculation - in real app would compare to historical data)
    const followersGrowthPercent = 5.2; // Mock data
    const engagementGrowthPercent = 2.1; // Mock data
    const viewsGrowthPercent = 12.5;
    
    // Prepare response
    const analytics = {
      profile: {
        id: xUserId,
        name: userData.name,
        username: userData.username,
      },
      metrics: {
        followers: userMetrics.followers_count || 0,
        following: userMetrics.following_count || 0,
        tweets: userMetrics.tweet_count || 0,
        listed: userMetrics.listed_count || 0
      },
      engagement: {
        total: totalEngagement,
        average: avgEngagement.toFixed(1),
        rate: engagementRate.toFixed(1)
      },
      growth: {
        followers: followersGrowthPercent,
        engagement: engagementGrowthPercent,
        views: viewsGrowthPercent
      },
      recentTweets: tweets.map((tweet: any) => ({
        id: tweet.id,
        text: tweet.text,
        created_at: tweet.created_at,
        metrics: tweet.public_metrics || {}
      }))
    };
    
    // Cache the response
    cacheService.set(cacheKey, analytics);
    
    return NextResponse.json(analytics, {
      headers: {
        'X-Cache': 'MISS',
        'Cache-Control': 'public, max-age=300' // 5 minutes
      }
    });
  } catch (error: any) {
    console.error('Error fetching profile analytics:', error);
    
    // Check for specific error types
    if (error.message?.includes('Authentication failed')) {
      return NextResponse.json(
        { error: 'Authentication failed. Please reconnect your X account.' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch profile analytics' },
      { status: 500 }
    );
  }
} 