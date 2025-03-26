import { NextResponse } from 'next/server';
import crypto from 'crypto';
import xApiAuth from '../utils/XApiAuth';

// Generate a random state and code verifier for PKCE
function generateCodeVerifier() {
  return crypto.randomBytes(32)
    .toString('base64')
    .replace(/[^a-zA-Z0-9]/g, '')
    .substring(0, 128);
}

function generateCodeChallenge(verifier: string) {
  return crypto.createHash('sha256')
    .update(verifier)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

const X_CLIENT_ID = process.env.X_CLIENT_ID;

// Use ngrok URL if available, otherwise use the app URL
const baseUrl = process.env.NGROK_STATIC_DOMAIN 
  ? `https://${process.env.NGROK_STATIC_DOMAIN}` 
  : process.env.NEXT_PUBLIC_APP_URL;

const REDIRECT_URI = `${baseUrl}/api/auth/x/callback`;

export async function GET() {
  if (!process.env.NEXT_PUBLIC_X_CLIENT_ID) {
    return NextResponse.json({ error: 'X Client ID not configured' }, { status: 500 });
  }

  // Generate a random state for security
  const state = crypto.randomBytes(16).toString('hex');

  // Get authorization URL and code verifier using our auth manager
  const { url, codeVerifier } = xApiAuth.generateAuthUrl(state);

  console.log('Using callback URL:', xApiAuth.callbackUrl);

  // Create response that redirects to X's authorization page
  const response = NextResponse.redirect(url);

  // Store the state and code verifier in cookies for later verification
  response.cookies.set('x_auth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10 // 10 minutes
  });

  response.cookies.set('x_code_verifier', codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10 // 10 minutes
  });

  return response;
} 