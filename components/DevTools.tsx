"use client";

import React, { useState, useEffect } from 'react';
import { 
  simulateNFTOwnership, 
  simulateWalletConnection, 
  resetAllSimulations,
  isNFTSimulationActive,
  isWalletSimulationActive,
  getSimulatedNFTTier,
  getSimulatedWalletAddress
} from '@/utils/dev-helper';
import { useWallet } from '@/contexts/WalletContext';

interface NFT {
  mint: string;
  name: string;
  image?: string;
  tier?: string;
}

export default function DevTools() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<'basic' | 'pro' | 'enterprise'>('basic');
  const [customAddress, setCustomAddress] = useState('');
  const [walletNFTs, setWalletNFTs] = useState<NFT[]>([]);
  const [loadingNFTs, setLoadingNFTs] = useState(false);
  const { publicKey, hasBeeNFT, nftTier, isConnected } = useWallet();

  // Get simulation status
  const nftSimActive = isNFTSimulationActive();
  const walletSimActive = isWalletSimulationActive(); 
  const simWalletAddress = getSimulatedWalletAddress();
  const simNftTier = getSimulatedNFTTier();
  
  // Address to use for queries (either the real wallet or simulated one)
  const effectiveWalletAddress = walletSimActive 
    ? simWalletAddress 
    : (publicKey || '');

  // Fetch wallet NFTs when the effective wallet address changes or when DevTools is opened
  useEffect(() => {
    if (isOpen && effectiveWalletAddress) {
      fetchWalletNFTs();
    }
  }, [isOpen, effectiveWalletAddress]);

  const fetchWalletNFTs = async () => {
    if (!effectiveWalletAddress) return;
    
    setLoadingNFTs(true);
    try {
      const response = await fetch(`/api/wallet-nfts?address=${effectiveWalletAddress}`);
      const data = await response.json();
      
      if (response.ok && data.success) {
        setWalletNFTs(data.nfts || []);
      } else {
        console.error('Failed to fetch wallet NFTs:', data.message);
        setWalletNFTs([]);
      }
    } catch (error) {
      console.error('Error fetching wallet NFTs:', error);
      setWalletNFTs([]);
    } finally {
      setLoadingNFTs(false);
    }
  };

  const toggleDevTools = () => {
    setIsOpen(!isOpen);
  };

  const handleSimulateNFT = (hasNFT: boolean) => {
    simulateNFTOwnership(hasNFT, hasNFT ? selectedTier : undefined);
  };

  const handleSimulateWallet = (isConnected: boolean) => {
    const address = customAddress || (publicKey || '11111111111111111111111111111111');
    simulateWalletConnection(isConnected, isConnected ? address : undefined);
  };

  const handleResetSimulations = () => {
    resetAllSimulations();
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button 
        onClick={toggleDevTools}
        className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1.5 rounded-full shadow"
      >
        DEV
      </button>
      
      {isOpen && (
        <div className="absolute bottom-10 right-0 bg-background/95 backdrop-blur-sm border border-purple-500/30 p-4 rounded-lg shadow-lg text-xs w-80 max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-bold text-purple-500">Developer Tools</h4>
            <span className="px-1.5 py-0.5 bg-purple-500/20 text-purple-400 rounded text-[10px]">
              DEV ONLY
            </span>
          </div>

          <div className="mb-4">
            <div className="text-accent font-medium mb-1">Current Status:</div>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px]">
              <div className="text-accent/70">Wallet Connected:</div>
              <div className={isConnected ? "text-green-500" : "text-red-500"}>
                {isConnected ? "Yes" : "No"}
              </div>
              
              <div className="text-accent/70">Wallet Address:</div>
              <div className="text-accent truncate">
                {publicKey ? `${publicKey.slice(0, 6)}...${publicKey.slice(-4)}` : "None"}
              </div>
              
              <div className="text-accent/70">Has NFT:</div>
              <div className={hasBeeNFT ? "text-green-500" : "text-red-500"}>
                {hasBeeNFT ? "Yes" : "No"}
              </div>
              
              <div className="text-accent/70">NFT Tier:</div>
              <div className="text-accent">
                {nftTier || "None"}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="text-accent font-medium mb-1">Simulation Status:</div>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px]">
              <div className="text-accent/70">NFT Simulation:</div>
              <div className={nftSimActive ? "text-green-500" : "text-accent/50"}>
                {nftSimActive ? "Active" : "Inactive"}
              </div>
              
              <div className="text-accent/70">Simulated Tier:</div>
              <div className="text-accent">
                {simNftTier || "None"}
              </div>
              
              <div className="text-accent/70">Wallet Simulation:</div>
              <div className={walletSimActive ? "text-green-500" : "text-accent/50"}>
                {walletSimActive ? "Active" : "Inactive"}
              </div>
              
              <div className="text-accent/70">Simulated Address:</div>
              <div className="text-accent truncate">
                {simWalletAddress ? `${simWalletAddress.slice(0, 6)}...${simWalletAddress.slice(-4)}` : "None"}
              </div>
            </div>
          </div>

          {effectiveWalletAddress && (
            <div className="mb-4">
              <div className="flex justify-between items-center">
                <div className="text-accent font-medium mb-1">Wallet NFTs:</div>
                <button 
                  onClick={fetchWalletNFTs}
                  className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded"
                >
                  Refresh
                </button>
              </div>
              
              {loadingNFTs ? (
                <div className="text-center py-2 text-accent/70">Loading NFTs...</div>
              ) : walletNFTs.length > 0 ? (
                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {walletNFTs.map((nft) => (
                    <div 
                      key={nft.mint} 
                      className="bg-background/50 border border-purple-500/20 rounded p-2 hover:bg-purple-500/10"
                    >
                      <div className="flex justify-between">
                        <div className="font-medium text-[11px]">{nft.name}</div>
                        {nft.tier && (
                          <div className="text-[10px] px-1.5 bg-purple-500/20 rounded text-purple-400">
                            {nft.tier}
                          </div>
                        )}
                      </div>
                      <div className="text-[10px] text-accent/70 truncate mt-1">
                        {nft.mint}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-2 text-accent/70">No NFTs found</div>
              )}
            </div>
          )}

          <div className="space-y-3">
            <div>
              <div className="text-accent font-medium mb-1">Simulate NFT:</div>
              <div className="flex space-x-2 mb-2">
                <select
                  value={selectedTier}
                  onChange={(e) => setSelectedTier(e.target.value as any)}
                  className="flex-1 bg-background border border-purple-500/30 text-accent p-1 rounded"
                >
                  <option value="basic">Basic Tier</option>
                  <option value="pro">Pro Tier</option>
                  <option value="enterprise">Enterprise Tier</option>
                </select>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleSimulateNFT(true)}
                  className="flex-1 bg-green-500/20 text-green-500 py-1 px-2 rounded hover:bg-green-500/30"
                >
                  Add NFT
                </button>
                <button
                  onClick={() => handleSimulateNFT(false)}
                  className="flex-1 bg-red-500/20 text-red-500 py-1 px-2 rounded hover:bg-red-500/30"
                >
                  Remove NFT
                </button>
              </div>
            </div>

            <div>
              <div className="text-accent font-medium mb-1">Simulate Wallet:</div>
              <div className="mb-2">
                <input
                  type="text"
                  placeholder="Custom wallet address (optional)"
                  value={customAddress}
                  onChange={(e) => setCustomAddress(e.target.value)}
                  className="w-full bg-background border border-purple-500/30 text-accent p-1 rounded text-xs"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleSimulateWallet(true)}
                  className="flex-1 bg-green-500/20 text-green-500 py-1 px-2 rounded hover:bg-green-500/30"
                >
                  Connect
                </button>
                <button
                  onClick={() => handleSimulateWallet(false)}
                  className="flex-1 bg-red-500/20 text-red-500 py-1 px-2 rounded hover:bg-red-500/30"
                >
                  Disconnect
                </button>
              </div>
            </div>

            <div className="pt-2 flex space-x-2">
              <button
                onClick={handleResetSimulations}
                className="flex-1 bg-accent/20 text-accent py-1.5 px-2 rounded hover:bg-accent/30"
              >
                Reset Simulations
              </button>
              <button
                onClick={handleRefresh}
                className="flex-1 bg-purple-500/20 text-purple-500 py-1.5 px-2 rounded hover:bg-purple-500/30"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 