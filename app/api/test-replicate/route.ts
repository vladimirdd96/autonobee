import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function GET() {
  try {
    console.log("Testing Replicate API...");
    console.log("API Token:", process.env.REPLICATE_API_TOKEN);
    
    const output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          prompt: "A professional robot working with AI, digital art style",
          negative_prompt: "blurry, bad quality, distorted, deformed, text, watermark, logo, signature",
          width: 1024,
          height: 1024,
          num_outputs: 1,
          scheduler: "K_EULER",
          num_inference_steps: 50,
          guidance_scale: 7.5,
          prompt_strength: 0.8,
        }
      }
    );

    console.log("Replicate API Response:", output);
    return NextResponse.json({ output });
  } catch (error) {
    console.error('Error testing Replicate:', error);
    return NextResponse.json(
      { error: 'Failed to test Replicate', details: error },
      { status: 500 }
    );
  }
} 