import { Connection, Keypair, PublicKey, clusterApiUrl } from '@solana/web3.js';
import {
  Metaplex,
  keypairIdentity,
  walletAdapterIdentity,
  StorageDriver,
  MetaplexFile,
  Nft,
  Sft,
  Metadata,
  NftWithToken,
  UploadMetadataInput,
  mockStorage,
} from '@metaplex-foundation/js';
import bs58 from 'bs58';

// Use environment variables with fallbacks for development
const SOLANA_RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl('devnet');
const NETWORK = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') || 'http://localhost:3000';

// Rate limiting settings
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 2000; // 2 seconds between requests to avoid rate limiting
const connectionPool: { [key: string]: Connection } = {};

// Get a connection with a timeout to prevent hanging requests
function getConnection(): Connection {
  // Create connection if needed
  if (!connectionPool['default']) {
    connectionPool['default'] = new Connection(SOLANA_RPC_URL, {
      commitment: 'confirmed',
      disableRetryOnRateLimit: false,
      confirmTransactionInitialTimeout: 60000, // 60 seconds
    });
  }
  
  return connectionPool['default'];
}

// Helper to wait between requests
async function throttleRequest() {
  const now = Date.now();
  const timeElapsed = now - lastRequestTime;
  
  if (timeElapsed < MIN_REQUEST_INTERVAL) {
    const delay = MIN_REQUEST_INTERVAL - timeElapsed;
    console.log(`Throttling Solana API request, waiting ${delay}ms`);
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  
  lastRequestTime = Date.now();
}

interface NFTMetadata {
  name: string;
  symbol: string;
  description: string;
  image: string;
  attributes: { trait_type: string; value: string }[];
}

// Helper function to convert file to Metaplex format
async function toMetaplexFile(buffer: Buffer, fileName: string): Promise<MetaplexFile> {
  return {
    buffer,
    fileName,
    displayName: fileName,
    uniqueName: fileName,
    contentType: 'image/png',
    extension: 'png',
    tags: [],
  };
}

// Client-side NFT creation that returns transaction for signing
export async function prepareNFTTransaction(
  receiverAddress: string, 
  tier: 'basic' | 'pro' | 'enterprise',
  wallet: any // Wallet adapter instance
): Promise<any> {
  // For development, use the wallet's public key if env var isn't set
  if (!wallet?.publicKey) {
    throw new Error('Wallet is not connected');
  }

  try {
    // Setup Metaplex with mock storage to avoid Bundlr issues
    const connection = new Connection(SOLANA_RPC_URL);
    const metaplex = Metaplex.make(connection)
      .use(walletAdapterIdentity(wallet))
      .use(mockStorage()); // Use mock storage instead of Bundlr

    // Create NFT metadata
    const metadata: NFTMetadata = {
      name: `AutonoBee ${tier === 'pro' ? 'Pro' : tier === 'enterprise' ? 'Enterprise' : 'Basic'} Pass`,
      symbol: "BEEPASS",
      description: `${tier === 'pro' ? 'Pro' : tier === 'enterprise' ? 'Enterprise' : 'Basic'} NFT pass to access AutonoBee's AI tools`,
      image: `${APP_URL}/images/autonobee-logo-transparent.png`,
      attributes: [{ trait_type: "Tier", value: tier }]
    };

    console.log('Preparing NFT with config:', metadata);

    // Instead of uploading the image, just use a direct URL
    const imageUri = metadata.image;
    console.log('Using direct image URL:', imageUri);

    // Create simplified metadata JSON
    const metadataInput: UploadMetadataInput = {
      name: metadata.name,
      symbol: metadata.symbol,
      description: metadata.description,
      image: imageUri,
      attributes: metadata.attributes,
    };

    // With mock storage, this doesn't actually upload but returns a fake URI
    const { uri } = await metaplex.nfts().uploadMetadata(metadataInput);
    console.log('Metadata URI (mocked):', uri);

    // Create NFT using the proper Metaplex method
    // This returns the transaction builder that can be used for signing
    const transactionBuilder = await metaplex.nfts().builders().create({
      uri,
      name: metadata.name,
      sellerFeeBasisPoints: 500, // 5% royalty
      symbol: metadata.symbol,
      creators: [{ address: new PublicKey(wallet.publicKey.toString()), share: 100 }],
      isMutable: true,
    });

    return {
      transactionBuilder,
      metaplex,
      uri
    };
  } catch (error) {
    console.error('Error preparing NFT transaction:', error);
    throw error;
  }
}

// Server-side NFT minting with private key
export async function mintNFTFromServer(
  receiverAddress: string,
  tier: 'basic' | 'pro' | 'enterprise',
  privateKeyBase58: string
): Promise<any> {
  if (!privateKeyBase58) {
    throw new Error('Private key is required');
  }

  try {
    // Create keypair from private key (using bs58 to decode base58)
    const secretKey = bs58.decode(privateKeyBase58);
    const keypair = Keypair.fromSecretKey(secretKey);

    // Setup Metaplex with the creator's keypair and mock storage
    const connection = new Connection(SOLANA_RPC_URL);
    const metaplex = Metaplex.make(connection)
      .use(keypairIdentity(keypair))
      .use(mockStorage()); // Use mock storage instead of Bundlr

    // Create NFT metadata
    const metadata: NFTMetadata = {
      name: `AutonoBee ${tier === 'pro' ? 'Pro' : tier === 'enterprise' ? 'Enterprise' : 'Basic'} Pass`,
      symbol: "BEEPASS",
      description: `${tier === 'pro' ? 'Pro' : tier === 'enterprise' ? 'Enterprise' : 'Basic'} NFT pass to access AutonoBee's AI tools`,
      image: `${APP_URL}/images/autonobee-logo-transparent.png`,
      attributes: [{ trait_type: "Tier", value: tier }]
    };

    console.log('Minting NFT with config:', metadata);

    // Instead of uploading the image, just use a direct URL
    const imageUri = metadata.image;
    console.log('Using direct image URL:', imageUri);

    // Create simplified metadata JSON
    const metadataInput: UploadMetadataInput = {
      name: metadata.name,
      symbol: metadata.symbol,
      description: metadata.description,
      image: imageUri,
      attributes: metadata.attributes,
    };

    // With mock storage, this doesn't actually upload but returns a fake URI
    const { uri } = await metaplex.nfts().uploadMetadata(metadataInput);
    console.log('Metadata URI (mocked):', uri);

    // Mint the NFT 
    const { nft } = await metaplex.nfts().create({
      uri,
      name: metadata.name,
      sellerFeeBasisPoints: 500, // 5% royalty
      symbol: metadata.symbol,
      creators: [{ address: keypair.publicKey, share: 100 }],
      isMutable: true,
    });
    
    console.log('NFT created:', nft.address.toString());

    // If the receiver is different from the creator, we need to transfer the NFT
    if (receiverAddress !== keypair.publicKey.toString()) {
      const receiverPublicKey = new PublicKey(receiverAddress);
      
      const tx = await metaplex.nfts().transfer({
        nftOrSft: nft,
        authority: keypair,
        fromOwner: keypair.publicKey,
        toOwner: receiverPublicKey,
      });
      
      console.log('NFT transferred to:', receiverAddress);
    }

    return {
      success: true,
      mint: nft.address.toString(),
      metadata: nft.metadataAddress.toString(),
      uri: uri
    };
  } catch (error) {
    console.error('Error minting NFT:', error);
    throw error;
  }
}

export async function checkNFTOwnership(
  walletAddress: string,
  creatorWallet?: string
): Promise<{
  hasBeeNFT: boolean;
  tier: 'basic' | 'pro' | 'enterprise' | null;
}> {
  try {
    console.log('STARTING NFT check for wallet:', walletAddress);
    const startTime = Date.now();
    
    // Throttle API calls to avoid rate limiting
    await throttleRequest();
    
    const connection = getConnection();
    const metaplex = Metaplex.make(connection);
    const publicKey = new PublicKey(walletAddress);
    
    // Find all NFTs owned by the wallet
    console.log('Fetching NFTs owned by wallet...');
    const nfts = await metaplex.nfts().findAllByOwner({ owner: publicKey });
    console.log(`Found ${nfts.length} NFTs owned by wallet`);
    
    // Log NFT metadata for debugging
    if (nfts.length > 0) {
      console.log('NFTs found:', nfts.map(nft => ({ 
        address: nft.address.toString(),
        symbol: 'symbol' in nft ? nft.symbol : 'No symbol available'
      })));
    }
    
    // Initial filter for likely BEEPASS NFTs to reduce API calls
    const potentialBeeNFTs = nfts.filter(nft => {
      return 'symbol' in nft && nft.symbol === 'BEEPASS';
    });
    
    console.log(`Found ${potentialBeeNFTs.length} potential BEEPASS NFTs`);
    
    // If no potential BEEPASS NFTs, return early
    if (potentialBeeNFTs.length === 0) {
      const endTime = Date.now();
      console.log(`COMPLETED NFT check in ${endTime - startTime}ms: No BEEPASS NFTs found`);
      return { hasBeeNFT: false, tier: null };
    }
    
    // Filter for BEEPASS NFTs created by the creator wallet
    console.log('Checking for BEEPASS NFTs...');
    
    // To avoid excessive API calls, only check metadata for likely matches
    const beeNFTs = await Promise.all(
      potentialBeeNFTs.map(async (nft, index) => {
        try {
          // Add a small delay to avoid hitting rate limits
          if (index > 0) {
            await new Promise(resolve => setTimeout(resolve, 200)); // 200ms delay between NFT metadata fetches
          }
          
          // Fetch the full NFT data including metadata
          const fullNft = await metaplex.nfts().load({ metadata: nft as Metadata });
          console.log('Checking NFT:', {
            symbol: fullNft.symbol,
            name: fullNft.name,
            address: fullNft.address.toString(),
            creators: fullNft.creators.map(c => c.address.toString())
          });
          
          // Check if this is a BEEPASS NFT
          if (fullNft.symbol === 'BEEPASS') {
            console.log('Found BEEPASS NFT:', fullNft.address.toString());
            // If a creator wallet is specified, check if this NFT was created by that wallet
            if (creatorWallet) {
              const isFromCreator = fullNft.creators.some(
                creator => creator.address.toString() === creatorWallet
              );
              
              if (!isFromCreator) {
                console.log('NFT not from specified creator');
                return null;
              }
            }
            
            return fullNft;
          }
          return null;
        } catch (error) {
          console.error('Error loading NFT metadata:', error);
          return null;
        }
      })
    );
    
    // Find the first valid BEEPASS NFT
    const validBeeNFTs = beeNFTs.filter(nft => nft !== null);
    console.log(`Found ${validBeeNFTs.length} valid BEEPASS NFTs`);
    
    const beeNFT = validBeeNFTs.find(nft => nft !== null);
    
    if (!beeNFT) {
      console.log('No valid BEEPASS NFT found');
      return { hasBeeNFT: false, tier: null };
    }
    
    // Extract the tier from the metadata attributes
    const attributes = beeNFT.json?.attributes || [];
    console.log('NFT attributes found:', JSON.stringify(attributes, null, 2));
    
    // Try multiple ways to find the tier attribute
    let tierAttribute = attributes.find(attr => 
      attr.trait_type?.toLowerCase() === 'tier'
    );
    
    // If not found by trait_type, try by other means
    if (!tierAttribute) {
      // Look for any attribute with 'tier' in its name
      tierAttribute = attributes.find(attr => 
        (typeof attr.trait_type === 'string' && attr.trait_type.toLowerCase().includes('tier')) || 
        (typeof attr.name === 'string' && attr.name.toLowerCase().includes('tier'))
      );
      
      // If still not found, look for values that might match tiers
      if (!tierAttribute) {
        const tierKeywords = ['basic', 'pro', 'professional', 'enterprise'];
        tierAttribute = attributes.find(attr => 
          typeof attr.value === 'string' && tierKeywords.includes(attr.value.toLowerCase())
        );
        
        if (!tierAttribute && attributes.length > 0) {
          console.log('No tier attribute found but NFT has other attributes');
        }
      } else {
        console.log('Found tier-related attribute:', tierAttribute);
      }
    } else {
      console.log('Found standard tier attribute:', tierAttribute);
    }
    
    let tier: 'basic' | 'pro' | 'enterprise' | null = null;
    
    if (tierAttribute) {
      const tierValue = tierAttribute.value?.toLowerCase();
      console.log('Found tier attribute:', tierValue);
      
      if (tierValue === 'basic') {
        tier = 'basic';
      } else if (tierValue === 'pro') {
        tier = 'pro';
      } else if (tierValue === 'enterprise') {
        tier = 'enterprise';
      }
    } else {
      // Fallback to check the NFT name if no tier attribute found
      console.log('No tier attribute found, checking NFT name:', beeNFT.name);
      
      // Try to extract tier from the NFT name
      const name = typeof beeNFT.name === 'string' ? beeNFT.name.toLowerCase() : '';
      if (name.includes('basic')) {
        console.log('Detected Basic tier from NFT name');
        tier = 'basic';
      } else if (name.includes('pro')) {
        console.log('Detected Pro tier from NFT name');
        tier = 'pro';
      } else if (name.includes('enterprise')) {
        console.log('Detected Enterprise tier from NFT name');
        tier = 'enterprise';
      } else {
        // Last resort: default to basic tier for BEEPASS NFTs without specifics
        console.log('Defaulting to Basic tier for unspecified BEEPASS NFT');
        tier = 'basic';
      }
    }
    
    const endTime = Date.now();
    console.log(`COMPLETED NFT check in ${endTime - startTime}ms:`, { hasBeeNFT: true, tier });
    return { hasBeeNFT: true, tier };
  } catch (error) {
    console.error('Error checking NFT ownership:', error);
    return { hasBeeNFT: false, tier: null };
  }
}

// Function to fetch NFTs owned by a wallet
export async function fetchWalletNFTs(walletAddress: string): Promise<Array<{
  mint: string;
  name: string;
  image?: string;
  tier?: string;
}>> {
  try {
    console.log('Fetching NFTs for wallet:', walletAddress);
    
    // Throttle API calls to avoid rate limiting
    await throttleRequest();
    
    const connection = getConnection();
    const metaplex = Metaplex.make(connection);
    const publicKey = new PublicKey(walletAddress);
    
    // Fetch all NFTs owned by the wallet
    console.log('Finding NFTs by owner...');
    const allNfts = await metaplex.nfts().findAllByOwner({ owner: publicKey });
    
    // Filter to just return AutonoBee NFTs and map to simpler structure
    const nftList = await Promise.all(
      allNfts.map(async (nft) => {
        try {
          // Fetch metadata if available
          const metadata = nft.json;
          const tier = metadata?.attributes?.find((attr: any) => 
            attr.trait_type === 'Tier' || attr.trait_type === 'tier'
          )?.value;
          
          return {
            mint: nft.address.toString(),
            name: metadata?.name || nft.name || 'Unnamed NFT',
            image: metadata?.image || undefined,
            tier: tier || undefined,
          };
        } catch (error) {
          console.warn('Error processing NFT metadata:', error);
          return {
            mint: nft.address.toString(),
            name: nft.name || 'Unnamed NFT',
          };
        }
      })
    );
    
    console.log(`Found ${nftList.length} NFTs`);
    return nftList;
  } catch (error) {
    console.error('Error fetching wallet NFTs:', error);
    return [];
  }
} 