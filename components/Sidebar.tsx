"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
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
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function Sidebar({ isOpen, onOpenChange }: SidebarProps) {
  const pathname = usePathname();
  
  // Close sidebar when route changes, except when navigating to dashboard
  useEffect(() => {
    if (pathname !== '/dashboard') {
      onOpenChange(false);
    }
  }, [pathname, onOpenChange]);

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
        <div className="px-4 py-6 overflow-y-auto h-full">
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
          <div className="absolute bottom-6 left-0 w-full px-4">
            <div className="p-4 rounded-lg bg-primary/10">
              <h3 className="text-primary font-display mb-2 flex items-center">
                <Sparkles className="mr-2 h-5 w-5 text-primary" />
                AutonoBee Pro
              </h3>
              <p className="text-sm text-accent/80 mb-3">
                Professional Features are active for all users until 31st of April 2025
              </p>
              <div className="w-full py-2 bg-primary text-background rounded-md hover:bg-primary/90 transition-colors flex justify-center items-center">
                Activated
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
} 