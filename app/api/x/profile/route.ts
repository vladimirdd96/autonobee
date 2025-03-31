import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios, { AxiosError } from 'axios';
import { cacheService } from '@/lib/services/cache';

// Define types for tweet metrics
interface TweetMetrics {
  like_count?: number;
  retweet_count?: number;
  reply_count?: number;
  quote_count?: number;
}

interface Tweet {
  public_metrics?: TweetMetrics;
  created_at?: string;
}

interface DayCount {
  Sunday: number;
  Monday: number;
  Tuesday: number;
  Wednesday: number;
  Thursday: number;
  Friday: number;
  Saturday: number;
}

interface HourCount {
  [key: number]: number;
}

interface DatesMap {
  [key: string]: number;
}

// Mark route as dynamic
export const dynamic = 'force-dynamic';

/**
 * GET /api/x/profile
 * Returns authenticated user profile data from X.com
 */
export async function GET(request: NextRequest) {
  let userId: string | undefined;
  
  try {
    // Check for authentication
    const isAuthenticated = cookies().get('x_auth')?.value === 'true';
    const accessToken = cookies().get('x_access_token')?.value;
    userId = cookies().get('x_user_id')?.value;
    
    if (!isAuthenticated || !accessToken || !userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get force refresh parameter
    const searchParams = request.nextUrl.searchParams;
    const forceRefresh = searchParams.get('force_refresh') === 'true';
    
    // Create cache key
    const cacheKey = `profile:${userId}`;
    
    // Check cache if not forcing refresh
    if (!forceRefresh) {
      const cachedData = cacheService.get(cacheKey);
      if (cachedData) {
        return NextResponse.json(cachedData, {
          headers: {
            'X-Cache': 'HIT',
            'Cache-Control': 'public, max-age=1800' // 30 minutes
          }
        });
      }
    }
    
    try {
      // Fetch user data
      const userResponse = await axios.get('https://api.twitter.com/2/users/me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        params: {
          'user.fields': 'description,profile_image_url,public_metrics,verified,created_at,location,url'
        }
      });
      
      const userData = userResponse.data.data;
      
      // Fetch recent tweets
      const tweetsResponse = await axios.get(`https://api.twitter.com/2/users/${userId}/tweets`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        params: {
          'max_results': 50,
          'tweet.fields': 'public_metrics,created_at,entities',
          'exclude': 'retweets,replies'
        }
      });
      
      const tweets = tweetsResponse.data.data || [];
      
      // Calculate engagement metrics
      const engagement = calculateEngagementMetrics(tweets);
      
      // Calculate posting patterns
      const patterns = calculatePostingPatterns(tweets);
      
      // Format profile data for UI
      const profileData = {
        profile: {
          id: userData.id,
          username: userData.username,
          name: userData.name,
          description: userData.description || '',
          profileImage: userData.profile_image_url ? userData.profile_image_url.replace('_normal', '') : null,
          verified: userData.verified || false,
          metrics: {
            followers: userData.public_metrics?.followers_count || 0,
            following: userData.public_metrics?.following_count || 0,
            tweets: userData.public_metrics?.tweet_count || 0,
            likes: userData.public_metrics?.like_count || 0,
          },
          location: userData.location || '',
          url: userData.url || '',
          createdAt: userData.created_at || '',
        },
        analytics: {
          totalTweets: userData.public_metrics?.tweet_count || 0,
          totalFollowers: userData.public_metrics?.followers_count || 0,
          totalFollowing: userData.public_metrics?.following_count || 0,
          engagement,
          patterns
        }
      };
      
      // Cache the response
      cacheService.set(cacheKey, profileData);
      
      return NextResponse.json(profileData, {
        headers: {
          'X-Cache': 'MISS',
          'Cache-Control': 'public, max-age=1800' // 30 minutes
        }
      });
    } catch (apiError: any) {
      // If we hit a rate limit and have cached data, return it
      if (apiError.response?.status === 429) {
        const cachedData = cacheService.get(cacheKey);
        if (cachedData) {
          return NextResponse.json(cachedData, {
            headers: {
              'X-Cache': 'HIT',
              'Cache-Control': 'public, max-age=1800', // 30 minutes
              'X-Rate-Limit-Exceeded': 'true'
            }
          });
        }
      }
      throw apiError;
    }
  } catch (error: any) {
    console.error('Error fetching profile:', error);
    
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
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch profile data' },
      { status: 500 }
    );
  }
}

/**
 * Calculate engagement metrics from tweets
 */
function calculateEngagementMetrics(tweets: Tweet[]) {
  if (!tweets || tweets.length === 0) {
    return {
      averageLikes: 0,
      averageRetweets: 0,
      averageReplies: 0,
      totalLikes: 0,
      totalRetweets: 0,
      totalReplies: 0,
      engagementRate: 0,
    };
  }
  
  let totalLikes = 0;
  let totalRetweets = 0;
  let totalReplies = 0;
  
  tweets.forEach(tweet => {
    if (tweet.public_metrics) {
      totalLikes += tweet.public_metrics.like_count || 0;
      totalRetweets += tweet.public_metrics.retweet_count || 0;
      totalReplies += tweet.public_metrics.reply_count || 0;
    }
  });
  
  const averageLikes = totalLikes / tweets.length;
  const averageRetweets = totalRetweets / tweets.length;
  const averageReplies = totalReplies / tweets.length;
  
  // Calculate engagement rate (simplified)
  const engagementRate = ((totalLikes + totalRetweets + totalReplies) / tweets.length) / 100;
  
  return {
    averageLikes,
    averageRetweets,
    averageReplies,
    totalLikes,
    totalRetweets,
    totalReplies,
    engagementRate
  };
}

/**
 * Calculate posting patterns from tweets
 */
function calculatePostingPatterns(tweets: Tweet[]) {
  if (!tweets || tweets.length === 0) {
    return {
      mostActiveDay: 'N/A',
      mostActiveTime: 'N/A',
      averagePostsPerDay: 0,
      postFrequency: Array.from({ length: 24 }, (_, i) => ({ hour: i, count: 0 }))
    };
  }
  
  const dayCount: DayCount = {
    'Sunday': 0,
    'Monday': 0,
    'Tuesday': 0,
    'Wednesday': 0,
    'Thursday': 0,
    'Friday': 0,
    'Saturday': 0
  };
  
  const hourCount: HourCount = {};
  for (let i = 0; i < 24; i++) {
    hourCount[i] = 0;
  }
  
  // Track dates to calculate average posts per day
  const datesMap: DatesMap = {};
  
  tweets.forEach(tweet => {
    if (tweet.created_at) {
      const date = new Date(tweet.created_at);
      const day = date.getDay();
      const hour = date.getHours();
      const dateStr = date.toISOString().split('T')[0];
      
      // Increment day count
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      dayCount[dayNames[day] as keyof DayCount]++;
      
      // Increment hour count
      hourCount[hour]++;
      
      // Track dates
      datesMap[dateStr] = (datesMap[dateStr] || 0) + 1;
    }
  });
  
  // Find most active day
  let mostActiveDay = 'N/A';
  let maxDayCount = 0;
  Object.entries(dayCount).forEach(([day, count]) => {
    if (count > maxDayCount) {
      mostActiveDay = day;
      maxDayCount = count;
    }
  });
  
  // Find most active hour (convert to 12-hour format)
  let mostActiveHour = 0;
  let maxHourCount = 0;
  Object.entries(hourCount).forEach(([hour, count]) => {
    if (count > maxHourCount) {
      mostActiveHour = parseInt(hour);
      maxHourCount = count;
    }
  });
  
  const hourFormatted = mostActiveHour === 0 ? '12 AM' : 
                      mostActiveHour < 12 ? `${mostActiveHour} AM` : 
                      mostActiveHour === 12 ? '12 PM' : 
                      `${mostActiveHour - 12} PM`;
  
  // Calculate average posts per day
  const uniqueDates = Object.keys(datesMap).length;
  const averagePostsPerDay = uniqueDates > 0 ? tweets.length / uniqueDates : 0;
  
  // Format post frequency for chart display
  const postFrequency = Object.entries(hourCount).map(([hour, count]) => ({
    hour: parseInt(hour),
    count
  })).sort((a, b) => a.hour - b.hour);
  
  return {
    mostActiveDay,
    mostActiveTime: hourFormatted,
    averagePostsPerDay,
    postFrequency
  };
} 