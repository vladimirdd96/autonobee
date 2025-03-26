import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = cookies();
  
  // Get all cookies related to X authentication
  const accessToken = cookieStore.get('x_access_token');
  const refreshToken = cookieStore.get('x_refresh_token');
  const userData = cookieStore.get('x_user');
  const userId = cookieStore.get('x_user_id');
  
  // Create safe versions of the tokens (first few characters only)
  const safeAccessToken = accessToken?.value 
    ? `${accessToken.value.substring(0, 10)}...` 
    : null;
  
  const safeRefreshToken = refreshToken?.value 
    ? `${refreshToken.value.substring(0, 10)}...` 
    : null;
  
  // Parse user data if it exists
  let parsedUserData = null;
  try {
    if (userData?.value) {
      parsedUserData = JSON.parse(userData.value);
    }
  } catch (error) {
    console.error('Error parsing user data:', error);
  }
  
  return NextResponse.json({
    debug_info: {
      has_access_token: !!accessToken,
      has_refresh_token: !!refreshToken,
      has_user_data: !!userData,
      has_user_id: !!userId,
      access_token_preview: safeAccessToken,
      refresh_token_preview: safeRefreshToken,
      user_id_value: userId?.value,
      parsed_user_data: parsedUserData,
      all_cookies: cookieStore.getAll().map(cookie => ({
        name: cookie.name,
        value: cookie.name.startsWith('x_') ? `${cookie.value.substring(0, 5)}...` : cookie.value
      }))
    }
  });
} 