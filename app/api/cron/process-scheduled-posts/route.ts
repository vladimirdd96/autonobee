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

// This endpoint will be called by a cron job once per day
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

    // Safely try to get all users' scheduled posts lists
    let userKeys: string[] = [];
    try {
      userKeys = await kv.keys('user:*:scheduled_posts');
    } catch (error) {
      console.error('Error connecting to KV store:', error);
      return NextResponse.json({ 
        success: true,
        message: 'Unable to connect to KV store - unable to process scheduled posts',
        processedPosts: 0
      });
    }
    
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
    let pendingFutureCount = 0;

    for (const userKey of userKeys) {
      // Safely get all scheduled post IDs for this user
      let scheduledPostIds: string[] = [];
      try {
        scheduledPostIds = await kv.lrange(userKey, 0, -1);
      } catch (error) {
        console.error(`Error fetching scheduled posts for user key ${userKey}:`, error);
        continue;
      }
      
      for (const postId of scheduledPostIds) {
        // Safely get the scheduled post data
        let post: ScheduledPost | null = null;
        try {
          post = await kv.get<ScheduledPost>(postId);
        } catch (error) {
          console.error(`Error fetching post with ID ${postId}:`, error);
          continue;
        }
        
        if (!post) continue;
        
        const scheduledTime = new Date(post.scheduledTime);
        
        // Check if it's time to post (due now or overdue)
        if (scheduledTime <= now && post.status === 'pending') {
          try {
            // Post to X
            const postUrl = process.env.NEXT_PUBLIC_APP_URL 
              ? `${process.env.NEXT_PUBLIC_APP_URL}/api/post-to-x` 
              : '/api/post-to-x';

            const response = await fetch(postUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                content: post.content,
                mediaId: post.mediaId,
                userId: post.userId
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
        } else if (scheduledTime > now && post.status === 'pending') {
          // Count posts that are scheduled for the future
          pendingFutureCount++;
        }
      }
    }

    return NextResponse.json({ 
      success: true,
      message: processedCount > 0 
        ? `Processed ${processedCount} posts. ${pendingFutureCount} posts still pending for future publishing.` 
        : `No posts needed processing. ${pendingFutureCount} posts still pending for future publishing.`,
      processedPosts: processedCount,
      pendingFuturePosts: pendingFutureCount
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