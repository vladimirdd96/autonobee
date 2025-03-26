"use client";

import { useAuth } from '@/contexts/AuthContext';
import { Lock } from 'lucide-react';
import Layout from '@/components/Layout';

export default function Settings() {
  const { isXAuthorized, authorizeX, logoutX } = useAuth();

  return (
    <Layout>
      <div className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-3xl font-display mb-8">Settings</h1>
        
        {!isXAuthorized ? (
          <div className="absolute inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-accent mb-2">X Authorization Required</h3>
              <p className="text-accent/80 mb-6">Please authorize your X account to access settings.</p>
              <button
                onClick={authorizeX}
                className="px-6 py-3 bg-primary text-background rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 mx-auto"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                Authorize
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl">
            <div className="bg-background/50 backdrop-blur-sm border border-primary/10 rounded-lg p-6">
              <h2 className="text-xl font-display mb-4">X Account</h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  <span className="text-accent">Connected</span>
                </div>
                <button
                  onClick={logoutX}
                  className="px-4 py-2 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors font-medium"
                >
                  Disconnect
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
} 