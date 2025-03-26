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
  authorizeXOAuth1: () => void;
  logoutX: () => void;
  isLoading: boolean;
  authMethod: 'oauth2' | 'oauth1' | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isXAuthorized, setIsXAuthorized] = useState(false);
  const [xUser, setXUser] = useState<XUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authMethod, setAuthMethod] = useState<'oauth2' | 'oauth1' | null>(null);

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
          setAuthMethod(data.authMethod || 'oauth2'); // default to oauth2 if not specified
        } else {
          // Reset auth state if not authorized
          setIsXAuthorized(false);
          setXUser(null);
          setAuthMethod(null);
        }
      } catch (error) {
        console.error('Error checking X auth:', error);
        setIsXAuthorized(false);
        setXUser(null);
        setAuthMethod(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkXAuth();
  }, []);

  // Listen for the 'x-auth-success' event from the redirect
  useEffect(() => {
    const handleAuthSuccess = (event: CustomEvent) => {
      // Refresh auth state after successful login
      if (event.detail?.authMethod) {
        setAuthMethod(event.detail.authMethod);
      }
      checkXAuth();
    };

    // Listen for custom event that might be dispatched after redirect
    window.addEventListener('x-auth-success', handleAuthSuccess as EventListener);

    // Check URL for auth success parameter
    const url = new URL(window.location.href);
    const authSuccess = url.searchParams.get('x_auth_success');
    const authMethodParam = url.searchParams.get('auth_method');
    
    if (authSuccess === 'true') {
      // Set auth method if provided
      if (authMethodParam === 'oauth1' || authMethodParam === 'oauth2') {
        setAuthMethod(authMethodParam);
      }
      
      // Clear the parameters from URL to avoid infinite refresh
      url.searchParams.delete('x_auth_success');
      url.searchParams.delete('auth_method');
      window.history.replaceState({}, '', url.toString());
      
      // Refresh auth state
      checkXAuth();
    }

    return () => {
      window.removeEventListener('x-auth-success', handleAuthSuccess as EventListener);
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
        setAuthMethod(data.authMethod || 'oauth2');
      } else {
        setIsXAuthorized(false);
        setXUser(null);
        setAuthMethod(null);
      }
    } catch (error) {
      console.error('Error checking X auth:', error);
      setIsXAuthorized(false);
      setXUser(null);
      setAuthMethod(null);
    } finally {
      setIsLoading(false);
    }
  };

  const authorizeX = () => {
    // Redirect to X OAuth 2.0 authorization page
    window.location.href = '/api/auth/x/authorize';
  };
  
  const authorizeXOAuth1 = () => {
    // Redirect to X OAuth 1.0a authorization page
    window.location.href = '/api/auth/x/authorize-oauth1';
  };

  const logoutX = async () => {
    try {
      setIsLoading(true);
      // Use GET request for logout as implemented in the updated API
      await fetch('/api/auth/x/logout');
      
      setIsXAuthorized(false);
      setXUser(null);
      setAuthMethod(null);
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
        authorizeXOAuth1,
        logoutX,
        isLoading,
        authMethod
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