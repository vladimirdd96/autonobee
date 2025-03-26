"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface XUser {
  id: string;
  username: string;
  name: string;
}

interface AuthContextType {
  isXAuthorized: boolean;
  xUser: XUser | null;
  authorizeX: () => void;
  logoutX: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isXAuthorized, setIsXAuthorized] = useState(false);
  const [xUser, setXUser] = useState<XUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authorized with X
    const checkXAuth = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/auth/x/check');
        const data = await response.json();
        
        if (data.authorized && data.user) {
          setIsXAuthorized(true);
          setXUser(data.user);
        } else {
          // Reset auth state if not authorized
          setIsXAuthorized(false);
          setXUser(null);
        }
      } catch (error) {
        console.error('Error checking X auth:', error);
        setIsXAuthorized(false);
        setXUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkXAuth();
  }, []);

  // Listen for the 'x-auth-success' event from the redirect
  useEffect(() => {
    const handleAuthSuccess = (event: Event) => {
      // Refresh auth state after successful login
      checkXAuth();
    };

    // Listen for custom event that might be dispatched after redirect
    window.addEventListener('x-auth-success', handleAuthSuccess);

    // Check URL for auth success parameter
    const url = new URL(window.location.href);
    const authSuccess = url.searchParams.get('x_auth_success');
    if (authSuccess === 'true') {
      // Clear the parameter from URL to avoid infinite refresh
      url.searchParams.delete('x_auth_success');
      window.history.replaceState({}, '', url.toString());
      
      // Refresh auth state
      checkXAuth();
    }

    return () => {
      window.removeEventListener('x-auth-success', handleAuthSuccess);
    };
  }, []);

  const checkXAuth = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/x/check');
      const data = await response.json();
      
      if (data.authorized && data.user) {
        setIsXAuthorized(true);
        setXUser(data.user);
      } else {
        setIsXAuthorized(false);
        setXUser(null);
      }
    } catch (error) {
      console.error('Error checking X auth:', error);
      setIsXAuthorized(false);
      setXUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const authorizeX = () => {
    // Redirect to X OAuth authorization page
    window.location.href = '/api/auth/x/authorize';
  };

  const logoutX = async () => {
    try {
      setIsLoading(true);
      // Use GET request for logout as implemented in the updated API
      await fetch('/api/auth/x/logout');
      
      setIsXAuthorized(false);
      setXUser(null);
    } catch (error) {
      console.error('Error logging out from X:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isXAuthorized, 
        xUser, 
        authorizeX, 
        logoutX,
        isLoading
      }}
    >
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