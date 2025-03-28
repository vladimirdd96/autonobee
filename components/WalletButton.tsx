import { useState, useEffect } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { MovingBorder } from './aceternity/moving-border';
import { ChevronDown, ChevronUp, Loader2, Wallet } from 'lucide-react';
import { BackgroundBeams } from './aceternity/background-beams';
import { SparklesCore } from './aceternity/sparkles';
import { AnimatedGradientText } from './aceternity/animated-gradient-text';

export default function WalletButton() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isConnected, isConnecting, publicKey, connect, disconnect, nftTier } = useWallet();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById('wallet-dropdown');
      const button = document.getElementById('wallet-button');
      
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

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <div className="relative">
      <MovingBorder borderRadius="0.5rem" containerClassName="p-1.5">
        <button 
          id="wallet-button"
          onClick={() => isConnected ? setIsDropdownOpen(!isDropdownOpen) : connect()}
          className="px-4 py-2 rounded-md transition-all duration-300 font-medium flex items-center gap-2 bg-background/90 text-primary hover:bg-background"
          disabled={isConnecting}
        >
          {isConnecting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="w-4 h-4" />
              {isConnected ? (
                <>
                  {shortenAddress(publicKey!)}
                  {nftTier && (
                    <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                      nftTier === 'pro' ? 'bg-primary/20 text-primary' : 'bg-accent/20 text-accent'
                    }`}>
                      {nftTier.toUpperCase()}
                    </span>
                  )}
                  <ChevronDown className="w-4 h-4" />
                </>
              ) : (
                'Connect Wallet'
              )}
            </>
          )}
        </button>
      </MovingBorder>

      {/* Dropdown Menu */}
      {isDropdownOpen && isConnected && (
        <div 
          id="wallet-dropdown"
          className="absolute right-0 mt-2 w-64 rounded-lg shadow-lg bg-background/95 backdrop-blur-sm border border-primary/10 py-2 z-50 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200"
          style={{ 
            top: '100%',
            right: '0',
            marginTop: '0.5rem',
            transformOrigin: 'top right'
          }}
        >
          <div className="absolute right-3 -top-2 w-4 h-4 bg-background/95 border-t border-l border-primary/10 transform rotate-45"></div>
          <div className="px-4 py-2 border-b border-primary/10 mb-2">
            <p className="font-medium text-accent">Connected Wallet</p>
            <p className="text-sm text-accent/80">{shortenAddress(publicKey!)}</p>
          </div>
          <button
            onClick={disconnect}
            className="w-full px-4 py-2 text-left text-accent hover:bg-primary/10 flex items-center gap-2 transition-colors"
          >
            <ChevronUp className="w-4 h-4" />
            Disconnect Wallet
          </button>
        </div>
      )}
    </div>
  );
} 