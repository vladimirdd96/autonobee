import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import xApiAuth from '@/app/api/auth/x/utils/XApiAuth';

// Debug logger
const logDebug = (message: string, data?: any) => {
  console.log(`[X PROFILE ANALYTICS] ${message}`, data ? data : '');
};

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
    
    // Determine auth method
    const authMethod = cookieStore.get('x_auth_method')?.value || 'oauth2';
    const useOAuth1 = authMethod === 'oauth1';
    
    logDebug(`Fetching profile analytics for user: ${xUserId} using ${authMethod}`);
    
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
      const userMetrics = userDataResponse.data?.public_metrics || {};
      
      // Calculate engagement metrics from recent tweets
      const tweets = tweetsResponse.data || [];
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
      const viewsGrowthPercent = 12.5; // Mock data
      
      // Prepare response
      const analytics = {
        profile: {
          id: userDataResponse.data?.id,
          name: userDataResponse.data?.name,
          username: userDataResponse.data?.username,
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
      
      return NextResponse.json(analytics);
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
            `users/${xUserId}/tweets?max_results=5&tweet.fields=public_metrics,created_at&expansions=referenced_tweets.id`
          );
          
          // Process the data (simplified version)
          const userMetrics = userDataResponse.data?.public_metrics || {};
          const tweets = tweetsResponse.data || [];
          
          // Prepare simplified analytics
          const analytics = {
            profile: {
              id: userDataResponse.data?.id,
              name: userDataResponse.data?.name,
              username: userDataResponse.data?.username,
            },
            metrics: {
              followers: userMetrics.followers_count || 0,
              following: userMetrics.following_count || 0,
              tweets: userMetrics.tweet_count || 0,
              listed: userMetrics.listed_count || 0
            },
            engagement: {
              total: 0,
              average: '0.0',
              rate: '0.0'
            },
            growth: {
              followers: 5.2,
              engagement: 2.1,
              views: 12.5
            },
            recentTweets: tweets.map((tweet: any) => ({
              id: tweet.id,
              text: tweet.text,
              created_at: tweet.created_at,
              metrics: tweet.public_metrics || {}
            }))
          };
          
          return NextResponse.json(analytics);
        } catch (oauth1Error: any) {
          logDebug('OAuth 1.0a request also failed:', oauth1Error);
          throw oauth1Error;
        }
      }
      
      // If it wasn't an auth error or OAuth 1.0a also failed, rethrow
      throw apiError;
    }
  } catch (error: any) {
    logDebug('Error fetching profile analytics:', error);
    
    // If this is an API error without proper details, create a cleaner message
    const errorMessage = error.details?.error_description || 
                         error.message || 
                         'Failed to fetch profile analytics';
    
    return NextResponse.json({
      error: error.code || 'FETCH_ERROR',
      message: errorMessage
    }, { status: error.code === 'RATE_LIMIT' ? 429 : 500 });
  }
} 