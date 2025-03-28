const SHYFT_API_KEY = process.env.NEXT_PUBLIC_SHYFT_API_KEY;
const CREATOR_WALLET = process.env.NEXT_PUBLIC_CREATOR_WALLET;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') || 'http://localhost:3000';

interface NFTMetadata {
  name: string;
  symbol: string;
  description: string;
  image: string;
  attributes: { trait_type: string; value: string }[];
}

export async function mintNFT(receiverAddress: string, tier: 'basic' | 'pro'): Promise<any> {
  if (!SHYFT_API_KEY) {
    throw new Error('Shyft API key is not configured');
  }

  if (!CREATOR_WALLET) {
    throw new Error('Creator wallet is not configured');
  }

  const metadata: NFTMetadata = {
    name: `AutonoBee ${tier === 'pro' ? 'Pro' : 'Basic'} Pass`,
    symbol: "BEEPASS",
    description: `${tier === 'pro' ? 'Pro' : 'Basic'} NFT pass to access AutonoBee's AI tools`,
    image: `${APP_URL}/images/autonobee-logo-transparent.png`,
    attributes: [{ trait_type: "Tier", value: tier }]
  };

  const requestData = {
    network: 'devnet',
    creator_wallet: CREATOR_WALLET,
    receiver_wallet: receiverAddress,
    ...metadata,
  };

  console.log('Minting NFT with config:', requestData);
  console.log('Using Shyft API key:', SHYFT_API_KEY);

  try {
    const response = await fetch('https://api.shyft.to/sol/v1/nft/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': SHYFT_API_KEY,
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    const responseData = await response.json();
    console.log('Shyft API response:', responseData);

    if (!response.ok) {
      throw new Error(responseData.error || 'Failed to mint NFT');
    }

    return responseData;
  } catch (error) {
    console.error('Error minting NFT:', error);
    throw error;
  }
}

export async function checkNFTOwnership(walletAddress: string): Promise<{
  hasBeeNFT: boolean;
  tier: 'basic' | 'pro' | null;
}> {
  try {
    const response = await fetch(
      `https://api.shyft.to/sol/v1/wallet/all_nfts?network=devnet&wallet=${walletAddress}`,
      {
        headers: {
          'x-api-key': SHYFT_API_KEY || '',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch NFTs');
    }

    const data = await response.json();
    const beeNFT = data.result?.find((nft: any) => 
      nft.symbol === 'BEEPASS' && 
      nft.creator === CREATOR_WALLET
    );

    if (!beeNFT) {
      return { hasBeeNFT: false, tier: null };
    }

    const tier = beeNFT.attributes?.find((attr: any) => 
      attr.trait_type === 'Tier'
    )?.value?.toLowerCase() as 'basic' | 'pro';

    return {
      hasBeeNFT: true,
      tier: tier || null,
    };
  } catch (error) {
    console.error('Error checking NFT ownership:', error);
    return { hasBeeNFT: false, tier: null };
  }
} 