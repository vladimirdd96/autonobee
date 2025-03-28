"use client";

import { useState } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { mintNFT } from '@/utils/nft';
import { MovingBorder } from '@/components/aceternity/moving-border';
import { BackgroundBeams } from '@/components/aceternity/background-beams';
import { SparklesCore } from '@/components/aceternity/sparkles';
import { MultiStepLoader } from '@/components/aceternity/multi-step-loader';
import { MeteorEffect } from '@/components/aceternity/meteor-effect';
import { AnimatedGradientText } from '@/components/aceternity/animated-gradient-text';
import { CardContainer, CardBody, CardItem } from '@/components/aceternity/3d-card';
import { AuroraBackground } from '@/components/aceternity/aurora-background';
import Cookies from 'js-cookie';
import Layout from '@/components/Layout';

const tiers = [
  {
    name: 'Basic',
    price: '0.1 SOL',
    features: [
      'Access to AI Content Generation',
      'Chat with AI Assistant',
      'Basic Analytics',
    ],
  },
  {
    name: 'Pro',
    price: '0.5 SOL',
    features: [
      'Everything in Basic',
      'Advanced Analytics',
      'Deployed Web3 Agents',
      'Priority Support',
    ],
  },
];

const deploymentSteps = [
  {
    title: "Initializing Web3 Environment",
    description: "Setting up secure blockchain connection",
  },
  {
    title: "Deploying AI Agents",
    description: "Transferring neural networks to decentralized nodes",
  },
  {
    title: "Optimizing Performance",
    description: "Fine-tuning agent responses and latency",
  },
  {
    title: "Finalizing Setup",
    description: "Completing security checks and activation",
  },
];

export default function MintPage() {
  const { publicKey, checkNFT } = useWallet();
  const [selectedTier, setSelectedTier] = useState<'basic' | 'pro' | null>(null);
  const [isMinting, setIsMinting] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMint = async () => {
    if (!publicKey || !selectedTier) return;

    try {
      setIsMinting(true);
      setError(null);
      
      const result = await mintNFT(publicKey, selectedTier);
      
      // Set cookies for middleware
      Cookies.set('has_nft', 'true', { path: '/' });
      Cookies.set('nft_tier', selectedTier, { path: '/' });

      // Update wallet context
      await checkNFT();

      if (selectedTier === 'pro') {
        setIsDeploying(true);
        // Simulate deployment process
        await new Promise(resolve => setTimeout(resolve, 10000));
        setIsDeploying(false);
      }

      // Get redirect URL from cookie or default to dashboard
      const redirectPath = Cookies.get('redirect_after_mint') || '/dashboard';
      Cookies.remove('redirect_after_mint', { path: '/' });
      
      // Redirect to the appropriate page
      window.location.href = redirectPath;
    } catch (err) {
      console.error('Minting error:', err);
      setError('Failed to mint NFT. Please try again.');
    } finally {
      setIsMinting(false);
    }
  };

  if (!publicKey) {
    return (
      <Layout>
      <div className="flex items-center justify-center h-[calc(100vh-22rem)]">
        <BackgroundBeams />
        <MeteorEffect count={15} color="#f9b72d" className="z-0" />
        <div className="text-center z-10 absolute left-1/2 transform -translate-x-1/2">
          <h1 className="text-4xl font-display mb-4">
            <AnimatedGradientText text="Connect Your Wallet" />
          </h1>
          <p className="text-accent/80">Please connect your wallet to mint an AutonoBee Pass</p>
        </div>
      </div>
      </Layout>
    );
  }

  if (isDeploying) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <BackgroundBeams />
        <MeteorEffect count={10} color="#f9b72d" className="z-0" />
        <div className="max-w-2xl w-full z-10">
          <MultiStepLoader steps={deploymentSteps} />
        </div>
      </div>
    );
  }

  return (
    <div className="max-h-[80vh]">

    <Layout>
      <div className="absolute inset-0 w-full h-[100vh]">
        <SparklesCore
            background="transparent"
            minSize={0.6}
            maxSize={1.4}
            particleDensity={500}
            className="w-full h-full"
            particleColor="#f9b72d"
          />
        </div>
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">

        <MeteorEffect count={20} color="#f9b72d" className="z-0" />
        

        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 min-h-[30rem] flex flex-col justify-center items-center">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-display mb-4">
              <AnimatedGradientText text="Choose Your Pass" />
            </h1>
            <p className="text-accent/80 max-w-2xl mx-auto">
              Select a tier to unlock AutonoBee's powerful AI features. Upgrade anytime to access more capabilities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {tiers.map((tier) => (
              <CardContainer key={tier.name.toLowerCase()} className="inter-var">
                <CardBody className="bg-background/40 backdrop-blur-sm relative group/card dark:hover:shadow-2xl dark:hover:shadow-primary/20 dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full rounded-xl p-6 border">
                  <CardItem
                    translateZ={50}
                    className="text-2xl font-display text-accent"
                  >
                    {tier.name}
                  </CardItem>
                  <CardItem
                    translateZ={60}
                    className="text-3xl font-display text-primary mt-2"
                  >
                    <p>{tier.price}</p>
                  </CardItem>
                  <CardItem
                    translateZ={40}
                    className="mt-8"
                  >
                    <ul className="space-y-4">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-accent/80">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="w-6 h-6 text-primary"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardItem>
                  <div className="mt-8">
                    <MovingBorder borderRadius="0.75rem" className="p-1">
                      <button
                        onClick={() => setSelectedTier(tier.name.toLowerCase() as 'basic' | 'pro')}
                        className={`w-full py-4 px-8 rounded-xl font-medium transition-colors ${
                          selectedTier === tier.name.toLowerCase()
                            ? 'bg-primary text-background'
                            : 'bg-background/90 text-primary hover:bg-background'
                        }`}
                      >
                        Select {tier.name}
                      </button>
                    </MovingBorder>
                  </div>
                </CardBody>
              </CardContainer>
            ))}
          </div>

          {selectedTier && (
            <div className="mt-8 text-center">
              <MovingBorder borderRadius="0.75rem" className="p-1 inline-block">
                <button
                  onClick={handleMint}
                  disabled={isMinting}
                  className="px-8 py-4 rounded-xl font-medium bg-background/90 text-primary hover:bg-background transition-colors"
                >
                  {isMinting ? 'Minting...' : `Mint ${selectedTier.toUpperCase()} Pass`}
                </button>
              </MovingBorder>
              {error && <p className="mt-4 text-red-500">{error}</p>}
            </div>
          )}
        </div>
      </div>
    </Layout>
    </div>

  );
} 