"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
import { MovingBorder } from './aceternity/moving-border';
import { Menu, X, ChevronDown, ChevronUp, LayoutDashboard, FileEdit, MessageSquare, BarChart2, TrendingUp, Users, Settings, LogOut, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/contexts/WalletContext';
import ProfileDropdown from './ProfileDropdown';
import { cn } from '@/lib/utils';

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
  const [scrolled, setScrolled] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const pathname = usePathname();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const isLandingPage = pathname === '/';
  const { isXAuthorized, xUser, authorizeX, logoutX, isLoading } = useAuth();
  const { isConnecting } = useWallet();

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

  const handleProfileLoadingChange = (isLoading: boolean) => {
    setIsProfileLoading(isLoading);
  };

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
          
          {/* Profile Dropdown (Desktop) */}
          <div className="hidden md:block">
            <ProfileDropdown onLoadingChange={handleProfileLoadingChange} />
          </div>
          
          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className="fixed inset-0 bg-background/95 z-40 md:hidden flex flex-col overflow-y-auto pt-16 pb-6 px-4">
              <nav className="space-y-1">
                <Link 
                  href="/" 
                  className={`block py-3 px-4 rounded-lg ${pathname === '/' ? 'bg-primary text-background' : 'text-accent'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <div>
                  <button 
                    onClick={() => setIsDashboardExpanded(!isDashboardExpanded)}
                    className={`w-full flex items-center justify-between py-3 px-4 rounded-lg ${
                      pathname === '/dashboard' ? 'bg-primary text-background' : 'text-accent'
                    }`}
                  >
                    <span>Dashboard</span>
                    {isDashboardExpanded ? 
                      <ChevronUp className="h-5 w-5" /> : 
                      <ChevronDown className="h-5 w-5" />
                    }
                  </button>
                  
                  {isDashboardExpanded && (
                    <div className="pl-4 mt-1 space-y-1">
                      {dashboardItems.map((item) => (
                        <Link
                          key={item.path}
                          href={item.path}
                          className={`flex items-center py-2 px-4 rounded-lg ${
                            pathname === item.path ? 'bg-primary/20 text-primary' : 'text-accent/70'
                          }`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <item.icon className="h-5 w-5 mr-2" />
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </nav>
              
              {/* Mobile Profile Controls */}
              <div className="mt-auto pt-6 border-t border-primary/10">
                <ProfileDropdown onLoadingChange={handleProfileLoadingChange} />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 