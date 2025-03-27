import { NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';

const client = new TwitterApi({
  appKey: process.env.NEXT_PUBLIC_ACCESS_TOKEN!,
  appSecret: process.env.NEXT_PUBLIC_ACCESS_TOKEN_SECRET!,
});

export async function POST(req: Request) {
  try {
    const { content, mediaId } = await req.json();

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    // Post tweet with optional media
    const tweet = await client.v2.tweet({
      text: content,
      ...(mediaId && { media: { media_ids: [mediaId] } }),
    });

    return NextResponse.json({ tweetId: tweet.data.id });
  } catch (error) {
    console.error('Error posting to X:', error);
    return NextResponse.json(
      { error: 'Failed to post to X' },
      { status: 500 }
    );
  }
} 