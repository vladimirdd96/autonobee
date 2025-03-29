"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { checkNFTOwnership } from '@/utils/metaplex';
import Cookies from 'js-cookie';
import { 
  isNFTSimulationActive, 
  getSimulatedNFTTier, 
  isWalletSimulationActive,
  getSimulatedWalletAddress 
} from '@/utils/dev-helper';

// Constants for NFT checking
const MIN_CHECK_INTERVAL = 30 * 1000; // 30 seconds between checks
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache validity

interface WalletContextType {
  wallet: any | null;
  publicKey: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  hasBeeNFT: boolean;
  nftTier: 'basic' | 'pro' | 'enterprise' | null;
  checkNFT: (force?: boolean) => Promise<void>;
  selectedPlan: 'Starter' | 'Professional' | 'Enterprise' | null;
  selectPlan: (plan: 'Starter' | 'Professional' | 'Enterprise') => void;
  lastNFTCheck: Date | null;
  isNFTStatusLoading: boolean;
}

const WalletContext = createContext<WalletContextType>({
  wallet: null,
  publicKey: null,
  isConnected: false,
  isConnecting: false,
  connect: async () => {},
  disconnect: async () => {},
  hasBeeNFT: false,
  nftTier: null,
  checkNFT: async () => {},
  selectedPlan: null,
  selectPlan: () => {},
  lastNFTCheck: null,
  isNFTStatusLoading: false,
});

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<any | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [hasBeeNFT, setHasBeeNFT] = useState(false);
  const [nftTier, setNftTier] = useState<'basic' | 'pro' | 'enterprise' | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<'Starter' | 'Professional' | 'Enterprise' | null>(null);
  const [userDisconnected, setUserDisconnected] = useState(() => {
    // Initialize from cookie to ensure disconnect state persists across page refreshes
    return Cookies.get('wallet_disconnected') === 'true';
  });
  const [lastNFTCheck, setLastNFTCheck] = useState<Date | null>(null);
  const [isNFTStatusLoading, setIsNFTStatusLoading] = useState(false);
  
  // Refs for throttling and in-progress checks
  const nftCheckInProgress = useRef(false);
  const nftCheckTimeout = useRef<NodeJS.Timeout | null>(null);
  const nftCheckQueue = useRef<Array<() => void>>([]);

  const checkNFT = async (force = false, retryCount = 0) => {
    // Log the attempt number for debugging
    console.log(`Checking NFT ownership (attempt ${retryCount + 1})...`);
    
    // If no wallet is connected, there's no NFT to check
    if (!publicKey && !isWalletSimulationActive()) {
      console.log('No wallet connected, cannot check NFT ownership');
      return;
    }
    
    // Use simulation data in development if enabled
    if (process.env.NODE_ENV === 'development' && isNFTSimulationActive()) {
      setIsNFTStatusLoading(true);
      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const tier = getSimulatedNFTTier();
      console.log('[DEV] Using simulated NFT status:', tier ? `has ${tier} NFT` : 'no NFT');
      
      if (tier) {
        setHasBeeNFT(true);
        setNftTier(tier as 'basic' | 'pro' | 'enterprise');
        
        // Auto-select plan based on NFT tier
        if (tier === 'basic') {
          setSelectedPlan('Starter');
        } else if (tier === 'pro') {
          setSelectedPlan('Professional');
        } else if (tier === 'enterprise') {
          setSelectedPlan('Enterprise');
        }
        
        // Set cookies
        Cookies.set('has_nft', 'true', { path: '/' });
        if (tier) {
          Cookies.set('nft_tier', tier, { path: '/' });
        }
        const now = new Date();
        Cookies.set('last_nft_check', now.toISOString(), { path: '/' });
        setLastNFTCheck(now);
      } else {
        setHasBeeNFT(false);
        setNftTier(null);
        
        // Clear cookies
        Cookies.remove('has_nft', { path: '/' });
        Cookies.remove('nft_tier', { path: '/' });
        Cookies.set('last_nft_check', new Date().toISOString(), { path: '/' });
      }
      
      setIsNFTStatusLoading(false);
      return;
    }
    
    // Check if a check is already in progress
    if (nftCheckInProgress.current && !force) {
      console.log('NFT check already in progress, queueing callback');
      return new Promise<void>(resolve => {
        nftCheckQueue.current.push(resolve);
      });
    }
    
    // Don't check too frequently unless forced
    const lastCheck = lastNFTCheck?.getTime() || 0;
    const now = Date.now();
    if (!force && now - lastCheck < MIN_CHECK_INTERVAL) {
      console.log(`NFT check skipped - last check was ${Math.round((now - lastCheck) / 1000)}s ago`);
      return;
    }
    
    // Set flag to prevent concurrent checks
    nftCheckInProgress.current = true;
    setIsNFTStatusLoading(true);
    
    try {
      // If publicKey is null at this point, something is wrong
      if (!publicKey) {
        console.error('Attempted to check NFT with null publicKey');
        return;
      }
      
      const { hasBeeNFT: hasNFT, tier } = await checkNFTOwnership(publicKey as string);
      
      // Update state
      setHasBeeNFT(hasNFT);
      setNftTier(hasNFT ? tier : null);
      
      // Update cookies
      if (hasNFT) {
        Cookies.set('has_nft', 'true', { path: '/' });
        if (tier) {
          Cookies.set('nft_tier', tier, { path: '/' });
        }
        
        // Auto-select plan based on NFT tier if not already set
        if (!selectedPlan) {
          if (tier === 'basic') {
            selectPlan('Starter');
          } else if (tier === 'pro') {
            selectPlan('Professional');
          } else if (tier === 'enterprise') {
            selectPlan('Enterprise');
          }
        }
      } else {
        Cookies.set('has_nft', 'false', { path: '/' });
        Cookies.remove('nft_tier', { path: '/' });
        
        // If we had an NFT previously but now can't find it, retry a few times
        // This helps handle blockchain update delays
        if ((hasBeeNFT || Cookies.get('has_nft') === 'true') && retryCount < 3) {
          console.log(`NFT not found but was expected. Retrying in ${(retryCount + 1) * 3} seconds...`);
          nftCheckInProgress.current = false;
          if (nftCheckTimeout.current) {
            clearTimeout(nftCheckTimeout.current);
          }
          nftCheckTimeout.current = setTimeout(() => checkNFT(true, retryCount + 1), 3000 * (retryCount + 1));
          return;
        }
      }
      
      // Update last check timestamp
      const checkTime = new Date();
      Cookies.set('last_nft_check', checkTime.toISOString(), { path: '/' });
      setLastNFTCheck(checkTime);
      
    } catch (error) {
      console.error('Error checking NFT ownership:', error);
      
      // Retry on error up to 3 times
      if (retryCount < 3) {
        console.log(`Error during NFT check. Retrying (${retryCount + 1}/3)...`);
        nftCheckInProgress.current = false;
        if (nftCheckTimeout.current) {
          clearTimeout(nftCheckTimeout.current);
        }
        nftCheckTimeout.current = setTimeout(() => checkNFT(true, retryCount + 1), 1000 * (retryCount + 1));
        return;
      }
      
      // Clear cookies on persistent error
      Cookies.remove('has_nft', { path: '/' });
      Cookies.remove('nft_tier', { path: '/' });
      Cookies.remove('selected_plan', { path: '/' });
    } finally {
      nftCheckInProgress.current = false;
      setIsNFTStatusLoading(false);
      
      // Process any queued callbacks
      if (nftCheckQueue.current.length > 0) {
        console.log(`Processing ${nftCheckQueue.current.length} queued NFT check callbacks`);
        nftCheckQueue.current.forEach(resolve => resolve());
        nftCheckQueue.current = [];
      }
    }
  };

  // Load cached NFT status from cookies
  const loadCachedNFTStatus = () => {
    // If wallet simulation is active, check that first
    if (process.env.NODE_ENV === 'development' && isNFTSimulationActive()) {
      const tier = getSimulatedNFTTier();
      console.log('[DEV] Using simulated NFT tier:', tier);
      
      if (tier) {
        setHasBeeNFT(true);
        setNftTier(tier as 'basic' | 'pro' | 'enterprise');
        
        // Auto-select plan based on NFT tier
        if (tier === 'basic') {
          setSelectedPlan('Starter');
        } else if (tier === 'pro') {
          setSelectedPlan('Professional');
        } else if (tier === 'enterprise') {
          setSelectedPlan('Enterprise');
        }
        return true;
      }
      return false;
    }
    
    // Check for "real" cache
    const hasNft = Cookies.get('has_nft');
    const tier = Cookies.get('nft_tier');
    const plan = Cookies.get('selected_plan');
    const lastCheck = Cookies.get('last_nft_check');
    
    if (hasNft && lastCheck) {
      const lastCheckDate = new Date(lastCheck);
      const now = new Date();
      const diff = now.getTime() - lastCheckDate.getTime();
      
      // Check if cached data is still valid (less than CACHE_DURATION ms old)
      if (diff < CACHE_DURATION) {
        console.log('Using cached NFT status:', { 
          hasNft, tier, plan, 
          cacheAge: `${Math.round(diff / 1000)}s`, 
          validFor: `${Math.round((CACHE_DURATION - diff) / 1000)}s` 
        });
        
        setHasBeeNFT(hasNft === 'true');
        if (tier) {
          setNftTier(tier as 'basic' | 'pro' | 'enterprise');
        }
        if (plan) {
          setSelectedPlan(plan as 'Starter' | 'Professional' | 'Enterprise');
        }
        setLastNFTCheck(lastCheckDate);
        return true;
      }
    }
    
    return false;
  };

  // Function to select a pricing plan
  const selectPlan = (plan: 'Starter' | 'Professional' | 'Enterprise') => {
    setSelectedPlan(plan);
    Cookies.set('selected_plan', plan, { path: '/' });
  };

  // Load selected plan from cookie on initial load
  useEffect(() => {
    const savedPlan = Cookies.get('selected_plan') as 'Starter' | 'Professional' | 'Enterprise' | undefined;
    if (savedPlan) {
      setSelectedPlan(savedPlan);
    }
    
    // Check if user has explicitly disconnected before
    const wasDisconnected = Cookies.get('wallet_disconnected') === 'true';
    setUserDisconnected(wasDisconnected);
  }, []);

  // Check for wallet simulation on mount
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && isWalletSimulationActive()) {
      const simulatedAddress = getSimulatedWalletAddress();
      if (simulatedAddress) {
        console.log('[DEV] Using simulated wallet connection:', simulatedAddress);
        setPublicKey(simulatedAddress);
        setUserDisconnected(false);
        
        // First try to load from cache
        if (!loadCachedNFTStatus()) {
          // Check NFT status for simulated wallet if not in cache
          setTimeout(() => checkNFT(), 100);
        }
      }
    }
  }, []);

  useEffect(() => {
    const checkPhantom = async () => {
      // Skip Phantom check if using wallet simulation
      if (process.env.NODE_ENV === 'development' && isWalletSimulationActive()) {
        return;
      }
      
      try {
        if ("phantom" in window) {
          const provider = (window as any).phantom?.solana;
          if (provider?.isPhantom) {
            setWallet(provider);
            
            // Don't auto-connect if user has explicitly disconnected
            if (Cookies.get('wallet_disconnected') === 'true') {
              console.log('User previously disconnected. Not auto-connecting.');
              return;
            }
            
            try {
              // Check if already connected
              const resp = await provider.connect({ onlyIfTrusted: true });
              if (resp.publicKey) {
                setPublicKey(resp.publicKey.toString());
                // First try to load from cache
                if (!loadCachedNFTStatus()) {
                  // Check NFT ownership if not in cache
                  await checkNFT();
                }
              }
            } catch (error) {
              // If connect fails, the wallet is not connected or user declined
              console.log('Auto-connect failed, wallet not trusted or already disconnected');
            }
          }
        }
      } catch (error) {
        console.error("Error checking Phantom wallet:", error);
      }
    };

    checkPhantom();
    
    // Clean up timeout on unmount
    return () => {
      if (nftCheckTimeout.current) {
        clearTimeout(nftCheckTimeout.current);
      }
    };
  }, []);

  // Check NFT status on every page load if wallet is connected
  useEffect(() => {
    // Only check NFT status if there's a connected wallet and no explicit disconnection
    if (publicKey && !userDisconnected) {
      console.log('Connected wallet detected on page load/refresh:', publicKey);
      
      // First try to use cached data
      if (!loadCachedNFTStatus()) {
        // Only check if cache miss
        console.log('No valid cached NFT data, checking from blockchain...');
        checkNFT();
      }
    }
  }, [publicKey, userDisconnected]);

  const connect = async () => {
    // If wallet simulation is active, do nothing
    if (process.env.NODE_ENV === 'development' && isWalletSimulationActive()) {
      console.log('[DEV] Using simulated wallet connection.');
      return;
    }
    
    try {
      if (!wallet) {
        window.open("https://phantom.app/", "_blank");
        return;
      }

      setIsConnecting(true);
      const resp = await wallet.connect();
      setPublicKey(resp.publicKey.toString());
      
      // Clear the disconnected flag when user manually connects
      setUserDisconnected(false);
      Cookies.remove('wallet_disconnected', { path: '/' });
      
      // Try to load from cache first
      if (!loadCachedNFTStatus()) {
        // Check NFT ownership if not in cache
        await checkNFT(true); // Force check on manual connect
      }
      
    } catch (error) {
      console.error("Error connecting to Phantom wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    // If wallet simulation is active, do nothing
    if (process.env.NODE_ENV === 'development' && isWalletSimulationActive()) {
      console.log('[DEV] Cannot disconnect simulated wallet. Use dev tools instead.');
      return;
    }
    
    try {
      if (wallet) {
        await wallet.disconnect();
        setPublicKey(null);
        setHasBeeNFT(false);
        setNftTier(null);
        setSelectedPlan(null);
        setLastNFTCheck(null);
        
        // Set disconnected flag to prevent auto-reconnection
        setUserDisconnected(true);
        Cookies.set('wallet_disconnected', 'true', { path: '/' });
        
        // Clear cookies on disconnect
        Cookies.remove('has_nft', { path: '/' });
        Cookies.remove('nft_tier', { path: '/' });
        Cookies.remove('selected_plan', { path: '/' });
        Cookies.remove('last_nft_check', { path: '/' });
      }
    } catch (error) {
      console.error("Error disconnecting from Phantom wallet:", error);
    }
  };

  // Combine all context data
  const contextValue = {
    wallet,
    publicKey,
    isConnected: !!publicKey,
    isConnecting,
    connect,
    disconnect,
    hasBeeNFT,
    nftTier,
    checkNFT,
    selectedPlan,
    selectPlan,
    lastNFTCheck,
    isNFTStatusLoading,
  };
  
  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext); 