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
  tier: 'basic' | 'pro',
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
      name: `AutonoBee ${tier === 'pro' ? 'Pro' : 'Basic'} Pass`,
      symbol: "BEEPASS",
      description: `${tier === 'pro' ? 'Pro' : 'Basic'} NFT pass to access AutonoBee's AI tools`,
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
  tier: 'basic' | 'pro',
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
      name: `AutonoBee ${tier === 'pro' ? 'Pro' : 'Basic'} Pass`,
      symbol: "BEEPASS",
      description: `${tier === 'pro' ? 'Pro' : 'Basic'} NFT pass to access AutonoBee's AI tools`,
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
  tier: 'basic' | 'pro' | null;
}> {
  try {
    const connection = new Connection(SOLANA_RPC_URL);
    const metaplex = Metaplex.make(connection);
    const publicKey = new PublicKey(walletAddress);
    
    // Find all NFTs owned by the wallet
    const nfts = await metaplex.nfts().findAllByOwner({ owner: publicKey });
    
    // Filter for BEEPASS NFTs created by the creator wallet
    const beeNFTs = await Promise.all(
      nfts.map(async (nft) => {
        try {
          // Fetch the full NFT data including metadata
          const fullNft = await metaplex.nfts().load({ metadata: nft as Metadata });
          
          // Check if this is a BEEPASS NFT
          if (fullNft.symbol === 'BEEPASS') {
            // If a creator wallet is specified, check if this NFT was created by that wallet
            if (creatorWallet) {
              const isFromCreator = fullNft.creators.some(
                creator => creator.address.toString() === creatorWallet
              );
              
              if (!isFromCreator) return null;
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
    const beeNFT = beeNFTs.find(nft => nft !== null);
    
    if (!beeNFT) {
      return { hasBeeNFT: false, tier: null };
    }
    
    // Extract the tier from the metadata attributes
    const attributes = beeNFT.json?.attributes || [];
    const tierAttribute = attributes.find(attr => 
      attr.trait_type === 'Tier'
    );
    
    const tier = tierAttribute?.value?.toLowerCase() as 'basic' | 'pro';
    
    return {
      hasBeeNFT: true,
      tier: tier || null,
    };
  } catch (error) {
    console.error('Error checking NFT ownership:', error);
    return { hasBeeNFT: false, tier: null };
  }
} 