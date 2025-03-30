"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/contexts/WalletContext';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ChevronDown, 
  User, 
  LogOut, 
  Wallet, 
  Sparkles, 
  ArrowRight, 
  Loader2,
  Settings
} from 'lucide-react';

interface ProfileDropdownProps {
  onLoadingChange?: (isLoading: boolean) => void;
}

export default function ProfileDropdown({ onLoadingChange }: ProfileDropdownProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();
  
  const { 
    isXAuthorized, 
    xUser, 
    authorizeX, 
    logoutX, 
    isLoading: isXLoading 
  } = useAuth();
  
  const { 
    isConnected, 
    isConnecting, 
    publicKey, 
    connect, 
    disconnect, 
    nftTier,
    hasBeeNFT,
    selectedPlan,
    checkNFT,
    isNFTStatusLoading
  } = useWallet();

  // Update parent component when loading state changes
  useEffect(() => {
    if (onLoadingChange) {
      onLoadingChange(isConnecting || isNFTStatusLoading);
    }
  }, [isConnecting, isNFTStatusLoading, onLoadingChange]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById('profile-dropdown');
      const button = document.getElementById('profile-button');
      
      if (isDropdownOpen) {
        const clickedInside = 
          (dropdown && dropdown.contains(event.target as Node)) || 
          (button && button.contains(event.target as Node));
          
        if (!clickedInside) {
          setIsDropdownOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  // Check NFT status when dropdown opens if connected
  useEffect(() => {
    if (isDropdownOpen && isConnected && publicKey) {
      checkNFT();
    }
  }, [isDropdownOpen, isConnected, publicKey, checkNFT]);

  // Check NFT status when component mounts
  useEffect(() => {
    if (isConnected && publicKey) {
      checkNFT();
    }
  }, [isConnected, publicKey, checkNFT]);

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const handleOpenDropdown = () => {
    setIsDropdownOpen(true);
  };

  const displayNameOrWallet = () => {
    if (isXAuthorized && xUser?.username) {
      return `@${xUser.username}`;
    } else if (isConnected && publicKey) {
      return shortenAddress(publicKey);
    }
    return "Connect";
  };

  // Handle navigation
  const handleNavigation = (path: string) => {
    // If we're already on this page, just close the dropdown
    if (pathname === path) {
      setIsDropdownOpen(false);
    }
  };

  return (
    <div className="relative z-50">
      <button 
        id="profile-button"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg",
          "bg-background/70 backdrop-blur-sm border border-primary/20",
          "hover:bg-background/90 transition-all duration-300"
        )}
      >
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
          {isConnecting || isNFTStatusLoading ? (
            <Loader2 className="w-4 h-4 text-primary animate-spin" />
          ) : (
            <User className="w-4 h-4 text-primary" />
          )}
        </div>
        <span className="text-accent font-medium">
          {isConnecting ? (
            "Connecting..."
          ) : isNFTStatusLoading && isConnected ? (
            "Loading..."
          ) : (
            displayNameOrWallet()
          )}
        </span>
        <ChevronDown className={cn(
          "w-4 h-4 text-accent transition-transform duration-300",
          isDropdownOpen && "transform rotate-180"
        )} />
      </button>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div 
            id="profile-dropdown"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "absolute right-0 mt-2 w-72 rounded-xl",
              "bg-background/80 backdrop-blur-md",
              "border border-primary/20 shadow-xl shadow-primary/5",
              "overflow-hidden z-50"
            )}
            style={{ top: "100%" }}
          >
            {/* X Account Section */}
            <div className="p-4 border-b border-primary/10">
              <h3 className="text-sm font-medium text-accent/70 mb-2">X Account</h3>
              
              {isXLoading ? (
                <div className="flex items-center gap-2 text-accent">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : isXAuthorized ? (
                <div className="mb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-accent">{xUser?.name}</div>
                        <div className="text-xs text-accent/70">@{xUser?.username}</div>
                      </div>
                    </div>
                    <button
                      onClick={logoutX}
                      className="text-xs px-2 py-1 bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors"
                    >
                      Disconnect
                    </button>
                  </div>
                  
                  {/* X Account Quick Links */}
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <Link
                      href="/timeline"
                      className="text-xs px-2 py-1.5 flex items-center justify-center gap-1 bg-primary/5 text-primary rounded hover:bg-primary/10 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      Timeline
                    </Link>
                    <Link
                      href="/search"
                      className="text-xs px-2 py-1.5 flex items-center justify-center gap-1 bg-primary/5 text-primary rounded hover:bg-primary/10 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      Search X
                    </Link>
                    <Link
                      href="/profile"
                      className="text-xs px-2 py-1.5 flex items-center justify-center gap-1 bg-primary/5 text-primary rounded hover:bg-primary/10 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      Analytics
                    </Link>
                    <a
                      href="https://x.com/home"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-2 py-1.5 flex items-center justify-center gap-1 bg-primary/5 text-primary rounded hover:bg-primary/10 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      X.com
                    </a>
                  </div>
                </div>
              ) : (
                <button
                  onClick={authorizeX}
                  className={cn(
                    "w-full flex items-center justify-center gap-2",
                    "px-3 py-2 rounded-lg bg-primary/10 text-primary",
                    "hover:bg-primary/20 transition-colors"
                  )}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                   Connect
                </button>
              )}
            </div>

            {/* Wallet Section */}
            <div className="p-4 border-b border-primary/10">
              <h3 className="text-sm font-medium text-accent/70 mb-2">Wallet</h3>
              
              {isConnecting ? (
                <div className="flex items-center gap-2 text-accent">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connecting...</span>
                </div>
              ) : isConnected ? (
                <div className="mb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <Wallet className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-accent">{shortenAddress(publicKey!)}</div>
                        {nftTier && (
                          <div className="text-xs text-accent/70">
                            NFT Tier: <span className={nftTier === 'pro' ? 'text-primary' : 'text-accent'}>{nftTier.toUpperCase()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={disconnect}
                      className="text-xs px-2 py-1 bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors"
                    >
                      Disconnect
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={connect}
                  className={cn(
                    "w-full flex items-center justify-center gap-2",
                    "px-3 py-2 rounded-lg bg-primary/10 text-primary",
                    "hover:bg-primary/20 transition-colors"
                  )}
                >
                  <Wallet className="w-4 h-4" />
                  Connect Wallet
                </button>
              )}
            </div>

            {/* Subscription Plan Section */}
            <div className="p-4">
              <h3 className="text-sm font-medium text-accent/70 mb-2">Subscription</h3>
              
              {isConnected ? (
                <>
                  {isConnecting || isNFTStatusLoading ? (
                    <div className="p-3 rounded-lg mb-3 bg-accent/5 flex flex-col items-center justify-center">
                      <div className="flex items-center gap-2 mb-1">
                        <Loader2 className="w-4 h-4 text-primary animate-spin" />
                        <span className="font-medium text-accent">Checking status...</span>
                      </div>
                      <p className="text-xs text-accent/70">
                        Verifying your NFT ownership status...
                      </p>
                    </div>
                  ) : (
                    <div className={cn(
                      "p-3 rounded-lg mb-3",
                      hasBeeNFT 
                        ? "bg-gradient-to-br from-primary/20 to-accent/5"
                        : "bg-accent/5"
                    )}>
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="font-medium text-accent">
                          {hasBeeNFT 
                            ? !nftTier ? 'Basic Plan Active'
                            : nftTier === 'basic' 
                              ? 'Basic Plan Active' 
                              : nftTier === 'pro' 
                                ? 'Professional Plan Active' 
                                : 'Enterprise Plan Active'
                            : 'No Active Plan'}
                        </span>
                      </div>
                      <p className="text-xs text-accent/70">
                        {hasBeeNFT 
                          ? `Your ${!nftTier ? 'BASIC' : nftTier === 'pro' ? 'PRO' : 'BASIC'} NFT gives you access to the ${!nftTier ? 'Starter' : nftTier === 'pro' ? 'Professional' : 'Starter'} Plan.` 
                          : 'Purchase an NFT to activate a subscription plan.'}
                      </p>
                    </div>
                  )}
                  
                  <Link
                    href="/mint"
                    onClick={() => handleNavigation('/mint')}
                    className={cn(
                      "w-full flex items-center justify-center gap-2",
                      "px-3 py-2 rounded-lg transition-colors",
                      pathname === '/mint' 
                        ? "bg-primary text-background hover:bg-primary/90" 
                        : "bg-accent/10 text-accent hover:bg-accent/20"
                    )}
                  >
                    {hasBeeNFT 
                      ? nftTier === 'pro' 
                        ? 'View Subscription' 
                        : 'Upgrade to Pro' 
                      : 'Mint Subscription NFT'}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </>
              ) : (
                <div className="text-sm text-accent/70 p-3 bg-accent/5 rounded-lg">
                  Connect your wallet to access subscription options.
                </div>
              )}
            </div>

            {/* Settings Section */}
            <div className="p-4 border-t border-primary/10">
              <Link
                href="/settings"
                onClick={() => handleNavigation('/settings')}
                className={cn(
                  "w-full flex items-center justify-center gap-2",
                  "px-3 py-2 rounded-lg transition-colors",
                  pathname === '/settings' 
                    ? "bg-primary text-background hover:bg-primary/90" 
                    : "bg-accent/10 text-accent hover:bg-accent/20"
                )}
              >
                <Settings className="w-4 h-4" />
                Settings
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 