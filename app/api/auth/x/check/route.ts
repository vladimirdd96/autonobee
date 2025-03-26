import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('x_access_token');
  const userData = cookieStore.get('x_user');

  if (!accessToken || !userData) {
    return NextResponse.json({ authorized: false });
  }

  try {
    // Verify token is still valid
    const response = await fetch('https://api.twitter.com/2/users/me', {
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json({ authorized: false });
    }

    return NextResponse.json({
      authorized: true,
      user: JSON.parse(userData.value),
    });
  } catch (error) {
    console.error('Error checking X auth:', error);
    return NextResponse.json({ authorized: false });
  }
} 