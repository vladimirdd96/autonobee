import { NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';

const client = new TwitterApi({
  appKey: process.env.NEXT_PUBLIC_ACCESS_TOKEN!,
  appSecret: process.env.NEXT_PUBLIC_ACCESS_TOKEN_SECRET!,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const media = formData.get('media') as Blob;

    if (!media) {
      return NextResponse.json(
        { error: 'Media is required' },
        { status: 400 }
      );
    }

    // Convert blob to buffer
    const buffer = Buffer.from(await media.arrayBuffer());

    // Upload media to Twitter
    const mediaId = await client.v1.uploadMedia(buffer, {
      mimeType: media.type,
    });

    return NextResponse.json({ mediaId });
  } catch (error) {
    console.error('Error uploading media:', error);
    return NextResponse.json(
      { error: 'Failed to upload media' },
      { status: 500 }
    );
  }
} 