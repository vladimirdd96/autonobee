import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('x_access_token')?.value;
  const userData = cookieStore.get('x_user')?.value;
  
  if (!accessToken || !userData) {
    return NextResponse.json({ authorized: false });
  }
  
  try {
    // Parse user data from cookie
    const user = JSON.parse(userData);
    
    return NextResponse.json({
      authorized: true,
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