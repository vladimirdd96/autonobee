import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import xApiAuth from '../../auth/x/utils/XApiAuth';

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  const userId = cookieStore.get('x_user_id')?.value;
  const authMethod = cookieStore.get('x_auth_method')?.value || 'oauth2';
  
  if (!userId) {
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }
  
  try {
    const { text, mediaIds = [] } = await request.json();
    
    if (!text) {
      return NextResponse.json({ error: 'Tweet text is required' }, { status: 400 });
    }
    
    // Prepare the tweet data
    const tweetData: any = {
      text: text
    };
    
    // Add media IDs if provided
    if (mediaIds.length > 0) {
      tweetData.media = {
        media_ids: mediaIds
      };
    }
    
    // Make authenticated request to post tweet using OAuth 2.0
    const result = await xApiAuth.makeAuthenticatedRequest(
      'tweets',
      'POST',
      tweetData,
      userId,
      authMethod === 'oauth1' // Only use OAuth 1.0a if explicitly set
    );
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error posting tweet:', error);
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to post tweet',
        code: error.code || 'UNKNOWN_ERROR',
        details: error.details || null
      }, 
      { status: error.code === 'RATE_LIMIT' ? 429 : 500 }
    );
  }
} 