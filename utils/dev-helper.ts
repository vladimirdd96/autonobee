/**
 * Development helper utilities for testing features
 * IMPORTANT: These functions should not be used in production
 */

import Cookies from 'js-cookie';

// Simulate NFT ownership for testing
export function simulateNFTOwnership(hasNFT: boolean, tier?: 'basic' | 'pro' | 'enterprise') {
  if (process.env.NODE_ENV !== 'development') {
    console.warn('simulateNFTOwnership is only available in development mode');
    return;
  }

  // Store simulation state in cookies
  Cookies.set('dev_simulate_nft', hasNFT ? 'true' : 'false', { path: '/' });
  
  if (tier && hasNFT) {
    Cookies.set('dev_simulate_tier', tier, { path: '/' });
  } else {
    Cookies.remove('dev_simulate_tier', { path: '/' });
  }

  console.log(`[DEV] Simulated NFT ownership set to: ${hasNFT}, tier: ${tier || 'none'}`);
  console.log('[DEV] Please refresh the page to see changes');
}

// Simulate wallet connection
export function simulateWalletConnection(isConnected: boolean, publicKey?: string) {
  if (process.env.NODE_ENV !== 'development') {
    console.warn('simulateWalletConnection is only available in development mode');
    return;
  }

  // Store simulation state in cookies
  Cookies.set('dev_simulate_wallet_connected', isConnected ? 'true' : 'false', { path: '/' });
  
  if (publicKey && isConnected) {
    Cookies.set('dev_simulate_wallet_address', publicKey, { path: '/' });
  } else {
    Cookies.remove('dev_simulate_wallet_address', { path: '/' });
  }

  console.log(`[DEV] Simulated wallet connection set to: ${isConnected}, address: ${publicKey || 'none'}`);
  console.log('[DEV] Please refresh the page to see changes');
}

// Check if NFT simulation is active
export function isNFTSimulationActive() {
  return process.env.NODE_ENV === 'development' && 
    Cookies.get('dev_simulate_nft') === 'true';
}

// Check if wallet connection simulation is active
export function isWalletSimulationActive() {
  return process.env.NODE_ENV === 'development' && 
    Cookies.get('dev_simulate_wallet_connected') === 'true';
}

// Get simulated wallet address
export function getSimulatedWalletAddress(): string | null {
  if (!isWalletSimulationActive()) return null;
  
  return Cookies.get('dev_simulate_wallet_address') || null;
}

// Get simulated NFT tier
export function getSimulatedNFTTier(): 'basic' | 'pro' | 'enterprise' | null {
  if (!isNFTSimulationActive()) return null;
  
  const tier = Cookies.get('dev_simulate_tier');
  if (tier === 'basic' || tier === 'pro' || tier === 'enterprise') {
    return tier;
  }
  
  return 'basic'; // Default to basic if tier not specified
}

// Reset all simulations
export function resetAllSimulations() {
  if (process.env.NODE_ENV !== 'development') {
    console.warn('resetAllSimulations is only available in development mode');
    return;
  }

  // Clear all simulation cookies
  Cookies.remove('dev_simulate_nft', { path: '/' });
  Cookies.remove('dev_simulate_tier', { path: '/' });
  Cookies.remove('dev_simulate_wallet_connected', { path: '/' });
  Cookies.remove('dev_simulate_wallet_address', { path: '/' });

  console.log('[DEV] All simulations have been reset');
  console.log('[DEV] Please refresh the page to see changes');
} 