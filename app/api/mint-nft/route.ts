import { NextResponse } from 'next/server';
import { mintNFTFromServer } from '@/utils/metaplex';

export async function POST(request: Request) {
  try {
    const { address, tier } = await request.json();

    // Validate inputs
    if (!address) {
      return NextResponse.json(
        { message: 'Wallet address is required' },
        { status: 400 }
      );
    }

    if (!tier || (tier !== 'basic' && tier !== 'pro' && tier !== 'enterprise')) {
      return NextResponse.json(
        { message: 'Valid tier (basic, pro, or enterprise) is required' },
        { status: 400 }
      );
    }

    // Enterprise tier is not yet available
    if (tier === 'enterprise') {
      return NextResponse.json(
        { message: 'Enterprise tier is not yet available' },
        { status: 400 }
      );
    }

    // Get private key from environment variables
    const privateKeyBase58 = process.env.SOLANA_PRIVATE_KEY;
    if (!privateKeyBase58) {
      return NextResponse.json(
        { message: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Mint the NFT
    const result = await mintNFTFromServer(address, tier, privateKeyBase58);

    // Set cookies with the response
    return NextResponse.json(
      {
        success: true,
        mint: result.mint,
        tier: tier,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error minting NFT:', error);
    return NextResponse.json(
      { message: 'Failed to mint NFT', error: (error as Error).message },
      { status: 500 }
    );
  }
} 