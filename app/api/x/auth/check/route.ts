import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * GET /api/x/auth/check
 * Checks if the user is authenticated with X.com
 */
export async function GET(request: NextRequest) {
  try {
    // Check auth cookie
    const isAuthenticated = cookies().get('x_auth')?.value === 'true';
    
    // Get user info
    const userId = cookies().get('x_user_id')?.value;
    const username = cookies().get('x_username')?.value;
    const name = cookies().get('x_name')?.value;
    const profileImage = cookies().get('x_profile_image')?.value;
    
    // Return auth status and user info if authenticated
    if (isAuthenticated && userId) {
      return NextResponse.json({
        isAuthenticated: true,
        user: {
          id: userId,
          username,
          name,
          profileImage
        }
      });
    }
    
    // Return false if not authenticated
    return NextResponse.json({ isAuthenticated: false });
  } catch (error) {
    console.error('Error checking X auth status:', error);
    return NextResponse.json(
      { isAuthenticated: false, error: 'Failed to check auth status' },
      { status: 500 }
    );
  }
} 