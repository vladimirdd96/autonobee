import { xAuthClient } from '../x-auth';

interface TrendOptions {
  skipCache?: boolean;
  cacheTTL?: number;
}

interface TrendLocationOptions {
  skipCache?: boolean;
  cacheTTL?: number;
}

/**
 * Service to handle X.com trends API
 */
export class XTrendsService {
  /**
   * Get current trends
   * @param woeid - Where On Earth ID (1 for global)
   * @param options - Request options
   */
  static async getTrends(woeid = 1, options: TrendOptions = {}) {
    try {
      // Build endpoint
      const endpoint = `1.1/trends/place.json?id=${woeid}`;
      
      const data = await xAuthClient.makeRequest(endpoint);
      
      // The trends endpoint returns an array with a single object
      return data[0] || { trends: [] };
    } catch (error) {
      console.error('Error getting trends:', error);
      return { trends: [] };
    }
  }
  
  /**
   * Get available trend locations
   * @param options - Request options
   */
  static async getTrendLocations(options: TrendLocationOptions = {}) {
    try {
      // Build endpoint
      const endpoint = '1.1/trends/available.json';
      
      const data = await xAuthClient.makeRequest(endpoint);
      
      return data || [];
    } catch (error) {
      console.error('Error getting trend locations:', error);
      return [];
    }
  }
  
  /**
   * Get closest trend location by lat/long
   * @param lat - Latitude
   * @param long - Longitude
   * @param options - Request options
   */
  static async getClosestTrendLocation(lat: number, long: number, options: TrendLocationOptions = {}) {
    try {
      // Build endpoint
      const endpoint = `1.1/trends/closest.json?lat=${lat}&long=${long}`;
      
      const data = await xAuthClient.makeRequest(endpoint);
      
      return data || [];
    } catch (error) {
      console.error('Error getting closest trend location:', error);
      return [];
    }
  }
  
  /**
   * Format trends data for UI consumption
   * @param trendsData - Raw trends data from API
   */
  static formatTrendsForUI(trendsData: any) {
    if (!trendsData || !trendsData.trends) {
      return {
        trends: [],
        asOf: null,
        location: null
      };
    }
    
    // Extract location info
    const location = {
      name: trendsData.locations?.[0]?.name || 'Worldwide',
      woeid: trendsData.locations?.[0]?.woeid || 1
    };
    
    // Map trends to a more usable format
    const trends = trendsData.trends.map((trend: any) => ({
      name: trend.name,
      url: trend.url,
      tweet_volume: trend.tweet_volume,
      // Add a category based on name (simplified approach)
      category: this.categorizeTrend(trend.name)
    }));
    
    return {
      trends,
      asOf: trendsData.as_of,
      location
    };
  }
  
  /**
   * Simple categorization of trends based on name
   * This is a very basic implementation - in production you'd want a more sophisticated approach
   */
  private static categorizeTrend(trendName: string): string {
    const lowerName = trendName.toLowerCase();
    
    if (lowerName.startsWith('#')) return 'Hashtag';
    if (lowerName.includes('crypto') || lowerName.includes('bitcoin') || lowerName.includes('eth')) return 'Crypto';
    if (lowerName.includes('sport') || lowerName.includes('football') || lowerName.includes('basketball')) return 'Sports';
    if (lowerName.includes('tech') || lowerName.includes('ai') || lowerName.includes('apple')) return 'Technology';
    if (lowerName.includes('movie') || lowerName.includes('film') || lowerName.includes('tv')) return 'Entertainment';
    if (lowerName.includes('politics') || lowerName.includes('government')) return 'Politics';
    
    return 'General';
  }
} 