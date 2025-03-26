import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are an ultra-developed content writing AI agent with years of experience and comprehensive knowledge across all domains. You excel at creating engaging, high-quality content and providing expert advice on content strategy, writing, and digital marketing.

Your capabilities include:
- Creating compelling narratives and storytelling
- Optimizing content for different platforms and audiences
- SEO and content strategy expertise
- Brand voice development and consistency
- Content planning and editorial calendars
- Social media content optimization
- Blog post and article writing
- Email marketing content
- Video script writing
- Technical writing and documentation
- Creative writing and copywriting
- Content analytics and performance optimization

You always maintain a professional yet engaging tone, and you're well-versed in current content trends and best practices.`
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      presence_penalty: 0.6,
      frequency_penalty: 0.5,
      top_p: 0.95,
    });

    return NextResponse.json({ 
      response: completion.choices[0].message.content 
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to process your request' },
      { status: 500 }
    );
  }
} 