import { xAuthClient } from '../x-auth';

interface UserSearchOptions {
  maxResults?: number;
  fields?: string;
  skipCache?: boolean;
  cacheTTL?: number;
}

interface UserInfoOptions {
  fields?: string;
  skipCache?: boolean;
  cacheTTL?: number;
}

/**
 * Service to handle X.com user-related API calls
 */
export class XUserService {
  /**
   * Get user information by username
   * @param username - X.com username (with or without @)
   * @param options - Request options
   */
  static async getUserInfo(username: string, options: UserInfoOptions = {}) {
    try {
      // Remove @ if present
      const cleanUsername = username.startsWith('@') ? username.substring(1) : username;
      
      // Build query parameters
      const fields = options.fields || 'description,profile_image_url,public_metrics,verified,created_at,location,url';
      const endpoint = `2/users/by/username/${cleanUsername}?user.fields=${fields}`;
      
      const data = await xAuthClient.makeRequest(endpoint);
      
      return data;
    } catch (error) {
      console.error('Error getting user info:', error);
      return null;
    }
  }
  
  /**
   * Search for users based on a query
   * @param query - Search query
   * @param userId - Authenticated user ID (if available)
   * @param options - Search options
   */
  static async searchUsers(query: string, userId: string | null = null, options: UserSearchOptions = {}) {
    try {
      // Build query parameters
      const maxResults = options.maxResults || 20;
      const fields = options.fields || 'description,profile_image_url,public_metrics,verified,created_at';
      const endpoint = `2/users/search?query=${encodeURIComponent(query)}&max_results=${maxResults}&user.fields=${fields}`;
      
      let data;
      
      // Use authenticated request if userId is provided
      if (userId) {
        data = await xAuthClient.makeUserRequest(userId, endpoint);
      } else {
        data = await xAuthClient.makeRequest(endpoint);
      }
      
      return data;
    } catch (error) {
      console.error('Error searching users:', error);
      return { data: [] };
    }
  }
  
  /**
   * Get user followers
   * @param userId - Authenticated user ID
   * @param targetUserId - Target user ID to get followers of
   * @param options - Request options
   */
  static async getFollowers(userId: string, targetUserId: string, options: UserSearchOptions = {}) {
    try {
      // Build query parameters
      const maxResults = options.maxResults || 100;
      const fields = options.fields || 'description,profile_image_url,public_metrics,verified,created_at';
      const endpoint = `2/users/${targetUserId}/followers?max_results=${maxResults}&user.fields=${fields}`;
      
      const data = await xAuthClient.makeUserRequest(userId, endpoint);
      
      return data;
    } catch (error) {
      console.error('Error getting followers:', error);
      return { data: [] };
    }
  }
  
  /**
   * Get users the target user is following
   * @param userId - Authenticated user ID
   * @param targetUserId - Target user ID to get following of
   * @param options - Request options
   */
  static async getFollowing(userId: string, targetUserId: string, options: UserSearchOptions = {}) {
    try {
      // Build query parameters
      const maxResults = options.maxResults || 100;
      const fields = options.fields || 'description,profile_image_url,public_metrics,verified,created_at';
      const endpoint = `2/users/${targetUserId}/following?max_results=${maxResults}&user.fields=${fields}`;
      
      const data = await xAuthClient.makeUserRequest(userId, endpoint);
      
      return data;
    } catch (error) {
      console.error('Error getting following:', error);
      return { data: [] };
    }
  }
  
  /**
   * Get user timeline (tweets)
   * @param userId - Authenticated user ID
   * @param targetUserId - Target user ID to get tweets from
   * @param options - Request options
   */
  static async getUserTweets(userId: string, targetUserId: string, options: UserSearchOptions = {}) {
    try {
      // Build query parameters
      const maxResults = options.maxResults || 10;
      const endpoint = `2/users/${targetUserId}/tweets?max_results=${maxResults}`;
      
      const data = await xAuthClient.makeUserRequest(userId, endpoint);
      
      return data;
    } catch (error) {
      console.error('Error getting user tweets:', error);
      return { data: [] };
    }
  }
  
  /**
   * Format user data for UI consumption
   * @param userData - Raw user data from API
   */
  static formatUserForUI(userData: any) {
    if (!userData || !userData.data) {
      return null;
    }
    
    const user = userData.data;
    
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
   * Format search results for UI consumption
   * @param searchData - Raw search data from API
   */
  static formatSearchResultsForUI(searchData: any) {
    if (!searchData || !searchData.data) {
      return [];
    }
    
    return searchData.data.map((user: any) => ({
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
      },
    }));
  }
} 