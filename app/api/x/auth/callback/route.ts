import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios, { AxiosError } from 'axios';

// Mark route as dynamic
export const dynamic = 'force-dynamic';

/**
 * GET /api/x/auth/callback
 * Handles the X.com OAuth callback
 */
export async function GET(request: NextRequest) {
  try {
    // Get OAuth parameters from URL
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    
    // Get stored state and code verifier from cookies
    const storedState = cookies().get('x_oauth_state')?.value;
    const codeVerifier = cookies().get('x_oauth_code_verifier')?.value;
    
    // Validate state and check for errors
    if (error) {
      console.error('OAuth error:', error);
      return NextResponse.redirect(new URL(`/error?message=${encodeURIComponent(error)}`, process.env.NEXT_PUBLIC_BASE_URL || '/'));
    }
    
    if (!code || !state || !storedState || state !== storedState || !codeVerifier) {
      console.error('Invalid OAuth callback', { code, state, storedState, hasVerifier: !!codeVerifier });
      return NextResponse.redirect(new URL('/error?message=Authentication+failed', process.env.NEXT_PUBLIC_BASE_URL || '/'));
    }
    
    // Get credentials from environment variables
    const clientId = process.env.X_CLIENT_ID;
    const clientSecret = process.env.X_CLIENT_SECRET;
    const callbackUrl = process.env.X_CALLBACK_URL || `${process.env.NEXT_PUBLIC_BASE_URL}/api/x/auth/callback`;
    
    if (!clientId || !clientSecret) {
      console.error('Missing OAuth credentials');
      return NextResponse.redirect(new URL('/error?message=Server+configuration+error', process.env.NEXT_PUBLIC_BASE_URL || '/'));
    }
    
    // Exchange code for access token
    const tokenResponse = await axios.post(
      'https://api.twitter.com/2/oauth2/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: callbackUrl,
        code_verifier: codeVerifier,
        client_id: clientId
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        auth: {
          username: clientId,
          password: clientSecret
        }
      }
    );
    
    const { access_token, refresh_token, expires_in } = tokenResponse.data;
    
    // Save tokens in cookies
    cookies().set('x_auth', 'true', {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      path: '/',
    });
    
    cookies().set('x_access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(Date.now() + expires_in * 1000),
      path: '/',
    });
    
    cookies().set('x_refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      path: '/',
    });
    
    // Clear the OAuth flow cookies
    cookies().set('x_oauth_state', '', { maxAge: 0, path: '/' });
    cookies().set('x_oauth_code_verifier', '', { maxAge: 0, path: '/' });
    
    // Get user info to store username
    try {
      const userResponse = await axios.get('https://api.twitter.com/2/users/me', {
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
        params: {
          'user.fields': 'username,name,profile_image_url'
        }
      });
      
      const { id, username, name, profile_image_url } = userResponse.data.data;
      
      // Store user info in cookies (non-httpOnly for frontend access)
      cookies().set('x_user_id', id, { 
        path: '/',
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      });
      
      cookies().set('x_username', username, { 
        path: '/',
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      });
      
      cookies().set('x_name', name, { 
        path: '/',
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      });
      
      if (profile_image_url) {
        cookies().set('x_profile_image', profile_image_url, { 
          path: '/',
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        });
      }
    } catch (userError) {
      console.error('Error fetching user info:', userError);
      // Continue with auth flow even if user info fetch fails
    }
    
    // Redirect to success page or dashboard
    return NextResponse.redirect(new URL('/dashboard', process.env.NEXT_PUBLIC_BASE_URL || '/'));
  } catch (error) {
    console.error('Error handling OAuth callback:', error);
    
    // Log detailed error information
    if (error instanceof AxiosError && error.response) {
      console.error('Error response:', error.response.data);
    }
    
    return NextResponse.redirect(new URL('/error?message=Authentication+failed', process.env.NEXT_PUBLIC_BASE_URL || '/'));
  }
} 