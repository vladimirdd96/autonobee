import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { mintNFTFromServer } from '@/utils/metaplex';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Secure environment variables that are only available on the server
const CREATOR_PRIVATE_KEY = process.env.CREATOR_PRIVATE_KEY;

export async function POST(request: NextRequest) {
  try {
    // Validate private key
    if (!CREATOR_PRIVATE_KEY) {
      return NextResponse.json(
        { error: 'Server configuration error: Missing private key' },
        { status: 500 }
      );
    }

    // Parse request body
    const { receiverAddress, tier } = await request.json();

    // Validate input
    if (!receiverAddress || !tier || !['basic', 'pro'].includes(tier)) {
      return NextResponse.json(
        { error: 'Invalid input parameters' },
        { status: 400 }
      );
    }

    console.log('Preparing to mint NFT for:', receiverAddress, 'with tier:', tier);
    
    // Mint the NFT using Metaplex
    const nftResult = await mintNFTFromServer(
      receiverAddress,
      tier as 'basic' | 'pro',
      CREATOR_PRIVATE_KEY
    );

    console.log('NFT minted successfully:', nftResult);

    // Update user record in Supabase
    const { error: dbError } = await supabase
      .from('users')
      .upsert({
        id: receiverAddress,
        has_nft: true,
        deployed_agent_mint: nftResult.mint,
        deployed_agent_metadata: nftResult.metadata, 
        minted_on: new Date().toISOString(),
      });

    if (dbError) {
      console.error('Database error:', dbError);
      // Still return success since NFT was minted
    }

    return NextResponse.json({
      success: true,
      message: 'NFT minted successfully',
      result: nftResult
    });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to mint NFT', 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}