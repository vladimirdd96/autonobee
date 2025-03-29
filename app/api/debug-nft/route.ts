import { NextResponse } from 'next/server';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Metaplex, Nft, Sft, Metadata } from '@metaplex-foundation/js';

const SOLANA_RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl('devnet');

// Tell Next.js this is a dynamic API route
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // Get wallet from query params using NextRequest
    const { searchParams } = new URL(request.url);
    const wallet = searchParams.get('wallet');
    
    if (!wallet) {
      return NextResponse.json({
        message: 'Wallet address is required as a query parameter: ?wallet=your_wallet_address'
      }, { status: 400 });
    }
    
    // Setup connection and Metaplex instance
    const connection = new Connection(SOLANA_RPC_URL);
    const metaplex = Metaplex.make(connection);
    
    try {
      // Check if the wallet address is valid
      const publicKey = new PublicKey(wallet);
      
      // Find all NFTs owned by this wallet
      const nfts = await metaplex.nfts().findAllByOwner({ owner: publicKey });
      
      // Only include BEEPASS NFTs
      const beeNFTs = nfts.filter(nft => 'symbol' in nft && nft.symbol === 'BEEPASS');
      
      // Fetch full metadata for each BEEPASS NFT
      const fullNFTs = await Promise.all(
        beeNFTs.map(async (nft) => {
          try {
            const fullNft = await metaplex.nfts().load({ metadata: nft as Metadata });
            return {
              name: fullNft.name,
              symbol: fullNft.symbol,
              address: fullNft.address.toString(),
              mint: fullNft.mint.address.toString(),
              json: fullNft.json,
              attributes: fullNft.json?.attributes || [],
              creators: fullNft.creators.map(c => ({ 
                address: c.address.toString(),
                share: c.share,
                verified: c.verified 
              }))
            };
          } catch (error) {
            console.error('Error loading NFT metadata:', error);
            return {
              address: nft.address.toString(),
              error: 'Failed to load full metadata'
            };
          }
        })
      );
      
      return NextResponse.json({
        wallet: wallet,
        totalNFTs: nfts.length,
        beeNFTs: beeNFTs.length,
        nftDetails: fullNFTs
      });
      
    } catch (error) {
      console.error('Invalid wallet address:', error);
      return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in debug-nft API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch NFT data', message: (error as Error).message },
      { status: 500 }
    );
  }
} 