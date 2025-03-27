import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

interface ScheduledPost {
  userId: string;
  content: string;
  mediaId?: string;
  scheduledTime: string;
  status: 'pending' | 'completed' | 'failed';
  error?: string;
}

// This endpoint will be called by a cron job every minute
export async function GET(req: Request) {
  try {
    // Get all users' scheduled posts lists
    const userKeys = await kv.keys('user:*:scheduled_posts');
    const now = new Date();

    for (const userKey of userKeys) {
      // Get all scheduled post IDs for this user
      const scheduledPostIds = await kv.lrange(userKey, 0, -1);
      
      for (const postId of scheduledPostIds) {
        // Get the scheduled post data
        const post = await kv.get<ScheduledPost>(postId);
        
        if (!post) continue;
        
        const scheduledTime = new Date(post.scheduledTime);
        
        // Check if it's time to post
        if (scheduledTime <= now && post.status === 'pending') {
          try {
            // Post to X
            const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/post-to-x`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                content: post.content,
                mediaId: post.mediaId,
              }),
            });

            if (!response.ok) {
              throw new Error('Failed to post to X');
            }

            // Update post status to completed
            await kv.set(postId, { ...post, status: 'completed' });
            
            // Remove from scheduled posts list
            await kv.lrem(userKey, 0, postId);
          } catch (error) {
            console.error(`Error posting scheduled content:`, error);
            // Mark as failed
            if (error instanceof Error) {
              await kv.set(postId, { ...post, status: 'failed', error: error.message });
            } else {
              await kv.set(postId, { ...post, status: 'failed', error: 'Unknown error occurred' });
            }
          }
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing scheduled posts:', error);
    return NextResponse.json({ error: 'Failed to process scheduled posts' }, { status: 500 });
  }
} 