"use client";

import React from 'react';
import { Lock } from 'lucide-react';
import Link from 'next/link';
import { useWallet } from '@/contexts/WalletContext';

interface GatedSectionProps {
  hasAccess: boolean;
  children: React.ReactNode;
  message?: string;
  requiredTier?: 'basic' | 'pro' | 'enterprise';
  buttonAction?: 'connect' | 'mint';
}

export default function GatedSection({ 
  hasAccess, 
  children, 
  message = "You need an NFT to access this feature.",
  requiredTier,
  buttonAction = 'connect'
}: GatedSectionProps) {
  const { isConnected, connect, hasBeeNFT, nftTier } = useWallet();
  
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
        
        {!isConnected && buttonAction === 'connect' ? (
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