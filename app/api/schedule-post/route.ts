import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { auth } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { content, mediaId, scheduledTime } = await req.json();
    
    if (!content || !scheduledTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const scheduledPost = {
      userId: session.user.id,
      content,
      mediaId,
      scheduledTime,
      status: 'pending'
    };

    // Generate a unique ID for the scheduled post
    const scheduledPostId = `scheduled_post:${Date.now()}:${Math.random().toString(36).substring(7)}`;
    
    // Store the scheduled post in KV store
    await kv.set(scheduledPostId, scheduledPost);
    
    // Add to user's scheduled posts list
    await kv.lpush(`user:${session.user.id}:scheduled_posts`, scheduledPostId);

    return NextResponse.json({ 
      success: true, 
      message: 'Post scheduled successfully',
      scheduledPostId 
    });
  } catch (error) {
    console.error('Error scheduling post:', error);
    return NextResponse.json({ error: 'Failed to schedule post' }, { status: 500 });
  }
} 