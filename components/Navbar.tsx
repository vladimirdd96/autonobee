"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
import { MovingBorder } from './aceternity/moving-border';
import { Menu, X, ChevronDown, ChevronUp, LayoutDashboard, FileEdit, MessageSquare, BarChart2, TrendingUp, Users, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';

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
  const pathname = usePathname();
  const isDesktop = useMediaQuery('(min-width: 768px)');

  return (
    <header className="w-full py-4 fixed top-0 left-0 z-30">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo and Mobile Menu Button */}
        <div className="flex items-center">
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden relative z-50 p-2 mr-2 rounded-lg bg-background/80 backdrop-blur-sm border border-primary/10"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-accent" />
            ) : (
              <Menu className="h-6 w-6 text-accent" />
            )}
          </button>

          <Link 
            href="/" 
            className="relative z-50 flex items-center shrink-0"
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
        
        {/* Desktop Sign Up Button */}
        <div className="hidden md:flex gap-4 relative z-40 shrink-0">
          {isDesktop && (
            <MovingBorder borderRadius="0.5rem" containerClassName="p-1.5">
              <Link 
                href="/sign-up" 
                className="px-4 py-2 bg-background text-primary rounded-md hover:bg-background/90 transition-colors font-medium"
              >
                Sign Up
              </Link>
            </MovingBorder>
          )}
        </div>

        {/* Mobile Sign Up Button */}
        <div className="md:hidden relative z-50">
          <Link 
            href="/sign-up"
            className="px-4 py-2 bg-primary text-background rounded-md hover:bg-primary/90 transition-colors font-medium"
          >
            Sign Up
          </Link>
        </div>

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
    </header>
  );
} 