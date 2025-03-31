import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';

// Mark route as dynamic
export const dynamic = 'force-dynamic';

/**
 * GET /api/x/search
 * Searches for X.com users
 */
export async function GET(request: NextRequest) {
  try {
    // Get search query from URL params
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    
    // If no query parameter, return bad request
    if (!query) {
      return NextResponse.json(
        { error: 'Missing search query' },
        { status: 400 }
      );
    }
    
    // Get authentication tokens from cookies
    const cookieStore = cookies();
    const accessToken = cookieStore.get('x_access_token')?.value;
    const isAuthCookie = cookieStore.get('x_auth')?.value === 'true';
    const authMethod = cookieStore.get('x_auth_method')?.value;
    
    // Use environment bearer token as fallback
    const bearerToken = process.env.X_BEARER_TOKEN || process.env.NEXT_PUBLIC_BEARER_TOKEN;
    
    // Determine which token to use
    let token = '';
    let authHeader = '';
    
    if (isAuthCookie && accessToken) {
      token = accessToken;
      authHeader = authMethod === 'oauth1' 
        ? `OAuth ${token}` 
        : `Bearer ${token}`;
    } else if (bearerToken) {
      // App-only authentication is not supported for user search
      // Return mock data for development or error for production
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock user search data due to missing user authentication');
        return NextResponse.json({ 
          results: getMockUserData()
        });
      } else {
        return NextResponse.json(
          { error: 'This endpoint requires user authentication. Please sign in with your X account.' },
          { status: 401 }
        );
      }
    } else {
      console.error('No authentication token available');
      return NextResponse.json(
        { error: 'Authentication configuration error' },
        { status: 500 }
      );
    }
    
    // Make request to X API v2
    // Use user mentions endpoint instead of search for user-based auth
    // as search endpoint has limited availability
    const endpoint = 'https://api.twitter.com/2/users/by';
    
    try {
      // Format the query for the users/by endpoint
      // The API accepts comma-separated usernames without spaces
      const formattedUsernames = query.includes(',') 
        ? query.split(',').map(u => u.trim()).join(',')
        : query.split(' ').filter(u => u.trim().length > 0).join(',');
      
      const response = await axios.get(endpoint, {
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
        params: {
          'usernames': formattedUsernames,
          'user.fields': 'description,profile_image_url,public_metrics,verified,created_at'
        }
      });
      
      // Log successful request details (for debugging)
      console.log('Successfully fetched user data:', {
        endpoint,
        usernames: formattedUsernames,
        authMethod,
        authType: authMethod === 'oauth1' ? 'OAuth 1.0a' : 'OAuth 2.0',
        resultCount: response.data.data?.length || 0
      });
    
      const users = response.data.data || [];
    
      // Format results for UI
      const formattedResults = users.map((user: {
        id: string;
        username: string;
        name: string;
        description?: string;
        profile_image_url?: string;
        verified?: boolean;
        public_metrics?: {
          followers_count?: number;
          following_count?: number;
          tweet_count?: number;
        };
      }) => ({
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
    
      return NextResponse.json({ results: formattedResults });
    } catch (error: any) {
      console.error('Error searching users:', error);
      
      // Check if it's a rate limit error
      if (error.response?.status === 429) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
      
      // Handle authentication errors
      if (error.response?.status === 401) {
        return NextResponse.json(
          { error: 'Authentication failed. Please reconnect your X account.' },
          { status: 401 }
        );
      }
      
      // Return error details for debugging
      const errorDetails = error.response?.data || error.message || 'Unknown error';
      console.error('Error details:', errorDetails);
      
      return NextResponse.json(
        { error: 'Failed to search users', details: errorDetails },
        { status: error.response?.status || 500 }
      );
    }
  } catch (error: any) {
    console.error('Error searching users:', error);
    
    // For development environments, return mock data on error
    if (process.env.NODE_ENV === 'development') {
      console.log('Using mock user search data in development');
      return NextResponse.json({ 
        results: getMockUserData()
      });
    }
    
    // Check if it's a rate limit error
    if (error.response?.status === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      return NextResponse.json(
        { error: 'Authentication failed. Please reconnect your X account.' },
        { status: 401 }
      );
    }
    
    // Return error details for debugging
    const errorDetails = error.response?.data || error.message || 'Unknown error';
    console.error('Error details:', errorDetails);
    
    return NextResponse.json(
      { error: 'Failed to search users', details: errorDetails },
      { status: error.response?.status || 500 }
    );
  }
}

/**
 * Generate mock user search data for development
 */
function getMockUserData() {
  return [
    {
      id: '44196397',
      username: 'elonmusk',
      name: 'Elon Musk',
      description: 'Owner of X',
      profileImage: 'https://pbs.twimg.com/profile_images/1683325380441128960/yRsRRjGO.jpg',
      verified: true,
      metrics: {
        followers: 193700000,
        following: 1578,
        tweets: 35400
      }
    },
    {
      id: '1724473958',
      username: 'cybertruck',
      name: 'Cybertruck',
      description: 'Cybertruck is designed to have the utility of a truck and the performance of a sports car.',
      profileImage: 'https://pbs.twimg.com/profile_images/1724531691184836608/NbHFzQDr.jpg',
      verified: true,
      metrics: {
        followers: 2100000,
        following: 4,
        tweets: 789
      }
    },
    {
      id: '13298072',
      username: 'Tesla',
      name: 'Tesla',
      description: 'Electric cars, giant batteries and solar',
      profileImage: 'https://pbs.twimg.com/profile_images/1337607516008501250/6Ggc4S5n.png',
      verified: true,
      metrics: {
        followers: 26900000,
        following: 16,
        tweets: 21600
      }
    }
  ];
} 