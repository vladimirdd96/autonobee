import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import xApiAuth from '../utils/XApiAuth';

// Use ngrok URL if available, otherwise use the app URL
const baseUrl = process.env.NGROK_STATIC_DOMAIN 
  ? `https://${process.env.NGROK_STATIC_DOMAIN}` 
  : process.env.NEXT_PUBLIC_APP_URL;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(`${baseUrl}/error?message=${error}`);
  }

  if (!code || !state) {
    return NextResponse.redirect(`${baseUrl}/error?message=Missing required parameters`);
  }

  // Get the stored state and code verifier from cookies
  const cookieStore = cookies();
  const storedState = cookieStore.get('x_auth_state')?.value;
  const codeVerifier = cookieStore.get('x_code_verifier')?.value;

  if (!storedState || !codeVerifier || storedState !== state) {
    return NextResponse.redirect(`${baseUrl}/error?message=Invalid state`);
  }

  try {
    // Exchange the code for access token using our auth manager
    const tokenData = await xApiAuth.getAccessToken(code, codeVerifier);

    // Get user information
    const userResponse = await fetch('https://api.twitter.com/2/users/me', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    });

    if (!userResponse.ok) {
      const errorData = await userResponse.json();
      console.error('User info error:', errorData);
      throw new Error('Failed to get user information');
    }

    const userData = await userResponse.json();
    const userId = userData.data.id;

    // Store the tokens in our auth manager's token store
    xApiAuth.storeUserTokens(userId, tokenData);

    // Store the tokens and user data in cookies
    const response = NextResponse.redirect(`${baseUrl}/dashboard?x_auth_success=true`);
    
    response.cookies.set('x_access_token', tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    if (tokenData.refresh_token) {
      response.cookies.set('x_refresh_token', tokenData.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }

    response.cookies.set('x_user', JSON.stringify(userData.data), {
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

    return response;
  } catch (error) {
    console.error('X OAuth error:', error);
    return NextResponse.redirect(`${baseUrl}/error?message=Authentication failed`);
  }
} 