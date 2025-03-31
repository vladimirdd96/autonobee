import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Mark route as dynamic
export const dynamic = 'force-dynamic';

/**
 * GET /api/x/auth/check
 * Checks if user is authenticated with X
 */
export async function GET(request: NextRequest) {
  try {
    // Check if the user has an x_auth cookie
    const isAuthenticated = !!cookies().get('x_auth')?.value;
    
    return NextResponse.json({ isAuthenticated });
  } catch (error) {
    console.error('Error checking X auth status:', error);
    return NextResponse.json({ isAuthenticated: false });
  }
} 