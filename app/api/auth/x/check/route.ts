import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Mark route as dynamic
export const dynamic = 'force-dynamic';

export async function GET() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('x_access_token')?.value;
  const userData = cookieStore.get('x_user')?.value;
  const authMethod = cookieStore.get('x_auth_method')?.value || 'oauth2'; // Default to OAuth 2.0
  
  if (!accessToken || !userData) {
    return NextResponse.json({ authorized: false });
  }
  
  try {
    // Parse user data from cookie
    const user = JSON.parse(userData);
    
    return NextResponse.json({
      authorized: true,
      authMethod,
      user: {
        id: user.id,
        name: user.name,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Error parsing user data:', error);
    return NextResponse.json({ authorized: false });
  }
} 