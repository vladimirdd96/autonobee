import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import xApiAuth from '../utils/XApiAuth';

// Mark route as dynamic
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  const userId = cookieStore.get('x_user_id')?.value;
  
  if (!userId) {
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }
  
  try {
    const requestBody = await request.json();
    const { endpoint, method = 'GET', data = null } = requestBody;
    
    if (!endpoint) {
      return NextResponse.json({ error: 'Endpoint is required' }, { status: 400 });
    }
    
    // Make authenticated request using our auth manager
    const result = await xApiAuth.makeAuthenticatedRequest(endpoint, method, data, userId);
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('X API request error:', error);
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to make API request',
        code: error.code || 'UNKNOWN_ERROR',
        details: error.details || null
      }, 
      { status: error.code === 'RATE_LIMIT' ? 429 : 500 }
    );
  }
}

// For simple endpoints - app-only context
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint');
  
  if (!endpoint) {
    return NextResponse.json({ error: 'Endpoint is required' }, { status: 400 });
  }
  
  try {
    // Make app-only authenticated request
    const result = await xApiAuth.makeAuthenticatedRequest(endpoint);
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('X API request error:', error);
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to make API request',
        code: error.code || 'UNKNOWN_ERROR',
        details: error.details || null
      }, 
      { status: error.code === 'RATE_LIMIT' ? 429 : 500 }
    );
  }
} 