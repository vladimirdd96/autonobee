"use client";

import Link from 'next/link';
import Logo from './Logo';
import { FloatingNavbar } from './aceternity/floating-navbar';
import { MovingBorder } from './aceternity/moving-border';
import { HoverGlowEffect } from './aceternity/hover-glow-effect';

const navItems = [
  { name: 'Home', link: '/' },
  { name: 'Dashboard', link: '/dashboard' },
];

export default function Navbar() {
  return (
    <header className="w-full py-4 fixed top-0 left-0 z-30">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="relative z-40 flex items-center">
          <Logo transparent={true} />
        </Link>
        
        <FloatingNavbar navItems={navItems} />
        
        <div className="flex gap-4 relative z-40">
          <MovingBorder borderRadius="0.5rem" containerClassName="p-1.5">
            <Link 
              href="/sign-up" 
              className="px-4 py-2 bg-background text-primary rounded-md hover:bg-background/90 transition-colors font-medium"
            >
              Sign Up
            </Link>
          </MovingBorder>
        </div>
      </div>
    </header>
  );
} 