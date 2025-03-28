import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Secure environment variables that are only available on the server
const SHYFT_API_KEY = process.env.SHYFT_API_KEY;
const CREATOR_WALLET = process.env.CREATOR_WALLET;
const CREATOR_PRIVATE_KEY = process.env.CREATOR_PRIVATE_KEY;

interface NFTMetadata {
  name: string;
  symbol: string;
  description: string;
  image: string;
  attributes: { trait_type: string; value: string }[];
}

export async function POST(request: NextRequest) {
  try {
    // Validate API keys
    if (!SHYFT_API_KEY || !CREATOR_WALLET || !CREATOR_PRIVATE_KEY) {
      return NextResponse.json(
        { error: 'Server configuration error' },
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

    // Prepare NFT metadata
    const metadata: NFTMetadata = {
      name: `AutonoBee ${tier === 'pro' ? 'Pro' : 'Basic'} Pass`,
      symbol: "BEEPASS",
      description: `${tier === 'pro' ? 'Pro' : 'Basic'} NFT pass to access AutonoBee's AI tools`,
      image: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
      attributes: [{ trait_type: "Tier", value: tier }]
    };

    // Prepare request to Shyft API
    const requestData = {
      network: 'devnet',
      wallet: CREATOR_WALLET,
      nft_receiver: receiverAddress,
      private_key: CREATOR_PRIVATE_KEY,
      ...metadata,
      max_supply: 1,
      royalty: 5,
      external_url: process.env.NEXT_PUBLIC_APP_URL
    };

    // Call Shyft API to mint NFT
    const response = await fetch('https://api.shyft.to/sol/v2/nft/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': SHYFT_API_KEY,
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    const responseData = await response.json();

    if (!response.ok || responseData.success === false) {
      console.error('Shyft API error:', responseData);
      return NextResponse.json(
        { error: responseData.message || 'Failed to mint NFT' },
        { status: response.status }
      );
    }

    // Update user record in Supabase
    const { error: dbError } = await supabase
      .from('users')
      .upsert({
        id: receiverAddress,
        has_nft: true,
        deployed_agent_ca: responseData.result.contract_address,
        deployed_agent_mint: responseData.result.mint,
        deployed_agent_tx: responseData.result.tx_signature,
        minted_on: new Date().toISOString(),
      });

    if (dbError) {
      console.error('Database error:', dbError);
      // Still return success since NFT was minted
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}