import { NextResponse } from 'next/server';
import { checkNFTOwnership } from '@/utils/metaplex';
import { isNFTSimulationActive, getSimulatedNFTTier } from '@/utils/dev-helper';

interface RouteParams {
  params: {
    address: string;
  };
}

// Simple in-memory cache for API results
interface CacheEntry {
  data: any;
  timestamp: number;
}

const resultCache: Record<string, CacheEntry> = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
let lastRequestTime = 0;
const REQUEST_THROTTLE = 2000; // 2 seconds between requests

// A helper to throttle requests
async function throttleRequest() {
  const now = Date.now();
  const timeElapsed = now - lastRequestTime;
  
  if (timeElapsed < REQUEST_THROTTLE) {
    const delay = REQUEST_THROTTLE - timeElapsed;
    console.log(`API: Throttling request, waiting ${delay}ms`);
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  
  lastRequestTime = Date.now();
}

export async function GET(
  request: Request,
  { params }: RouteParams
) {
  try {
    const { address } = params;

    if (!address) {
      return NextResponse.json(
        { message: 'Wallet address is required' },
        { status: 400 }
      );
    }

    console.log('Getting NFT details for wallet:', address);
    
    // Check the cache first
    const cacheKey = `nft-details-${address}`;
    const cachedResult = resultCache[cacheKey];
    
    if (cachedResult) {
      const age = Date.now() - cachedResult.timestamp;
      if (age < CACHE_DURATION) {
        console.log(`Using cached NFT details for ${address}, age: ${Math.round(age / 1000)}s`);
        return NextResponse.json({
          ...cachedResult.data,
          cached: true,
          cacheAge: Math.round(age / 1000)
        });
      } else {
        console.log(`Cache expired for ${address}, fetching new data`);
      }
    }
    
    // Apply request throttling
    await throttleRequest();
    
    // Check if we're in development mode with simulation enabled
    if (process.env.NODE_ENV === 'development' && isNFTSimulationActive()) {
      console.log('[DEV] Using simulated NFT data in API');
      const tier = getSimulatedNFTTier();
      const plan = tier === 'basic' 
        ? 'Starter' 
        : tier === 'pro' 
          ? 'Professional' 
          : 'Enterprise';
          
      const result = {
        hasBeeNFT: true,
        tier: tier,
        plan: plan,
        isSimulated: true
      };
      
      // Update cache
      resultCache[cacheKey] = {
        data: result,
        timestamp: Date.now()
      };
      
      return NextResponse.json(result);
    }

    // Get NFT ownership details
    const { hasBeeNFT, tier } = await checkNFTOwnership(address);
    console.log('NFT ownership check result:', { hasBeeNFT, tier });

    // Map tier to plan name
    let plan = null;
    if (tier === 'basic') {
      plan = 'Starter';
    } else if (tier === 'pro') {
      plan = 'Professional';
    } else if (tier === 'enterprise') {
      plan = 'Enterprise';
    }

    const result = { hasBeeNFT, tier, plan };
    
    // Update cache
    resultCache[cacheKey] = {
      data: result,
      timestamp: Date.now()
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error checking NFT details:", error);
    
    // Enhanced error response
    let errorMessage = "Error checking NFT details";
    let errorDetails = null;
    
    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = error.stack;
    }
    
    return NextResponse.json(
      { 
        message: errorMessage, 
        error: errorDetails,
        timestamp: new Date().toISOString() 
      },
      { status: 500 }
    );
  }
} 