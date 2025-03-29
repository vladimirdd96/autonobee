"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/contexts/WalletContext';
import { Lock, Wallet, Sparkles, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Settings() {
  const { isXAuthorized, authorizeX, logoutX } = useAuth();
  const { 
    isConnected, 
    connect, 
    disconnect, 
    publicKey, 
    selectedPlan, 
    selectPlan, 
    hasBeeNFT, 
    nftTier, 
    checkNFT, 
    isConnecting, 
    lastNFTCheck 
  } = useWallet();
  
  const [isCheckingNFT, setIsCheckingNFT] = useState(false);
  const [showRefreshBanner, setShowRefreshBanner] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Function to force refresh NFT status
  const refreshNFTStatus = async () => {
    if (!isConnected) return;
    
    setIsCheckingNFT(true);
    try {
      await checkNFT(true);
      // Show a temporary banner when refresh is complete
      setShowRefreshBanner(true);
      setTimeout(() => setShowRefreshBanner(false), 3000);
    } catch (error) {
      console.error("Error refreshing NFT status:", error);
    } finally {
      setIsCheckingNFT(false);
    }
  };

  // Check NFT status on initial load
  useEffect(() => {
    if (isConnected && publicKey) {
      setIsCheckingNFT(true);
      checkNFT(false).finally(() => {
        setIsCheckingNFT(false);
        setInitialLoading(false);
      });
    } else {
      // If not connected, we're not loading
      setInitialLoading(false);
    }
  }, [isConnected, publicKey, checkNFT]);

  return (
    <Layout>
      <div className="container mx-auto px-4 pt-24 pb-12 relative">
        {/* Success notification banner */}
        {showRefreshBanner && (
          <div className="fixed top-20 inset-x-0 flex justify-center z-50 animate-fade-in-down">
            <div className="bg-green-500/90 text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              NFT status refreshed successfully
            </div>
          </div>
        )}
        
        <h1 className="text-3xl font-display mb-8">Settings</h1>
        
        {!true ? (
          <div className="absolute inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-accent mb-2">X Authorization Required</h3>
              <p className="text-accent/80 mb-6">Please authorize your X account to access settings.</p>
              <button
                onClick={authorizeX}
                className="px-6 py-3 bg-primary text-background rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 mx-auto"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                Authorize
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl space-y-6">
            <div className="bg-background/50 backdrop-blur-sm border border-primary/10 rounded-lg p-6">
              <h2 className="text-xl font-display mb-4">X Account</h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  <span className="text-accent">Connected</span>
                </div>
                <button
                  onClick={logoutX}
                  className="px-4 py-2 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors font-medium"
                >
                  Disconnect
                </button>
              </div>
            </div>
            
            <div className="bg-background/50 backdrop-blur-sm border border-primary/10 rounded-lg p-6">
              <h2 className="text-xl font-display mb-4">Wallet</h2>
              {isConnecting ? (
                <div className="flex items-center justify-center py-6">
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative h-8 w-8">
                      <div className="absolute inset-0 rounded-full border-2 border-primary border-opacity-20"></div>
                      <div className="absolute top-0 left-0 h-8 w-8 rounded-full border-t-2 border-l-2 border-primary animate-spin"></div>
                    </div>
                    <span className="text-sm text-accent/70">Connecting wallet...</span>
                  </div>
                </div>
              ) : isConnected ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Wallet className="w-6 h-6 text-primary" />
                    <span className="text-accent">{publicKey?.slice(0, 4)}...{publicKey?.slice(-4)}</span>
                  </div>
                  <button
                    onClick={disconnect}
                    className="px-4 py-2 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors font-medium"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Wallet className="w-6 h-6 text-accent/60" />
                    <span className="text-accent/60">Not connected</span>
                  </div>
                  <button
                    onClick={connect}
                    className="px-4 py-2 bg-primary text-background rounded-md hover:bg-primary/90 transition-colors font-medium"
                  >
                    Connect Wallet
                  </button>
                </div>
              )}
            </div>
            
            {(isConnected || initialLoading) && (
              <div className="bg-background/50 backdrop-blur-sm border border-primary/10 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-display">Subscription Plan</h2>
                  {lastNFTCheck && !isCheckingNFT && (
                    <div className="text-xs text-accent/50 flex items-center gap-1">
                      <span>Last checked: {lastNFTCheck.toLocaleTimeString()}</span>
                      <button 
                        onClick={refreshNFTStatus}
                        disabled={isCheckingNFT}
                        className="ml-2 p-1 hover:bg-primary/10 rounded transition-colors"
                        title="Refresh NFT status"
                      >
                        <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
                
                {initialLoading ? (
                  <div className="space-y-4 py-6">
                    <div className="skeleton-loader"></div>
                    <div className="skeleton-loader sm"></div>
                    <div className="skeleton-loader sm"></div>
                    <div className="h-10 skeleton-loader mt-8"></div>
                  </div>
                ) : isCheckingNFT ? (
                  <div className="flex flex-col items-center justify-center py-8 gap-3">
                    <div className="animate-shimmer w-16 h-16 rounded-full flex items-center justify-center bg-primary/10">
                      <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                    <span className="text-accent/70">Checking NFT status...</span>
                    <p className="text-xs text-accent/50 max-w-xs text-center mt-2">
                      This may take a moment as we verify your NFT ownership on the blockchain
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="p-4 bg-primary/10 rounded-lg mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        <span className="text-lg font-medium text-primary">
                          {nftTier ? nftTier.charAt(0).toUpperCase() + nftTier.slice(1) : 'Basic'} Plan
                        </span>
                      </div>
                      
                      <div className="text-sm text-accent/80">
                        {hasBeeNFT ? (
                          <div>
                            <p>You own a {nftTier && nftTier.charAt(0).toUpperCase() + nftTier.slice(1)} tier NFT.</p>
                            <p className="mt-1">Current plan: {nftTier ? nftTier.charAt(0).toUpperCase() + nftTier.slice(1) : 'Basic'}</p>
                          </div>
                        ) : (
                          <p>You don't own any AutonoBee NFT yet. Purchase one to unlock premium features.</p>
                        )}
                      </div>
                    </div>
                    
                    <Link 
                      href="/mint" 
                      className="flex items-center justify-center gap-2 w-full py-2 bg-primary text-background rounded-md hover:bg-primary/90 transition-colors font-medium"
                    >
                      {hasBeeNFT ? 'Manage Subscription' : 'Get NFT Access'} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </>
                )}
              </div>
            )}
            
            {/* API Status Section */}
            <div className="bg-background/50 backdrop-blur-sm border border-primary/10 rounded-lg p-6">
              <h2 className="text-xl font-display mb-4">API Status</h2>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-accent">Blockchain API: Operational</span>
              </div>
              <div className="text-xs text-accent/50 mt-2">
                API requests are throttled to prevent rate limiting. This improves reliability.
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
} 