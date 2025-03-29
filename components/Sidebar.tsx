"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  MessageSquare,
  Wand2,
  TrendingUp,
  Settings,
  FileEdit,
  BarChart2,
  Users,
  Sparkles,
  Menu,
  X,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

interface SidebarProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function Sidebar({ isOpen, onOpenChange }: SidebarProps) {
  const pathname = usePathname();
  const { 
    isConnected, 
    hasBeeNFT, 
    selectedPlan, 
    nftTier,
    isConnecting, 
    checkNFT,
    isNFTStatusLoading
  } = useWallet();

  // Check NFT status when sidebar opens
  useEffect(() => {
    if (isOpen && isConnected) {
      checkNFT();
    }
  }, [isOpen, isConnected, checkNFT]);

  const navItems = [
    { name: 'Home', path: '/', icon: LayoutDashboard },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Content Creation', path: '/content-creation', icon: FileEdit },
    { name: 'Chat', path: '/chat', icon: MessageSquare },
    { name: 'Analytics', path: '/analytics', icon: BarChart2 },
    { name: 'Trends', path: '/trends', icon: TrendingUp },
    { name: 'Team', path: '/team', icon: Users },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  // Close sidebar when route changes
  const handleLinkClick = () => {
    onOpenChange(false);
  };
  
  return (
    <>
      {/* Hamburger Menu Button */}
      <button
        onClick={() => onOpenChange(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-background/80 backdrop-blur-sm border border-primary/10"
      >
        {isOpen ? <X className="h-6 w-6 text-accent" /> : <Menu className="h-6 w-6 text-accent" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => onOpenChange(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 h-screen bg-background border-r border-primary/10 z-40
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        w-64 pt-16
      `}>
        <div className="px-4 py-6 overflow-y-auto h-full flex flex-col">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                href={item.path} 
                onClick={handleLinkClick}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  pathname === item.path 
                    ? 'bg-primary text-background' 
                    : 'text-accent hover:bg-primary/10'
                }`}
              >
                <item.icon className={`mr-3 h-5 w-5 ${
                  pathname === item.path 
                    ? 'text-background' 
                    : 'text-accent'
                }`} />
                {item.name}
              </Link>
            ))}
          </nav>
          
          <div className="flex-1"></div>
          
          {/* Subscription section - moved to bottom */}
          {isConnected ? (
            <div className="mt-auto pt-4 bg-accent/5 rounded-lg border border-accent/10">
              <div className="flex items-center mb-2 px-4">
                <Sparkles className="h-5 w-5 text-primary mr-2" />
                <h3 className="font-medium text-primary">Subscription</h3>
              </div>
              
              {isConnecting || isNFTStatusLoading ? (
                <div className="mb-3 px-4 py-2 flex flex-col items-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Loader2 className="h-4 w-4 text-primary animate-spin" />
                    <span className="text-sm text-accent">Checking status...</span>
                  </div>
                </div>
              ) : (
                <div className="mb-3 text-sm text-accent/80 px-4">
                  {hasBeeNFT 
                    ? `Your ${nftTier ? nftTier.charAt(0).toUpperCase() + nftTier.slice(1) : 'Basic'} plan is currently active.` 
                    : 'No active subscription plan.'}
                </div>
              )}
              
              <div className="px-4 pb-4">
                <Link
                  href="/mint"
                  className="flex items-center justify-between w-full py-2 px-3 text-xs font-medium rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  <span>{hasBeeNFT ? 'Manage Subscription' : 'Get Started'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </aside>
    </>
  );
} 