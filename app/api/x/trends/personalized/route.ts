import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import xApiAuth from '@/app/api/auth/x/utils/XApiAuth';

// Debug logger
const logDebug = (message: string, data?: any) => {
  console.log(`[X API PERSONALIZED DEBUG] ${message}`, data ? data : '');
};

// Mock trends data to use when API fails or in development
const getMockTrendsData = () => {
  return {
    trends: [
      {
        name: '#AI',
        url: 'https://twitter.com/search?q=%23AI',
        promoted_content: null,
        query: 'AI',
        tweet_volume: 125000
      },
      {
        name: '#DigitalMarketing',
        url: 'https://twitter.com/search?q=%23DigitalMarketing',
        promoted_content: null,
        query: 'DigitalMarketing',
        tweet_volume: 85000
      },
      {
        name: '#ContentCreation',
        url: 'https://twitter.com/search?q=%23ContentCreation',
        promoted_content: null,
        query: 'ContentCreation',
        tweet_volume: 65000
      },
      {
        name: '#SocialMedia',
        url: 'https://twitter.com/search?q=%23SocialMedia',
        promoted_content: null,
        query: 'SocialMedia',
        tweet_volume: 95000
      },
      {
        name: '#TechNews',
        url: 'https://twitter.com/search?q=%23TechNews',
        promoted_content: null,
        query: 'TechNews',
        tweet_volume: 75000
      }
    ],
    as_of: new Date().toISOString(),
    created_at: new Date().toISOString(),
    locations: [
      {
        name: 'Worldwide',
        woeid: 1
      }
    ]
  };
};

export async function GET(request: NextRequest) {
  // Always use mock data in development or production
  if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development') {
    logDebug('Using mock trends data in ' + process.env.NODE_ENV + ' mode');
    return NextResponse.json(getMockTrendsData());
  }
  
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get('x_user_id')?.value;

    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    const result = await xApiAuth.makeAuthenticatedRequest(
      'trends/place?id=1',
      'GET',
      null,
      userId
    );
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error fetching personalized trends:', error);
    
    // Return mock data on error
    logDebug('Error occurred, using mock trends data');
    return NextResponse.json(getMockTrendsData());
  }
} 