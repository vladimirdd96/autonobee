"use client";

import { useState } from 'react';
import Sidebar from './Sidebar';
import { usePathname } from 'next/navigation';

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(pathname === '/dashboard');
  const isLandingPage = pathname === '/';

  return (
    <div className="min-h-screen bg-background pt-16">
      <Sidebar isOpen={isSidebarOpen} onOpenChange={setIsSidebarOpen} />
      <main className={`
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