import { NextResponse } from 'next/server';
import xApiAuth from '../utils/XApiAuth';

// Use ngrok URL if available, otherwise use the app URL
const baseUrl = process.env.NGROK_STATIC_DOMAIN 
  ? `https://${process.env.NGROK_STATIC_DOMAIN}` 
  : process.env.NEXT_PUBLIC_APP_URL;

export async function GET() {
  // Filter out sensitive information from credentials
  const safeCredentials = {
    apiKey: xApiAuth.apiKey ? `${xApiAuth.apiKey.substring(0, 4)}...` : 'Not set',
    apiKeySecret: xApiAuth.apiKeySecret ? 'Set (hidden)' : 'Not set',
    bearerToken: xApiAuth.bearerToken ? 'Set (hidden)' : 'Not set',
    clientId: xApiAuth.clientId ? `${xApiAuth.clientId.substring(0, 4)}...` : 'Not set',
    clientSecret: xApiAuth.clientSecret ? 'Set (hidden)' : 'Not set',
  };

  return NextResponse.json({
    message: 'X API Authentication Test',
    callbackUrl: xApiAuth.callbackUrl,
    env: {
      usingNgrok: !!process.env.NGROK_STATIC_DOMAIN,
      ngrokDomain: process.env.NGROK_STATIC_DOMAIN || 'Not set',
      appUrl: process.env.NEXT_PUBLIC_APP_URL,
    },
    credentials: safeCredentials,
    authUrls: {
      authorize: `${baseUrl}/api/auth/x/authorize`,
      callback: `${baseUrl}/api/auth/x/callback`,
      logout: `${baseUrl}/api/auth/x/logout`,
      request: `${baseUrl}/api/auth/x/request`,
    },
    examples: {
      tweet: `${baseUrl}/api/auth/x/request?endpoint=tweets/search/recent?query=hello`,
      userProfile: `After login, make a POST to ${baseUrl}/api/auth/x/request with body: {"endpoint":"users/me"}`,
    }
  });
} 