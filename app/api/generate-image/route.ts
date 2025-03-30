import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
  try {
    const { topic, title, keywords, tone, contentType, content } = await req.json();

    // Use content as topic if topic is not provided
    const imageTopic = topic || content;

    if (!imageTopic) {
      return NextResponse.json(
        { error: 'Topic or content is required for image generation' },
        { status: 400 }
      );
    }

    // Construct a detailed prompt using all available context
    const prompt = `${tone} ${contentType} post about ${imageTopic}${title ? ` titled "${title}"` : ''}${keywords ? ` with keywords: ${keywords}` : ''}. Professional, high-quality, engaging social media image.`;

    console.log('Generating image with prompt:', prompt);

    const prediction = await replicate.predictions.create({
      version: "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      input: {
        prompt,
        negative_prompt: "blurry, bad quality, distorted, deformed, text, watermark, logo, signature",
        width: 1024,
        height: 1024,
        num_outputs: 1,
        scheduler: "K_EULER",
        num_inference_steps: 50,
        guidance_scale: 7.5,
        prompt_strength: 0.8,
      }
    });

    console.log('Prediction created:', prediction);

    // Wait for the prediction to complete
    const finalPrediction = await replicate.wait(prediction);
    console.log('Final prediction:', finalPrediction);

    if (!finalPrediction.output || !finalPrediction.output[0]) {
      throw new Error('No output generated');
    }

    return NextResponse.json({ imageUrl: finalPrediction.output[0] });
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
} 