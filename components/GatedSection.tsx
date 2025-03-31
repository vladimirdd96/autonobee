"use client";

import React from 'react';
import { Lock } from 'lucide-react';
import Link from 'next/link';
import { useWallet } from '@/contexts/WalletContext';
import { useAuth } from '@/contexts/AuthContext';

interface GatedSectionProps {
  hasAccess: boolean;
  children: React.ReactNode;
  message?: string;
  requiredTier?: 'basic' | 'pro' | 'enterprise';
  buttonAction?: 'connect' | 'mint' | 'x';
}

export default function GatedSection({ 
  hasAccess, 
  children, 
  message = "You need an NFT to access this feature.",
  requiredTier,
  buttonAction = 'connect'
}: GatedSectionProps) {
  const { isConnected, connect, hasBeeNFT, nftTier } = useWallet();
  const { authorizeX } = useAuth();
  
  if (hasAccess) {
    return <>{children}</>;
  }
  
  // Generate the appropriate message based on the required tier
  let displayMessage = message;
  if (requiredTier && hasBeeNFT) {
    displayMessage = `You need a ${requiredTier === 'basic' ? 'Basic' : requiredTier === 'pro' ? 'Pro' : 'Enterprise'} tier NFT to access this feature. Your current tier is ${nftTier || 'unknown'}.`;
  }
  
  return (
    <div className="bg-grayDark p-8 rounded-lg border border-primary/30">
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
          <Lock className="text-primary w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-accent mb-2">Access Restricted</h3>
        <p className="text-accent/80 mb-6">{displayMessage}</p>
        
        {buttonAction === 'x' ? (
          <button 
            onClick={authorizeX}
            className="px-6 py-3 bg-primary text-background rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            Connect X Account
          </button>
        ) : !isConnected && buttonAction === 'connect' ? (
          <button 
            onClick={connect}
            className="px-6 py-3 bg-primary text-background rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Connect Wallet
          </button>
        ) : buttonAction === 'mint' || (isConnected && !hasBeeNFT) ? (
          <Link href="/mint" className="px-6 py-3 bg-primary text-background rounded-lg font-medium hover:bg-primary/90 transition-colors">
            Get NFT Access
          </Link>
        ) : null}
      </div>
    </div>
  );
} 