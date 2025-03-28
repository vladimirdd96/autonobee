"use client";

import { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import { usePathname } from 'next/navigation';

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // const previousPathRef = useRef<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isLandingPage = pathname === '/';

  // useEffect(() => {
  //   // Only open sidebar when navigating from home to dashboard
  //   if (previousPathRef.current === '/' && pathname === '/dashboard') {
  //     setIsSidebarOpen(true);
  //   }
  //   // Update the previous path
  //   previousPathRef.current = pathname;
  // }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-background pt-16">
      <Sidebar isOpen={isSidebarOpen} onOpenChange={setIsSidebarOpen} />
      <main className={`
        flex-1
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
    </div>
  );
} 