import { NextResponse } from 'next/server';
import crypto from 'crypto';

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
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/x/callback`;

export async function GET() {
  if (!X_CLIENT_ID) {
    return NextResponse.json({ error: 'X Client ID not configured' }, { status: 500 });
  }

  const state = crypto.randomBytes(16).toString('hex');
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);

  // Store the state and code verifier in a secure session/cookie
  // This will be used to verify the callback
  const response = NextResponse.redirect(
    `https://twitter.com/i/oauth2/authorize?` +
    `response_type=code` +
    `&client_id=${process.env.X_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&scope=tweet.read%20tweet.write%20users.read%20offline.access` +
    `&state=${state}` +
    `&code_challenge=${codeChallenge}` +
    `&code_challenge_method=S256`
  );

  // Store the state and code verifier in cookies
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