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
    // Check if KV environment variables are available
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      console.log('KV environment variables are not set, returning mock response');
      return NextResponse.json({ 
        success: true,
        message: 'KV environment variables are not set - unable to process scheduled posts',
        processedPosts: 0
      });
    }

    // Get all users' scheduled posts lists
    const userKeys = await kv.keys('user:*:scheduled_posts');
    
    // If no scheduled posts found, return early
    if (!userKeys || userKeys.length === 0) {
      return NextResponse.json({ 
        success: true,
        message: 'No scheduled posts found',
        processedPosts: 0
      });
    }
    
    const now = new Date();
    let processedCount = 0;

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
            
            processedCount++;
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

    return NextResponse.json({ 
      success: true,
      message: processedCount > 0 ? `Processed ${processedCount} posts` : 'No posts needed processing',
      processedPosts: processedCount
    });
  } catch (error) {
    console.error('Error processing scheduled posts:', error);
    
    return NextResponse.json({ 
      success: false,
      error: 'Failed to process scheduled posts',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 