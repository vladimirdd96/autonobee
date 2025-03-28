"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { checkNFTOwnership } from '@/utils/nft';
import Cookies from 'js-cookie';

interface WalletContextType {
  wallet: any | null;
  publicKey: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  hasBeeNFT: boolean;
  nftTier: 'basic' | 'pro' | null;
  checkNFT: () => Promise<void>;
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
});

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<any | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [hasBeeNFT, setHasBeeNFT] = useState(false);
  const [nftTier, setNftTier] = useState<'basic' | 'pro' | null>(null);

  const checkNFT = async () => {
    if (!publicKey) return;

    try {
      const { hasBeeNFT: hasNFT, tier } = await checkNFTOwnership(publicKey);
      setHasBeeNFT(hasNFT);
      setNftTier(tier);

      // Update cookies
      Cookies.set('has_nft', hasNFT.toString(), { path: '/' });
      if (tier) {
        Cookies.set('nft_tier', tier, { path: '/' });
      } else {
        Cookies.remove('nft_tier', { path: '/' });
      }
    } catch (error) {
      console.error('Error checking NFT ownership:', error);
      // Clear cookies on error
      Cookies.remove('has_nft', { path: '/' });
      Cookies.remove('nft_tier', { path: '/' });
    }
  };

  useEffect(() => {
    const checkPhantom = async () => {
      try {
        if ("phantom" in window) {
          const provider = (window as any).phantom?.solana;
          if (provider?.isPhantom) {
            setWallet(provider);
            
            // Check if already connected
            const resp = await provider.connect({ onlyIfTrusted: true });
            if (resp.publicKey) {
              setPublicKey(resp.publicKey.toString());
              // Check NFT ownership
              await checkNFT();
            }
          }
        }
      } catch (error) {
        console.error("Error checking Phantom wallet:", error);
      }
    };

    checkPhantom();
  }, []);

  const connect = async () => {
    try {
      if (!wallet) {
        window.open("https://phantom.app/", "_blank");
        return;
      }

      setIsConnecting(true);
      const resp = await wallet.connect();
      setPublicKey(resp.publicKey.toString());
      
      // Check NFT ownership after connecting
      await checkNFT();
      
    } catch (error) {
      console.error("Error connecting to Phantom wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      if (wallet) {
        await wallet.disconnect();
        setPublicKey(null);
        setHasBeeNFT(false);
        setNftTier(null);
        
        // Clear cookies on disconnect
        Cookies.remove('has_nft', { path: '/' });
        Cookies.remove('nft_tier', { path: '/' });
      }
    } catch (error) {
      console.error("Error disconnecting from Phantom wallet:", error);
    }
  };

  return (
    <WalletContext.Provider value={{
      wallet,
      publicKey,
      isConnected: !!publicKey,
      isConnecting,
      connect,
      disconnect,
      hasBeeNFT,
      nftTier,
      checkNFT,
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext); 