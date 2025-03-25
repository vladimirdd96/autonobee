"use client";

import React from 'react';
import { Lock } from 'lucide-react';

interface GatedSectionProps {
  hasAccess: boolean;
  children: React.ReactNode;
  message?: string;
}

export default function GatedSection({ 
  hasAccess, 
  children, 
  message = "You need to hold $FORGE token to access premium features." 
}: GatedSectionProps) {
  if (hasAccess) {
    return <>{children}</>;
  }
  
  return (
    <div className="bg-grayDark p-8 rounded-lg border border-primary/30">
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
          <Lock className="text-primary w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-accent mb-2">Access Restricted</h3>
        <p className="text-accent/80 mb-6">{message}</p>
        <button className="px-6 py-3 bg-primary text-background rounded-lg font-medium hover:bg-primary/90 transition-colors">
          Connect Wallet
        </button>
      </div>
    </div>
  );
} 