import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';
import crypto from 'crypto';

/**
 * GET /api/auth/x
 * Initiates X.com OAuth flow
 */
export async function GET(request: NextRequest) {
  try {
    // Get X.com API credentials from environment variables
    const clientId = process.env.X_CLIENT_ID;
    const callbackUrl = process.env.X_CALLBACK_URL || `${process.env.NEXT_PUBLIC_BASE_URL}/api/x/auth/callback`;
    
    if (!clientId) {
      console.error('X_CLIENT_ID is not set');
      return NextResponse.json(
        { error: 'OAuth configuration error' },
        { status: 500 }
      );
    }
    
    console.log('Using callback URL:', callbackUrl);
    
    // Generate code verifier and challenge for PKCE
    const codeVerifier = generateRandomString();
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    
    // Generate state to prevent CSRF attacks
    const state = crypto.randomUUID();
    
    // Store code verifier and state in cookies
    cookies().set('x_oauth_code_verifier', codeVerifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 10, // 10 minutes
      path: '/'
    });
    
    cookies().set('x_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 10, // 10 minutes
      path: '/'
    });
    
    // Build authorization URL
    const authUrl = new URL('https://twitter.com/i/oauth2/authorize');
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('client_id', clientId);
    authUrl.searchParams.append('redirect_uri', callbackUrl);
    authUrl.searchParams.append('scope', 'tweet.read tweet.write users.read offline.access');
    authUrl.searchParams.append('state', state);
    authUrl.searchParams.append('code_challenge', codeChallenge);
    authUrl.searchParams.append('code_challenge_method', 'S256');
    
    // Redirect to X.com for authentication
    return NextResponse.redirect(authUrl.toString());
  } catch (error) {
    console.error('Error initiating X.com OAuth flow:', error);
    return NextResponse.json(
      { error: 'Failed to initiate authentication' },
      { status: 500 }
    );
  }
}

/**
 * Generate a random string for PKCE code verifier
 */
function generateRandomString(length = 64): string {
  return crypto.randomBytes(length)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
    .slice(0, length);
}

/**
 * Generate code challenge from code verifier for PKCE
 */
async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * GET /api/auth/x/check
 * Checks if user is authenticated with X
 */
export async function GET_check(request: NextRequest) {
  try {
    // Check if the user has an x_auth cookie
    const isAuthenticated = !!cookies().get('x_auth')?.value;
    
    return NextResponse.json({ isAuthenticated });
  } catch (error) {
    console.error('Error checking X auth status:', error);
    return NextResponse.json({ isAuthenticated: false });
  }
} 