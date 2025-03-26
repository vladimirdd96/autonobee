import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import xApiAuth from '../utils/XApiAuth';

// Use ngrok URL if available, otherwise use the app URL
const baseUrl = process.env.NGROK_STATIC_DOMAIN 
  ? `https://${process.env.NGROK_STATIC_DOMAIN}` 
  : process.env.NEXT_PUBLIC_APP_URL;

export async function GET() {
  const cookieStore = cookies();
  const userId = cookieStore.get('x_user_id')?.value;

  if (userId) {
    // Revoke tokens in our auth manager
    await xApiAuth.revokeTokens(userId);
  }

  // Clear cookies
  const response = NextResponse.redirect(`${baseUrl}/`);
  
  response.cookies.delete('x_access_token');
  response.cookies.delete('x_refresh_token');
  response.cookies.delete('x_user');
  response.cookies.delete('x_user_id');
  
  return response;
} 