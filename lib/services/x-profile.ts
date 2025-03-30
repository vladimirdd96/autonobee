import { xAuthClient } from '../x-auth';

interface ProfileOptions {
  fields?: string;
  skipCache?: boolean;
  cacheTTL?: number;
}

interface AnalyticsOptions {
  startTime?: string;
  endTime?: string;
  maxResults?: number;
}

/**
 * Service to handle X.com authenticated user profile and analytics
 */
export class XProfileService {
  /**
   * Get authenticated user information
   * @param userId - User ID
   * @param options - Request options
   */
  static async getMyProfile(userId: string, options: ProfileOptions = {}) {
    try {
      // Build query parameters
      const fields = options.fields || 'description,profile_image_url,public_metrics,verified,created_at,location,url,withheld';
      const endpoint = `2/users/me?user.fields=${fields}`;
      
      const data = await xAuthClient.makeUserRequest(userId, endpoint);
      
      return data;
    } catch (error) {
      console.error('Error getting authenticated user info:', error);
      return null;
    }
  }
  
  /**
   * Get authenticated user timeline (tweets)
   * @param userId - User ID
   * @param options - Request options
   */
  static async getMyTweets(userId: string, options: ProfileOptions = {}) {
    try {
      // Get user data first to obtain ID
      const userData = await this.getMyProfile(userId);
      if (!userData || !userData.data || !userData.data.id) {
        throw new Error('Could not obtain user ID');
      }
      
      const myId = userData.data.id;
      
      // Build query parameters
      const maxResults = 50; // Maximum allowed by API
      const endpoint = `2/users/${myId}/tweets?max_results=${maxResults}&tweet.fields=public_metrics,created_at,entities`;
      
      const data = await xAuthClient.makeUserRequest(userId, endpoint);
      
      return data;
    } catch (error) {
      console.error('Error getting authenticated user tweets:', error);
      return { data: [] };
    }
  }
  
  /**
   * Get authenticated user profile analytics
   * Processing here happens on the client to avoid rate limits
   * @param userId - User ID
   */
  static async getProfileAnalytics(userId: string, options: AnalyticsOptions = {}) {
    try {
      // Get user profile and tweets
      const [profileData, tweetsData] = await Promise.all([
        this.getMyProfile(userId),
        this.getMyTweets(userId)
      ]);
      
      if (!profileData || !profileData.data) {
        return null;
      }
      
      const profile = profileData.data;
      const tweets = tweetsData?.data || [];
      
      // Basic analytics
      const totalTweets = profile.public_metrics?.tweet_count || 0;
      const totalFollowers = profile.public_metrics?.followers_count || 0;
      const totalFollowing = profile.public_metrics?.following_count || 0;
      
      // Calculate engagement metrics from tweets
      const engagement = this.calculateEngagementMetrics(tweets);
      
      // Calculate posting patterns
      const patterns = this.calculatePostingPatterns(tweets);
      
      return {
        profile: this.formatProfileForUI(profileData),
        analytics: {
          totalTweets,
          totalFollowers,
          totalFollowing,
          engagement,
          patterns
        }
      };
    } catch (error) {
      console.error('Error getting profile analytics:', error);
      return null;
    }
  }
  
  /**
   * Format profile data for UI consumption
   * @param profileData - Raw profile data from API
   */
  static formatProfileForUI(profileData: any) {
    if (!profileData || !profileData.data) {
      return null;
    }
    
    const user = profileData.data;
    
    return {
      id: user.id,
      username: user.username,
      name: user.name,
      description: user.description || '',
      profileImage: user.profile_image_url ? user.profile_image_url.replace('_normal', '') : null,
      verified: user.verified || false,
      metrics: {
        followers: user.public_metrics?.followers_count || 0,
        following: user.public_metrics?.following_count || 0,
        tweets: user.public_metrics?.tweet_count || 0,
        likes: user.public_metrics?.like_count || 0,
      },
      location: user.location || '',
      url: user.url || '',
      createdAt: user.created_at || '',
    };
  }
  
  /**
   * Calculate engagement metrics from tweets
   * @param tweets - User tweets
   */
  private static calculateEngagementMetrics(tweets: any[]) {
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
   * @param tweets - User tweets
   */
  private static calculatePostingPatterns(tweets: any[]) {
    if (!tweets || tweets.length === 0) {
      return {
        mostActiveDay: 'N/A',
        mostActiveTime: 'N/A',
        averagePostsPerDay: 0,
        postFrequency: []
      };
    }
    
    const dayCount: {[key: string]: number} = {
      'Sunday': 0,
      'Monday': 0,
      'Tuesday': 0,
      'Wednesday': 0,
      'Thursday': 0,
      'Friday': 0,
      'Saturday': 0
    };
    
    const hourCount: {[key: number]: number} = {};
    for (let i = 0; i < 24; i++) {
      hourCount[i] = 0;
    }
    
    // Track dates to calculate average posts per day
    const datesMap: {[key: string]: number} = {};
    
    tweets.forEach(tweet => {
      if (tweet.created_at) {
        const date = new Date(tweet.created_at);
        const day = date.getDay();
        const hour = date.getHours();
        const dateStr = date.toISOString().split('T')[0];
        
        // Increment day count
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        dayCount[dayNames[day]]++;
        
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
    }));
    
    return {
      mostActiveDay,
      mostActiveTime: hourFormatted,
      averagePostsPerDay,
      postFrequency
    };
  }
} 