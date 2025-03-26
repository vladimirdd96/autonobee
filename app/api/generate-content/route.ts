import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

// Map length options to character ranges
const lengthRanges = {
  short: { min: 100, max: 150 },
  medium: { min: 150, max: 200 },
  long: { min: 200, max: 280 }
};

// Template structures for different post types
const twitterTemplates = {
  announcement: "Make an announcement about {topic}. Start with a strong hook and end with a clear call-to-action.",
  question: "Frame the content about {topic} as an engaging question that encourages responses and discussion.",
  tip: "Share a valuable tip or insight about {topic} that provides immediate value to the reader.",
  poll: "Create a poll-style post about {topic} that encourages audience participation. Include 2-3 implied options in the content."
};

async function generateContent(prompt: string, lengthRange: { min: number; max: number }, maxAttempts = 3): Promise<string> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: `You are an expert content creator specializing in social media and digital content. Your task is to generate content that STRICTLY adheres to the specified requirements, especially character count limits.

Your priorities are:
1. NEVER exceed the maximum character limit of ${lengthRange.max} characters
2. ALWAYS meet the minimum character limit of ${lengthRange.min} characters
3. Maintain the specified tone and style
4. Incorporate required elements (hashtags, emojis) naturally
5. Follow platform best practices

If you cannot meet ALL requirements, prioritize character count limits above all else.

Current attempt: ${attempt}/${maxAttempts}`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        presence_penalty: 0.6,
        frequency_penalty: 0.5,
        top_p: 0.95,
      });

      const content = completion.choices[0].message.content || '';
      
      if (content.length >= lengthRange.min && content.length <= lengthRange.max) {
        return content;
      }

      if (attempt === maxAttempts) {
        throw new Error(`Unable to generate content within the required length range (${lengthRange.min}-${lengthRange.max} characters) after ${maxAttempts} attempts. Last attempt length: ${content.length} characters.`);
      }
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error;
      }
    }
  }

  throw new Error('Failed to generate content after all attempts');
}

export async function POST(req: Request) {
  try {
    const formData = await req.json();
    const lengthRange = lengthRanges[formData.length as keyof typeof lengthRanges];
    const templateStructure = formData.twitterTemplate ? 
      twitterTemplates[formData.twitterTemplate as keyof typeof twitterTemplates].replace('{topic}', formData.topic) : 
      '';

    const prompt = `Generate ${formData.contentType} content with the following strict requirements:

CONTENT SPECIFICATIONS:
- Topic: ${formData.topic}
- Tone: ${formData.tone}
- Keywords to incorporate: ${formData.keywords}
- Required length: ${lengthRange.min}-${lengthRange.max} characters
- Template style: ${templateStructure}

FORMATTING REQUIREMENTS:
${formData.includeHashtags ? '- Include 2-3 relevant hashtags naturally integrated into the content' : '- Do not include any hashtags'}
${formData.includeEmojis ? '- Include 2-3 relevant emojis strategically placed for engagement' : '- Do not include any emojis'}

Additional Instructions: ${formData.instructions}

CRITICAL REQUIREMENTS:
1. The content MUST be between ${lengthRange.min} and ${lengthRange.max} characters
2. Maintain the specified ${formData.tone} tone throughout
3. Naturally incorporate the provided keywords
4. Follow the ${formData.twitterTemplate} template structure
5. Ensure the content is engaging and optimized for ${formData.contentType}

Generate a single post that meets ALL these requirements.`;

    const generatedContent = await generateContent(prompt, lengthRange);

    return NextResponse.json({ 
      content: generatedContent,
      suggestions: [
        "Consider the best posting time for your audience",
        "Add relevant media to increase engagement",
        "Monitor post performance and engagement metrics",
        "Engage with responses to boost visibility",
        "Consider creating a thread for expanded reach"
      ]
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to generate content',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 