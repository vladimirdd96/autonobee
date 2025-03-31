export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { xAuthClient } from '@/lib/x-auth';

/**
 * GET /api/x/callback
 * Handles the callback from X.com OAuth flow
 */
export async function GET(request: NextRequest) {
  try {
    // Get the query parameters
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    
    // Get the stored state and code verifier from cookies
    const storedState = cookies().get('x_oauth_state')?.value;
    const codeVerifier = cookies().get('x_oauth_code_verifier')?.value;
    
    // If there was an error or the state doesn't match, redirect to error page
    if (error || !state || !storedState || state !== storedState || !code || !codeVerifier) {
      const errorMsg = error || 'Invalid state or missing parameters';
      console.error('OAuth error:', errorMsg);
      return NextResponse.redirect(new URL(`/error?message=${encodeURIComponent(errorMsg)}`, process.env.NEXT_PUBLIC_BASE_URL || ''));
    }
    
    // Exchange code for access token
    const tokens = await xAuthClient.getAccessToken(code, codeVerifier);
    
    // Generate a user ID - in production this would be linked to your user database
    const userId = crypto.randomUUID();
    
    // Store tokens in memory
    xAuthClient.storeUserTokens(userId, tokens);
    
    // Set user ID in cookie
    cookies().set('x_user_id', userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });
    
    // Set x_authorized cookie for middleware
    cookies().set('x_authorized', 'true', {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });
    
    // Clear state and code verifier cookies
    cookies().set('x_oauth_state', '', { maxAge: 0, path: '/' });
    cookies().set('x_oauth_code_verifier', '', { maxAge: 0, path: '/' });
    
    // Check if there's a redirect path stored in cookies
    const redirectAfterAuth = cookies().get('redirect_after_x_auth')?.value || '/dashboard';
    cookies().set('redirect_after_x_auth', '', { maxAge: 0, path: '/' });
    
    // Redirect to the dashboard or the original path
    return NextResponse.redirect(new URL(redirectAfterAuth, process.env.NEXT_PUBLIC_BASE_URL || ''));
  } catch (error) {
    console.error('Error handling X.com OAuth callback:', error);
    
    // Redirect to error page
    return NextResponse.redirect(new URL('/error?message=Failed to complete X authentication', process.env.NEXT_PUBLIC_BASE_URL || ''));
  }
} 