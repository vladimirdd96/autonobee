"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
import { MovingBorder } from './aceternity/moving-border';
import { Menu, X, ChevronDown, ChevronUp, LayoutDashboard, FileEdit, MessageSquare, BarChart2, TrendingUp, Users, Settings, LogOut, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import WalletButton from './WalletButton';

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};

const dashboardItems = [
  { name: 'Content Creation', path: '/content-creation', icon: FileEdit },
  { name: 'Chat', path: '/chat', icon: MessageSquare },
  { name: 'Analytics', path: '/analytics', icon: BarChart2 },
  { name: 'Trends', path: '/trends', icon: TrendingUp },
  { name: 'Team', path: '/team', icon: Users },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDashboardExpanded, setIsDashboardExpanded] = useState(false);
  const [isDesktopXDropdownOpen, setIsDesktopXDropdownOpen] = useState(false);
  const [isMobileXDropdownOpen, setIsMobileXDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const isLandingPage = pathname === '/';
  const { isXAuthorized, xUser, authorizeX, logoutX, isLoading } = useAuth();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Debug: Log state changes
  useEffect(() => {
    console.log("Desktop dropdown state:", isDesktopXDropdownOpen);
  }, [isDesktopXDropdownOpen]);

  useEffect(() => {
    console.log("Mobile dropdown state:", isMobileXDropdownOpen);
  }, [isMobileXDropdownOpen]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Create refs for dropdown elements
      const desktopDropdown = document.getElementById('x-dropdown');
      const desktopDropdownButton = document.getElementById('x-dropdown-button');
      const mobileDropdown = document.getElementById('mobile-x-dropdown');
      const mobileDropdownButton = document.getElementById('mobile-x-dropdown-button');
      
      // Check for desktop dropdown
      if (isDesktopXDropdownOpen) {
        const clickedInsideDesktopDropdown = 
          (desktopDropdown && desktopDropdown.contains(event.target as Node)) || 
          (desktopDropdownButton && desktopDropdownButton.contains(event.target as Node));
          
        if (!clickedInsideDesktopDropdown) {
          setIsDesktopXDropdownOpen(false);
        }
      }
      
      // Check for mobile dropdown
      if (isMobileXDropdownOpen) {
        const clickedInsideMobileDropdown = 
          (mobileDropdown && mobileDropdown.contains(event.target as Node)) || 
          (mobileDropdownButton && mobileDropdownButton.contains(event.target as Node));
          
        if (!clickedInsideMobileDropdown) {
          setIsMobileXDropdownOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDesktopXDropdownOpen, isMobileXDropdownOpen]);

  return (
    <header className={`w-full fixed top-0 left-0 z-30 transition-all duration-300 ${
      scrolled ? 'bg-black/60 backdrop-blur-lg shadow-lg py-2' : 'py-4'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-2">
          {/* Logo and Mobile Menu Button */}
          <div className="flex items-center">
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden relative z-50 p-2 mr-2 rounded-lg transition-all duration-300 ${
                scrolled 
                  ? 'bg-black/80 backdrop-blur-sm border border-primary/20 hover:bg-black/60' 
                  : 'bg-background/80 backdrop-blur-sm border border-primary/10 hover:bg-background/60'
              }`}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-accent" />
              ) : (
                <Menu className="h-6 w-6 text-accent" />
              )}
            </button>

            <Link 
              href="/" 
              className="relative z-50 flex items-center"
              onClick={() => isMenuOpen && setIsMenuOpen(false)}
            >
              <div className="flex items-center">
                <Logo transparent={true} />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-1 justify-center px-4 max-w-[600px] space-x-4">
            <Link href="/" className={`px-4 py-2 rounded-lg transition-colors ${
              pathname === '/' ? 'bg-primary text-background' : 'text-accent hover:bg-primary/10'
            }`}>
              Home
            </Link>
            <Link href="/dashboard" className={`px-4 py-2 rounded-lg transition-colors ${
              pathname === '/dashboard' ? 'bg-primary text-background' : 'text-accent hover:bg-primary/10'
            }`}>
              Dashboard
            </Link>
          </div>
          
          {/* Desktop Authorize X Button and Wallet Button */}
          <div className="hidden md:flex gap-4 relative z-40 shrink-0">
            <WalletButton />
            {isDesktop && (
              <div className="relative">
                {/* Debug indicator */}
                {isDesktopXDropdownOpen && (
                  <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full z-50" />
                )}
                <div className="relative">
                  {/* Button with moving border */}
                  <MovingBorder borderRadius="0.5rem" containerClassName="p-1.5">
                    <button 
                      id="x-dropdown-button"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent event bubbling
                        if(isXAuthorized) {
                          console.log('Dropdown button clicked, current state:', isDesktopXDropdownOpen);
                          setIsDesktopXDropdownOpen(!isDesktopXDropdownOpen);
                        } else {
                          authorizeX();
                        }
                      }}
                      className={`px-4 py-2 rounded-md transition-all duration-300 font-medium flex items-center gap-2 ${
                        scrolled
                          ? 'bg-background/90 text-primary hover:bg-background'
                          : 'bg-background text-primary hover:bg-background/90'
                      }`}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                          </svg>
                          {isXAuthorized ? (
                            <>
                              {xUser?.username ? `@${xUser.username}` : 'Connected'}
                              <ChevronDown className="w-4 h-4" />
                            </>
                          ) : (
                            'Authorize'
                          )}
                        </>
                      )}
                    </button>
                  </MovingBorder>
                  
                  {/* X Account Dropdown */}
                  {isXAuthorized && isDesktopXDropdownOpen && (
                    <div 
                      id="x-dropdown"
                      className="absolute w-64 bg-background/95 backdrop-blur-sm border border-primary/10 rounded-md shadow-lg py-2 z-50 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200"
                      style={{ 
                        top: '100%',
                        right: '0',
                        marginTop: '0.5rem',
                        transformOrigin: 'top right'
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="absolute right-3 -top-2 w-4 h-4 bg-background/95 border-t border-l border-primary/10 transform rotate-45"></div>
                      {xUser && (
                        <div className="px-4 py-2 border-b border-primary/10 mb-2">
                          <p className="font-medium">{xUser.name}</p>
                          <p className="text-sm text-accent/80">@{xUser.username}</p>
                        </div>
                      )}
                      <button
                        onClick={() => {
                          logoutX();
                          setIsDesktopXDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-accent hover:bg-primary/10 flex items-center gap-2 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Disconnect X Account
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Mobile Authorize X Button */}
          <div className="md:hidden relative z-50 shrink-0">
            <button 
              id="mobile-x-dropdown-button"
              onClick={(e) => {
                e.stopPropagation(); // Prevent event bubbling
                if(isXAuthorized) {
                  console.log('Mobile dropdown button clicked, current state:', isMobileXDropdownOpen);
                  setIsMobileXDropdownOpen(!isMobileXDropdownOpen);
                } else {
                  authorizeX();
                }
              }}
              className={`px-3 py-1.5 rounded-md transition-all duration-300 font-medium text-sm whitespace-nowrap flex items-center gap-2 ${
                scrolled
                  ? 'bg-primary/90 text-background hover:bg-primary'
                  : 'bg-primary text-background hover:bg-primary/90'
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  {isXAuthorized ? (
                    <>
                      {xUser?.username ? `@${xUser.username.substring(0, 5)}...` : 'Connected'}
                      <ChevronDown className="w-4 h-4" />
                    </>
                  ) : (
                    'Authorize'
                  )}
                </>
              )}
            </button>
          </div>
          
          {/* Mobile X Account Dropdown - positioned fixed for reliable rendering */}
          {isXAuthorized && isMobileXDropdownOpen && (
            <div 
              id="mobile-x-dropdown"
              className="fixed w-48 bg-background/95 backdrop-blur-sm border border-primary/10 rounded-md shadow-lg py-1 z-50 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200"
              style={{ 
                top: '4.5rem', 
                right: '1rem',
                transformOrigin: 'top right'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute right-3 -top-2 w-4 h-4 bg-background/95 border-t border-l border-primary/10 transform rotate-45"></div>
              {xUser && (
                <div className="px-4 py-2 border-b border-primary/10 mb-1">
                  <p className="font-medium text-sm">{xUser.name}</p>
                  <p className="text-xs text-accent/80">@{xUser.username}</p>
                </div>
              )}
              <button
                onClick={() => {
                  logoutX();
                  setIsMobileXDropdownOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-accent hover:bg-primary/10 flex items-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Disconnect X Account
              </button>
            </div>
          )}

          {/* Mobile Menu Overlay */}
          {isMenuOpen && (
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
          )}

          {/* Mobile Menu */}
          <div className={`
            fixed top-0 left-0 h-full w-64 bg-background border-r border-primary/10 z-40
            transform transition-transform duration-300 ease-in-out
            ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            md:hidden
          `}>
            <div className="p-6 pt-20">
              <nav className="space-y-4">
                <Link
                  href="/"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-2 rounded-lg transition-colors ${
                    pathname === '/' ? 'bg-primary text-background' : 'text-accent hover:bg-primary/10'
                  }`}
                >
                  Home
                </Link>

                {/* Dashboard */}
                <Link
                  href="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    pathname === '/dashboard' ? 'bg-primary text-background' : 'text-accent hover:bg-primary/10'
                  }`}
                >
                  <LayoutDashboard className="h-5 w-5 mr-3" />
                  Dashboard
                </Link>

                {/* Dashboard Items */}
                {dashboardItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                      pathname === item.path ? 'bg-primary text-background' : 'text-accent hover:bg-primary/10'
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 