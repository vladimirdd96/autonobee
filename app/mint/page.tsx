"use client";

import { useState, useEffect } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { Sparkles, Loader2, Check, AlertCircle, CheckCircle } from 'lucide-react';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { AnimatedGradientText } from '@/components/aceternity/animated-gradient-text';
import { cn } from '@/lib/utils';
import { MeteorEffect } from '@/components/aceternity/meteor-effect';
import { simulateNFTOwnership } from '@/utils/dev-helper';
import { prepareNFTTransaction } from '@/utils/metaplex';

export default function MintPage() {
  const [selectedTier, setSelectedTier] = useState<'basic' | 'pro' | 'enterprise' | null>(null);
  const [isMinting, setIsMinting] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);
  const [mintError, setMintError] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const [isNFTStatusLoading, setIsNFTStatusLoading] = useState(true);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  
  const { 
    isConnected, 
    connect, 
    publicKey, 
    nftTier,
    hasBeeNFT,
    checkNFT,
    isConnecting
  } = useWallet();

  // Check NFT status when the page loads
  useEffect(() => {
    if (isConnected && publicKey) {
      console.log('Mint page loaded - checking NFT status...');
      setIsNFTStatusLoading(true);
      checkNFT().finally(() => {
        setIsNFTStatusLoading(false);
      });
    } else if (!isConnected) {
      setIsNFTStatusLoading(false);
    }
  }, [isConnected, publicKey, checkNFT]);

  // Reset selected tier if user already has that tier after connecting wallet
  useEffect(() => {
    if (isConnected && hasBeeNFT) {
      // If user selected basic but already has any NFT, deselect it
      if (selectedTier === 'basic') {
        setSelectedTier(null);
      }
      
      // If user selected pro but already has pro NFT, deselect it
      if (selectedTier === 'pro' && nftTier === 'pro') {
        setSelectedTier(null);
      }
    }
  }, [isConnected, hasBeeNFT, nftTier, selectedTier]);

  const handleMint = async () => {
    if (!selectedTier || !publicKey) return;

    try {
      setIsMinting(true);
      setMintError(null);
      
      // Get the wallet from window.phantom
      const wallet = (window as any).phantom?.solana;
      if (!wallet) {
        throw new Error('Phantom wallet not found');
      }

      // Prepare the NFT transaction
      const { transactionBuilder, metaplex, paymentTransaction } = await prepareNFTTransaction(
        publicKey.toString(),
        selectedTier,
        wallet
      );

      // First, send the payment transaction
      console.log('Sending payment transaction...');
      const paymentResponse = await wallet.signAndSendTransaction(paymentTransaction);
      console.log('Payment transaction sent:', paymentResponse.signature);

      // Then, build and send the NFT transaction
      console.log('Sending NFT transaction...');
      const { response } = await transactionBuilder.sendAndConfirm(metaplex);
      console.log('NFT transaction sent:', response.signature);
      
      // Check NFT ownership after minting - with retries
      console.log('Mint successful, checking NFT status...');
      setIsNFTStatusLoading(true);
      await checkNFT();
      
      // Double-check with a slight delay to ensure blockchain updates are reflected
      setTimeout(async () => {
        console.log('Performing second NFT ownership check...');
        await checkNFT();
        
        // One final check with longer delay
        setTimeout(async () => {
          console.log('Performing final NFT ownership check...');
          await checkNFT().finally(() => {
            setIsNFTStatusLoading(false);
          });
        }, 3000);
      }, 1000);
      
      setMintSuccess(true);
      setShowSuccessNotification(true);
      // Hide notification after 4 seconds
      setTimeout(() => setShowSuccessNotification(false), 4000);
    } catch (error) {
      console.error('Minting error:', error);
      setMintError(error instanceof Error ? error.message : 'Failed to mint NFT');
      setIsNFTStatusLoading(false);
    } finally {
      setIsMinting(false);
      setIsUpgrading(false);
    }
  };

  const handleTierSelect = (tier: 'basic' | 'pro' | 'enterprise') => {
    // Don't allow selecting enterprise tier (coming soon)
    if (tier === 'enterprise') return;
    
    // Don't allow selecting basic if user already has basic or pro
    if (tier === 'basic' && hasBeeNFT) return;
    
    // Don't allow selecting pro if user already has pro
    if (tier === 'pro' && nftTier === 'pro') return;
    
    setSelectedTier(tier);
    setMintError(null);
    setMintSuccess(false);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 pt-24 pb-16 relative">
        <MeteorEffect count={20} color="#f9b72d" className="z-0" />
        
        {/* Success notification banner */}
        {showSuccessNotification && (
          <div className="fixed top-20 inset-x-0 flex justify-center z-50 animate-fade-in-down">
            <div className="bg-green-500/90 text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              {selectedTier === 'pro' ? 'Pro subscription successfully minted!' : 'NFT successfully minted!'}
            </div>
          </div>
        )}
        
        <div className="max-w-4xl mx-auto text-center relative z-10 mb-12">
          <AnimatedGradientText 
            text="Subscription NFT Minting" 
            className="text-3xl md:text-4xl font-display mb-4"
          />
            <p className="text-accent/80 max-w-2xl mx-auto">
            Select and mint a subscription NFT to unlock premium features. Your NFT grants permanent access to the corresponding tier's benefits.
            </p>
          </div>

        {isNFTStatusLoading || isConnecting ? (
          <div className="max-w-4xl mx-auto bg-background/50 backdrop-blur-sm p-8 rounded-xl border border-accent/10 text-center">
            <div className="flex flex-col items-center justify-center gap-2 mb-3">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
              <h3 className="text-xl font-display text-primary mt-4">
                {isConnecting ? "Connecting wallet..." : "Checking NFT status..."}
              </h3>
            </div>
            <p className="text-accent/80 mb-4">
              {isConnecting 
                ? "Please approve the connection request in your wallet." 
                : "Verifying your NFT ownership status on the blockchain..."}
            </p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto relative z-10">
              {/* Basic Tier Card */}
              <div 
                className={cn(
                  "bg-background/30 backdrop-blur-sm p-6 rounded-xl border",
                  "transition-all duration-300",
                  (nftTier === 'basic' && hasBeeNFT) ? "opacity-75" : "",
                  (nftTier === 'basic' && hasBeeNFT) ? "border-primary" : "",
                  selectedTier === 'basic' 
                    ? "border-primary ring-2 ring-primary/20 transform scale-[1.02] shadow-lg shadow-primary/10" 
                    : "border-accent/10 hover:border-primary/30 hover:ring-2 hover:ring-primary/10 hover:shadow-lg hover:shadow-primary/5 hover:transform hover:scale-[1.01]"
                )}
                onClick={() => {
                  // Only allow selecting if user doesn't have any NFT yet
                  if (!hasBeeNFT) {
                    handleTierSelect('basic');
                  }
                }}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-display text-primary">Basic Subscription NFT</h3>
                    </div>
                    <div className="text-xl font-bold text-accent">0.1 SOL</div>
                  </div>
                  
                  <div className="text-sm text-accent/80">
                    Mint this NFT to unlock the Starter plan with basic features for social content creation.
                  </div>
                  
                  <div className="pt-4">
                    <h4 className="text-sm font-medium text-accent mb-2">Includes:</h4>
                    <ul className="space-y-2">
                      {[
                        "500 AI-powered posts per month",
                        "Smart caption generator for X",
                        "Viral hashtag recommendations",
                        "Post scheduling (up to 7 days)",
                        "Real-time engagement analytics"
                      ].map((feature, i) => (
                        <li key={i} className="flex items-start text-sm">
                          <Check className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-accent/90">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex items-center">
                    {isNFTStatusLoading ? (
                      <div className="w-full py-2 px-3 bg-accent/10 text-center rounded-lg flex items-center justify-center">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        <span>Checking status...</span>
                      </div>
                    ) : hasBeeNFT ? (
                      <div className="w-full py-2 px-3 bg-accent/10 text-center rounded-lg">
                        {nftTier === 'basic' ? "Active" : "Available"}
                      </div>
                    ) : (
                      <>
                        <input 
                          type="radio" 
                          id="basic-tier"
                          name="tier"
                          checked={selectedTier === 'basic'} 
                          onChange={() => handleTierSelect('basic')}
                          className="mr-2 accent-primary w-4 h-4"
                          disabled={isNFTStatusLoading}
                        />
                        <label htmlFor="basic-tier" className="text-accent font-medium">
                          Select Basic Tier
                        </label>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Pro Tier Card */}
              <div 
                className={cn(
                  "bg-background/30 backdrop-blur-sm p-6 rounded-xl border",
                  "transition-all duration-300",
                  (nftTier === 'pro' && hasBeeNFT) ? "opacity-75" : "",
                  (nftTier === 'pro' && hasBeeNFT) ? "border-primary" : "",
                  selectedTier === 'pro' 
                    ? "border-primary ring-2 ring-primary/20 transform scale-[1.02] shadow-lg shadow-primary/10" 
                    : "border-accent/10 hover:border-primary/30 hover:ring-2 hover:ring-primary/10 hover:shadow-lg hover:shadow-primary/5 hover:transform hover:scale-[1.01]"
                )}
                onClick={() => {
                  // Only allow selecting if: not already Pro tier OR if loading
                  if (!(nftTier === 'pro' && hasBeeNFT)) {
                    handleTierSelect('pro');
                  }
                }}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-display text-primary">Pro Subscription NFT</h3>
                    </div>
                    <div className="text-xl font-bold text-accent">0.5 SOL</div>
                  </div>
                  
                  <div className="text-sm text-accent/80">
                    Mint this NFT to unlock the Professional plan with advanced features for content creation and analytics.
                  </div>
                  
                  <div className="pt-4">
                    <h4 className="text-sm font-medium text-accent mb-2">Includes:</h4>
                    <ul className="space-y-2">
                      {[
                        "Unlimited AI-powered content creation",
                        "Advanced audience sentiment analysis",
                        "Competitor content insights",
                        "Unlimited post scheduling",
                        "Engagement-optimized posting times",
                        "Trend prediction & content suggestions"
                      ].map((feature, i) => (
                        <li key={i} className="flex items-start text-sm">
                          <Check className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-accent/90">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex items-center">
                    {isNFTStatusLoading ? (
                      <div className="w-full py-2 px-3 bg-accent/10 text-center rounded-lg flex items-center justify-center">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        <span>Checking status...</span>
                      </div>
                    ) : nftTier === 'pro' && hasBeeNFT ? (
                      <div className="w-full py-2 px-3 bg-accent/10 text-center rounded-lg">
                        Active
                      </div>
                    ) : (
                      <>
                        <input 
                          type="radio" 
                          id="pro-tier"
                          name="tier"
                          checked={selectedTier === 'pro'} 
                          onChange={() => handleTierSelect('pro')}
                          className="mr-2 accent-primary w-4 h-4"
                          disabled={isNFTStatusLoading || (nftTier === 'pro' && hasBeeNFT)}
                        />
                        <label htmlFor="pro-tier" className="text-accent font-medium">
                          Select Pro Tier
                        </label>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Enterprise Tier Card */}
              <div 
                className={cn(
                  "bg-background/30 backdrop-blur-sm p-6 rounded-xl border",
                  "transition-all duration-300 opacity-75",
                  hasBeeNFT ? "opacity-75" : "border-accent/10 hover:border-primary/30 hover:ring-2 hover:ring-primary/10 hover:shadow-lg hover:shadow-primary/5 hover:transform hover:scale-[1.01]"
                )}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-display text-primary">Enterprise Subscription NFT</h3>
                    </div>
                    <div className="text-xl font-bold text-accent">1.0 SOL</div>
                  </div>
                  
                  <div className="text-sm text-accent/80">
                    Complete solution for teams and agencies with all professional features plus team collaboration tools.
                  </div>
                  
                  <div className="pt-4">
                    <h4 className="text-sm font-medium text-accent mb-2">Includes:</h4>
                    <ul className="space-y-2">
                      {[
                        "Everything in Professional",
                        "Multi-user collaboration workspace",
                        "Brand voice customization",
                        "AI trained on your highest-performing content",
                        "Advanced ROI & conversion tracking",
                        "Dedicated success manager"
                      ].map((feature, i) => (
                        <li key={i} className="flex items-start text-sm">
                          <Check className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-accent/90">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex items-center">
                    {isNFTStatusLoading ? (
                      <div className="w-full py-2 px-3 bg-accent/10 text-center rounded-lg flex items-center justify-center">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        <span>Checking status...</span>
                      </div>
                    ) : (
                      <div className="w-full py-2 px-3 bg-accent/10 text-center rounded-lg">
                        {nftTier === 'enterprise' && hasBeeNFT ? "Active" : "Under Development"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* NFT Status and Minting Controls */}
            <div className="max-w-6xl mx-auto mt-8 relative z-10">
              {hasBeeNFT && nftTier === 'pro' ? (
                <div className="bg-primary/10 p-6 rounded-xl text-center">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Check className="h-6 w-6 text-primary" />
                    <h3 className="text-xl font-display text-primary">You have the Pro subscription NFT</h3>
                  </div>
                  <p className="text-accent/80 mb-4">
                    You already have access to all premium features. Enterprise tier coming soon!
                  </p>
                </div>
              ) : hasBeeNFT && nftTier === 'basic' ? (
                <div className="bg-primary/10 p-6 rounded-xl text-center">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Check className="h-6 w-6 text-primary" />
                    <h3 className="text-xl font-display text-primary">You have the Basic subscription NFT</h3>
                  </div>
                  <p className="text-accent/80 mb-4">
                    You have access to basic features. Consider upgrading to Pro for additional features.
                  </p>
                  
                  <button
                    onClick={async () => {
                      setIsUpgrading(true);
                      handleTierSelect('pro');
                      // Wait a brief moment for state to update
                      setTimeout(() => {
                        // Directly mint the Pro NFT
                        handleMint();
                        // Scroll to the mint button area to show progress
                        const mintSection = document.getElementById('mint-controls');
                        if (mintSection) {
                          mintSection.scrollIntoView({ behavior: 'smooth' });
                        }
                      }, 100);
                    }}
                    disabled={isUpgrading || isMinting}
                    className={cn(
                      "px-6 py-3 rounded-lg font-medium transition-colors",
                      isUpgrading || isMinting 
                        ? "bg-accent/20 text-accent/50 cursor-not-allowed" 
                        : "bg-primary text-background hover:bg-primary/90"
                    )}
                  >
                    {isUpgrading || isMinting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {isUpgrading ? "Upgrading..." : "Minting..."}
                      </span>
                    ) : (
                      "Upgrade to Pro"
                    )}
                  </button>
                </div>
              ) : !isConnected ? (
                <div className="bg-accent/10 p-6 rounded-xl text-center">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <AlertCircle className="h-6 w-6 text-accent" />
                    <h3 className="text-xl font-display text-accent">Wallet Not Connected</h3>
                  </div>
                  <p className="text-accent/80 mb-4">
                    Connect your Solana wallet to mint subscription NFTs.
                  </p>
                  <button
                    onClick={connect}
                    className="px-6 py-3 bg-primary text-background rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  >
                    Connect Wallet
                  </button>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row items-center justify-between bg-background/50 backdrop-blur-sm p-6 rounded-xl border border-primary/10" id="mint-controls">
                  <div>
                    <h3 className="text-lg font-medium text-accent mb-1">
                      {selectedTier 
                        ? `Ready to mint ${selectedTier === 'pro' ? 'Pro' : 'Basic'} Subscription NFT` 
                        : 'Select a subscription tier to mint'}
                    </h3>
                    <p className="text-sm text-accent/80">
                      {selectedTier 
                        ? `This will cost ${selectedTier === 'pro' ? '0.5' : '0.1'} SOL and grant permanent access to the ${selectedTier === 'pro' ? 'Professional' : 'Starter'} plan.` 
                        : 'Choose between Basic (0.1 SOL) or Pro (0.5 SOL) subscription tiers.'}
                    </p>
                    
                    {/* Error Message */}
                    {mintError && (
                      <div className="flex items-center gap-2 text-red-500 mt-2 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>{mintError}</span>
                      </div>
                    )}
                    
                    {/* Success Message */}
                    {mintSuccess && (
                      <div className="flex items-center gap-2 text-green-500 mt-2 text-sm">
                        <Check className="h-4 w-4" />
                        <span>NFT minted successfully! Your subscription is now active.</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleMint}
                    disabled={!selectedTier || isMinting || mintSuccess}
                    className={cn(
                      "px-6 py-3 rounded-lg font-medium transition-colors mt-4 md:mt-0",
                      (!selectedTier || isMinting || mintSuccess)
                        ? "bg-accent/20 text-accent/50 cursor-not-allowed"
                        : "bg-primary text-background hover:bg-primary/90"
                    )}
                  >
                    {isMinting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Minting...
                      </span>
                    ) : mintSuccess ? (
                      <span className="flex items-center gap-2">
                        <Check className="h-4 w-4" />
                        Minted Successfully
                      </span>
                    ) : (
                      `Mint ${selectedTier ? (selectedTier === 'pro' ? 'Pro' : 'Basic') : ''} NFT`
                    )}
                  </button>
                </div>
              )}
            </div>
          </>
        )}
        
        {/* Back Button */}
        <div className="max-w-4xl mx-auto mt-8 text-center relative z-10">
          {!(isNFTStatusLoading || isConnecting) && (
            <Link
              href="/dashboard"
              className="text-accent hover:text-primary transition-colors underline"
            >
              ← Back to Dashboard
            </Link>
          )}
        </div>
      </div>
    </Layout>
  );
} 