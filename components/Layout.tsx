"use client";

import { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import { usePathname } from 'next/navigation';
import { useWallet } from '@/contexts/WalletContext';
import Navbar from './Navbar';
import Footer from './Footer';
import DevTools from './DevTools';

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isLandingPage = pathname === '/';
  const { hasBeeNFT, nftTier, isConnected, checkNFT, publicKey, lastNFTCheck } = useWallet();
  const [isCheckingNFT, setIsCheckingNFT] = useState(false);
  const pathRef = useRef(pathname);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Add debugging panel
  const [showDebug, setShowDebug] = useState(false);

  // Check NFT status only when the route changes to a different path
  useEffect(() => {
    if (isConnected && publicKey && pathname !== pathRef.current) {
      console.log('Route changed to new path. Checking NFT status...');
      pathRef.current = pathname;
      
      // Don't set checking state for cached checks
      setIsCheckingNFT(true);
      checkNFT(false).finally(() => {
        setIsCheckingNFT(false);
      });
    }
  }, [pathname, isConnected, publicKey, checkNFT]);

  // Set up minimal periodic NFT status checking (every 15 minutes)
  useEffect(() => {
    const CHECK_INTERVAL = 15 * 60 * 1000; // 15 minutes in milliseconds
    
    const startPeriodicChecks = () => {
      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      // Only set up interval if the wallet is connected
      if (isConnected && publicKey) {
        console.log('Setting up minimal periodic NFT status checks every 15 minutes');
        
        // Set up interval for periodic checks
        intervalRef.current = setInterval(() => {
          console.log('Running periodic NFT status check');
          checkNFT(false); // Use cache if available
        }, CHECK_INTERVAL);
      }
    };
    
    startPeriodicChecks();
    
    // Clean up interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isConnected, publicKey, checkNFT]);

  // Function to manually check NFT status
  const testNFTStatus = async () => {
    try {
      if (!isConnected) {
        alert("Connect wallet first");
        return;
      }
      
      // Manually check NFT status via the API (force refresh)
      setIsCheckingNFT(true);
      await checkNFT(true);
      setIsCheckingNFT(false);
      alert("NFT status refreshed");
    } catch (error) {
      console.error("Error checking NFT:", error);
      setIsCheckingNFT(false);
      alert("Error checking NFT status");
    }
  };

  // Function to check NFT status directly from API endpoint
  const directAPICheck = async () => {
    try {
      if (!isConnected) {
        alert("Connect wallet first");
        return;
      }
      
      // Direct API call to NFT details endpoint
      const response = await fetch(`/api/nft-details/${publicKey}`);
      const data = await response.json();
      
      console.log("Direct API response:", data);
      alert(`API response: hasBeeNFT=${data.hasBeeNFT}, tier=${data.tier}, plan=${data.plan}`);
    } catch (error) {
      console.error("Error checking NFT via API:", error);
      alert("Error checking NFT via API");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-accent relative overflow-hidden">
      <Navbar />
      <Sidebar isOpen={isSidebarOpen} onOpenChange={setIsSidebarOpen} />
      <main className={`
         flex-1 pt-16
         transition-all duration-300 ease-in-out
         ${isSidebarOpen ? 'ml-64' : 'ml-0'}
         ${isLandingPage ? 'px-4' : 'px-6'}
       `}>
        <div className={`
          ${isLandingPage ? '' : 'max-w-7xl mx-auto w-full'}
          transition-all duration-300 ease-in-out
        `}>
          {children}
        </div>
      </main>
      <Footer />
      
      {/* NFT Debug Panel */}
      <div className="fixed bottom-4 right-4 z-50">
        
      </div>
      
      {/* Include DevTools component */}
      {process.env.NODE_ENV === 'development' && <DevTools />}
    </div>
  );
} 