import { NextResponse } from 'next/server';
import xApiAuth from '../utils/XApiAuth';

// Use ngrok URL if available, otherwise use the app URL
const baseUrl = process.env.NEXT_PUBLIC_NGROK_STATIC_DOMAIN 
  ? `https://${process.env.NEXT_PUBLIC_NGROK_STATIC_DOMAIN}` 
  : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function GET(request: Request) {
  try {
    // Validate that we have OAuth 1.0a credentials
    if (!xApiAuth.accessToken || !xApiAuth.accessTokenSecret || !xApiAuth.apiKey || !xApiAuth.apiKeySecret) {
      console.error('OAuth 1.0a credentials not configured');
      return NextResponse.json(
        { error: 'OAuth 1.0a credentials not properly configured' }, 
        { status: 500 }
      );
    }

    // Get the source page if provided
    const { searchParams } = new URL(request.url);
    const sourcePage = searchParams.get('source_page') || '/dashboard';

    // Make a test request to verify credentials using OAuth 1.0a
    try {
      // Get current user info
      const userData = await xApiAuth.makeOAuth1Request('users/me', 'GET');
      
      if (!userData || !userData.data) {
        throw new Error('Could not retrieve user data with OAuth 1.0a credentials');
      }
      
      // Use existing access token and create a direct session
      const userId = userData.data.id;
      const userName = userData.data.username;
      const name = userData.data.name;
      
      // Create the response with tokens
      const response = NextResponse.redirect(`${baseUrl}${sourcePage}?x_auth_success=true&auth_method=oauth1`);
      
      // Store access token in cookies
      response.cookies.set('x_access_token', xApiAuth.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
      
      response.cookies.set('x_access_token_secret', xApiAuth.accessTokenSecret, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
      
      // Store user data
      response.cookies.set('x_user', JSON.stringify({
        id: userId,
        username: userName,
        name: name
      }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
      
      // Store user ID for later reference
      response.cookies.set('x_user_id', userId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
      
      // Store auth method
      response.cookies.set('x_auth_method', 'oauth1', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
      
      return response;
    } catch (error: any) {
      console.error('OAuth 1.0a authentication error:', error);
      return NextResponse.redirect(`${baseUrl}/error?message=Failed to authenticate with OAuth 1.0a&details=${encodeURIComponent(error.message || '')}`);
    }
  } catch (error: any) {
    console.error('Error in OAuth 1.0a authorization route:', error);
    return NextResponse.json(
      { error: 'Failed to process OAuth 1.0a authentication' }, 
      { status: 500 }
    );
  }
} 