import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import xApiAuth from '../../auth/x/utils/XApiAuth';

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  const userId = cookieStore.get('x_user_id')?.value;
  
  if (!userId) {
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }
  
  try {
    const formData = await request.formData();
    const mediaFile = formData.get('media') as File;
    
    if (!mediaFile) {
      return NextResponse.json({ error: 'Media file is required' }, { status: 400 });
    }
    
    // Convert File to Buffer
    const buffer = Buffer.from(await mediaFile.arrayBuffer());
    
    // Upload media using OAuth 2.0 user context
    const result = await xApiAuth.makeAuthenticatedRequest(
      'media/upload',
      'POST',
      buffer,
      userId,
      false // Use OAuth 2.0
    );
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error uploading media:', error);
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to upload media',
        code: error.code || 'UNKNOWN_ERROR',
        details: error.details || null
      }, 
      { status: error.code === 'RATE_LIMIT' ? 429 : 500 }
    );
  }
} 