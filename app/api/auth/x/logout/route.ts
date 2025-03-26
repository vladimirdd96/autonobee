import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = cookies();
  
  // Clear all X-related cookies
  cookieStore.delete('x_access_token');
  cookieStore.delete('x_refresh_token');
  cookieStore.delete('x_user');

  return NextResponse.json({ success: true });
} 