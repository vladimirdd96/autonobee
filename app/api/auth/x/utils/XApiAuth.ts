import crypto from 'crypto';
import axios from 'axios';

// Error handling
export class AuthError extends Error {
  code: string;
  details: any;

  constructor(message: string, code: string, details = null) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
    this.details = details;
  }
}

// Rate limiting management
export class RateLimitManager {
  limits: Map<string, {
    limit: number;
    remaining: number;
    reset: number;
  }>;

  constructor() {
    this.limits = new Map();
  }

  updateLimits(endpoint: string, headers: any) {
    this.limits.set(endpoint, {
      limit: parseInt(headers['x-rate-limit-limit']),
      remaining: parseInt(headers['x-rate-limit-remaining']),
      reset: parseInt(headers['x-rate-limit-reset'])
    });
  }

  canMakeRequest(endpoint: string) {
    const limit = this.limits.get(endpoint);
    if (!limit) return true;
    return limit.remaining > 0;
  }
}

// Core authentication class
export class XApiAuth {
  apiKey: string;
  apiKeySecret: string;
  bearerToken: string;
  clientId: string;
  clientSecret: string;
  callbackUrl: string;
  tokenStore: Map<string, any>;
  refreshInterval: number;
  tokenExpiry: number;
  rateLimitManager: RateLimitManager;

  constructor() {
    // Initialize API credentials from environment variables
    this.apiKey = process.env.NEXT_PUBLIC_API_KEY || '';
    this.apiKeySecret = process.env.NEXT_PUBLIC_API_SECRET || '';
    this.bearerToken = process.env.NEXT_PUBLIC_BEARER_TOKEN || '';
    this.clientId = process.env.NEXT_PUBLIC_X_CLIENT_ID || '';
    this.clientSecret = process.env.NEXT_PUBLIC_X_CLIENT_SECRET || '';
    
    // Use ngrok URL if available, otherwise use the app URL
    const baseUrl = process.env.NGROK_STATIC_DOMAIN 
      ? `https://${process.env.NGROK_STATIC_DOMAIN}` 
      : process.env.NEXT_PUBLIC_APP_URL;
    
    this.callbackUrl = `${baseUrl}/api/auth/x/callback`;
    
    // Token store for managing user tokens
    this.tokenStore = new Map();
    
    // Configure token refresh intervals
    this.refreshInterval = 1800000; // 30 minutes
    this.tokenExpiry = 7200000;     // 2 hours
    
    // Initialize rate limit manager
    this.rateLimitManager = new RateLimitManager();
  }

  // PKCE Code Verifier Generation
  generateCodeVerifier() {
    return crypto.randomBytes(32)
      .toString('base64')
      .replace(/[^a-zA-Z0-9]/g, '')
      .substring(0, 128);
  }

  // PKCE Code Challenge Generation
  generateCodeChallenge(verifier: string) {
    return crypto.createHash('sha256')
      .update(verifier)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  // Generate Authorization URL
  generateAuthUrl(state: string, forceLogin = false) {
    const codeVerifier = this.generateCodeVerifier();
    const codeChallenge = this.generateCodeChallenge(codeVerifier);
    
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.callbackUrl,
      scope: 'tweet.read tweet.write users.read follows.read follows.write offline.access',
      state: state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256'
    });

    if (forceLogin) {
      params.append('force_login', 'true');
    }

    return {
      url: `https://twitter.com/i/oauth2/authorize?${params.toString()}`,
      codeVerifier
    };
  }

  // Exchange Code for Access Token
  async getAccessToken(code: string, codeVerifier: string) {
    try {
      const response = await axios.post('https://api.twitter.com/2/oauth2/token', 
        new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: this.callbackUrl,
          code_verifier: codeVerifier
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`
          }
        }
      );

      return response.data;
    } catch (error) {
      return this.handleAuthError(error);
    }
  }

  // Refresh Access Token
  async refreshAccessToken(userId: string) {
    const tokens = this.tokenStore.get(userId);
    let refreshToken;
    
    if (!tokens?.refresh_token) {
      // Try to get refresh token from cookies
      try {
        const { cookies } = await import('next/headers');
        const cookieStore = cookies();
        refreshToken = cookieStore.get('x_refresh_token')?.value;
        
        if (!refreshToken) {
          throw new AuthError('No refresh token available', 'NO_REFRESH_TOKEN');
        }
      } catch (error) {
        throw new AuthError('No refresh token available', 'NO_REFRESH_TOKEN');
      }
    } else {
      refreshToken = tokens.refresh_token;
    }

    try {
      const response = await axios.post('https://api.twitter.com/2/oauth2/token', 
        new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`
          }
        }
      );

      const newTokens = response.data;
      
      // Store tokens in memory
      this.storeUserTokens(userId, newTokens);
      
      // Note: We can't update cookies directly from here
      // The refreshed tokens are stored in memory and will be used for subsequent requests
      // Cookies will need to be updated by the request handler when returning a response
      
      return newTokens;
    } catch (error) {
      return this.handleAuthError(error);
    }
  }

  // Store User Tokens
  storeUserTokens(userId: string, tokens: any) {
    tokens.created_at = Date.now();
    this.tokenStore.set(userId, tokens);
    
    // Schedule token refresh
    setTimeout(() => {
      this.refreshAccessToken(userId).catch(err => console.error('Token refresh failed:', err));
    }, this.refreshInterval);
  }

  // Get User Tokens
  async getUserTokens(userId: string) {
    let tokens = this.tokenStore.get(userId);
    
    // If tokens not in memory, try to get from cookies
    if (!tokens) {
      try {
        // Import cookies dynamically to avoid SSR issues
        const { cookies } = await import('next/headers');
        const cookieStore = cookies();
        
        const accessToken = cookieStore.get('x_access_token')?.value;
        const refreshToken = cookieStore.get('x_refresh_token')?.value;
        
        if (accessToken) {
          tokens = {
            access_token: accessToken,
            refresh_token: refreshToken,
            created_at: Date.now() - 60000 // Assume it's a minute old
          };
          
          // Store in memory for future use
          this.tokenStore.set(userId, tokens);
        }
      } catch (error) {
        console.error('Error retrieving tokens from cookies:', error);
      }
    }
    
    if (!tokens) return null;

    // Check if tokens are expired
    const expiryTime = tokens.created_at + this.tokenExpiry;
    if (Date.now() >= expiryTime) {
      return this.refreshAccessToken(userId);
    }

    return tokens;
  }

  // Revoke User Tokens
  async revokeTokens(userId: string) {
    const tokens = this.tokenStore.get(userId);
    if (!tokens) return;

    try {
      // Revoke access token
      await axios.post('https://api.twitter.com/2/oauth2/revoke', 
        new URLSearchParams({
          token: tokens.access_token,
          token_type_hint: 'access_token'
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`
          }
        }
      );

      // Revoke refresh token
      if (tokens.refresh_token) {
        await axios.post('https://api.twitter.com/2/oauth2/revoke', 
          new URLSearchParams({
            token: tokens.refresh_token,
            token_type_hint: 'refresh_token'
          }).toString(),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`
            }
          }
        );
      }
    } catch (error) {
      console.error('Error revoking tokens:', error);
    } finally {
      this.tokenStore.delete(userId);
    }
  }

  // Make Authenticated Request
  async makeAuthenticatedRequest(endpoint: string, method = 'GET', data = null, userId: string | null = null): Promise<any> {
    let headers: any = {};
    
    if (userId) {
      // Use user context authentication
      const tokens = await this.getUserTokens(userId);
      if (!tokens) {
        throw new AuthError('User not authenticated', 'USER_NOT_AUTHENTICATED');
      }
      headers.Authorization = `Bearer ${tokens.access_token}`;
    } else {
      // Use app-only authentication
      headers.Authorization = `Bearer ${this.bearerToken}`;
    }

    // Check rate limits
    if (!this.rateLimitManager.canMakeRequest(endpoint)) {
      throw new AuthError('Rate limit exceeded', 'RATE_LIMIT');
    }

    // Determine which API version to use
    // Trends endpoints use v1.1, everything else uses v2
    const isV1Endpoint = endpoint.startsWith('trends/') || endpoint.startsWith('geo/') || endpoint.includes('trends');
    const apiVersion = isV1Endpoint ? '1.1' : '2';
    const apiUrl = `https://api.twitter.com/${apiVersion}/${endpoint}`;
    
    console.log(`[XApiAuth] Making request to: ${apiUrl}`, { 
      method, 
      hasHeaders: !!headers, 
      userId: userId || 'none',
      hasData: !!data 
    });

    try {
      const response = await axios({
        method,
        url: apiUrl,
        headers,
        data
      });

      // Update rate limits
      if (response.headers['x-rate-limit-limit']) {
        this.rateLimitManager.updateLimits(endpoint, response.headers);
      }
      
      console.log(`[XApiAuth] Request successful, status: ${response.status}`);
      return response.data;
    } catch (error: unknown) {
      const axiosError = error as any;
      console.error(`[XApiAuth] Request failed: ${axiosError?.response?.status || 'Unknown status'}`, {
        endpoint,
        errorMessage: axiosError?.message,
        responseData: axiosError?.response?.data
      });
      
      if (axiosError?.response?.status === 401 && userId) {
        console.log('[XApiAuth] 401 error, attempting token refresh');
        // Token might be expired, try refreshing
        await this.refreshAccessToken(userId);
        return this.makeAuthenticatedRequest(endpoint, method, data, userId);
      }
      
      // For 400 errors, we should check if this is due to invalid parameters
      if (axiosError?.response?.status === 400) {
        const errorData = axiosError.response.data;
        console.error('[XApiAuth] 400 Bad Request error:', errorData);
        
        // If using v1.1 API and getting errors, try using app-only auth instead
        if (isV1Endpoint && userId) {
          console.log('[XApiAuth] Attempting to retry with app-only auth');
          return this.makeAuthenticatedRequest(endpoint, method, data, null);
        }
      }
      
      return this.handleAuthError(error);
    }
  }

  // Error handling
  async handleAuthError(error: unknown): Promise<never> {
    // Properly type-guard the error object for Axios errors
    const axiosError = error as any;
    
    if (axiosError && axiosError.response) {
      // Extract the X API error details if available
      const errorData = axiosError.response.data;
      const errors = errorData?.errors || [];
      
      if (axiosError.response.status === 401) {
        // Check for specific token-related errors
        const tokenError = errors.find((e: any) => 
          e.code === 32 || // Could not authenticate you
          e.code === 89 || // Invalid or expired token
          e.code === 99    // Unable to verify your credentials
        );
        
        if (tokenError) {
          throw new AuthError('Authentication token is invalid or expired', 'INVALID_TOKEN', errorData);
        }
        
        throw new AuthError('Authentication failed', 'AUTH_FAILED', errorData);
      }
      
      if (axiosError.response.status === 429) {
        throw new AuthError('Rate limit exceeded', 'RATE_LIMIT', errorData);
      }
      
      // Handle other known API errors
      if (errors.length > 0) {
        const firstError = errors[0];
        throw new AuthError(
          firstError.message || 'API error occurred', 
          `X_API_ERROR_${firstError.code || 'UNKNOWN'}`,
          errorData
        );
      }
      
      // Generic API error with status code
      throw new AuthError(
        `API error (${axiosError.response.status})`, 
        'API_ERROR',
        errorData
      );
    }
    
    // If it's a standard error, rethrow it
    if (error instanceof Error) {
      throw new AuthError(error.message, 'API_ERROR');
    }
    
    // For unknown errors
    throw new AuthError('Unknown error occurred', 'UNKNOWN_ERROR');
  }
}

// Create singleton instance
const xApiAuth = new XApiAuth();
export default xApiAuth; 