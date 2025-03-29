import { NextResponse } from 'next/server';
import { fetchWalletNFTs } from '@/utils/metaplex';

// Tell Next.js this is a dynamic API route
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // Get wallet address from query params
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('address');

    if (!walletAddress) {
      return NextResponse.json(
        { message: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // Fetch NFTs owned by the wallet
    const nfts = await fetchWalletNFTs(walletAddress);

    return NextResponse.json({
      success: true,
      nfts,
    });
  } catch (error) {
    console.error('Error fetching wallet NFTs:', error);
    return NextResponse.json(
      { message: 'Failed to fetch wallet NFTs', error: (error as Error).message },
      { status: 500 }
    );
  }
} 