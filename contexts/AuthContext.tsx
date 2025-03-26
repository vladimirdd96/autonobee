"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isXAuthorized: boolean;
  xUser: {
    id: string;
    username: string;
    name: string;
  } | null;
  authorizeX: () => void;
  logoutX: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isXAuthorized, setIsXAuthorized] = useState(false);
  const [xUser, setXUser] = useState<AuthContextType['xUser']>(null);

  useEffect(() => {
    // Check if user is already authorized with X
    const checkXAuth = async () => {
      try {
        const response = await fetch('/api/auth/x/check');
        const data = await response.json();
        if (data.authorized) {
          setIsXAuthorized(true);
          setXUser(data.user);
        }
      } catch (error) {
        console.error('Error checking X auth:', error);
      }
    };

    checkXAuth();
  }, []);

  const authorizeX = () => {
    // Redirect to X OAuth page
    window.location.href = '/api/auth/x/authorize';
  };

  const logoutX = async () => {
    try {
      await fetch('/api/auth/x/logout', { method: 'POST' });
      setIsXAuthorized(false);
      setXUser(null);
    } catch (error) {
      console.error('Error logging out from X:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isXAuthorized, xUser, authorizeX, logoutX }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 