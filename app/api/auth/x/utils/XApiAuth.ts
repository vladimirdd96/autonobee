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
  accessToken: string;
  accessTokenSecret: string;

  constructor() {
    // Initialize API credentials from environment variables
    this.apiKey = process.env.NEXT_PUBLIC_API_KEY || '';
    this.apiKeySecret = process.env.NEXT_PUBLIC_API_SECRET || '';
    this.bearerToken = process.env.NEXT_PUBLIC_BEARER_TOKEN || '';
    this.clientId = process.env.NEXT_PUBLIC_X_CLIENT_ID || '';
    this.clientSecret = process.env.NEXT_PUBLIC_X_CLIENT_SECRET || '';
    
    // Add OAuth 1.0a access tokens
    this.accessToken = process.env.NEXT_PUBLIC_ACCESS_TOKEN || '';
    this.accessTokenSecret = process.env.NEXT_PUBLIC_ACCESS_TOKEN_SECRET || '';
    
    // Use ngrok URL if available, otherwise use the app URL
    const baseUrl = process.env.NEXT_PUBLIC_NGROK_STATIC_DOMAIN 
      ? `https://${process.env.NEXT_PUBLIC_NGROK_STATIC_DOMAIN}` 
      : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    // Make sure the callback URL uses HTTPS, which X requires
    this.callbackUrl = baseUrl.startsWith('http:')
      ? `https://${new URL(baseUrl).host}/api/auth/x/callback`
      : `${baseUrl}/api/auth/x/callback`;
    
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
    // Always use OAuth 2.0 client credentials for user authorization
    if (!this.clientId) {
      throw new AuthError('OAuth 2.0 client credentials not configured', 'NO_CLIENT_CREDENTIALS');
    }

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

  // Add utility method to create OAuth 1.0a signature
  createOAuth1Signature(method: string, url: string, params: Record<string, string> = {}): Record<string, string> {
    // Create an OAuth 1.0a signature
    // This is a simplified implementation; in production, use a library like oauth-1.0a
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const nonce = crypto.randomBytes(16).toString('hex');
    
    // Base oauth parameters
    const oauthParams: Record<string, string> = {
      oauth_consumer_key: this.apiKey,
      oauth_nonce: nonce,
      oauth_signature_method: 'HMAC-SHA1',
      oauth_timestamp: timestamp,
      oauth_token: this.accessToken,
      oauth_version: '1.0'
    };
    
    // Combine all parameters for the signature
    const allParams = { ...oauthParams, ...params };
    
    // Create the parameter string
    const paramString = Object.keys(allParams)
      .sort()
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(allParams[key])}`)
      .join('&');
    
    // Create the signature base string
    const signatureBaseString = [
      method.toUpperCase(),
      encodeURIComponent(url),
      encodeURIComponent(paramString)
    ].join('&');
    
    // Create the signing key
    const signingKey = `${encodeURIComponent(this.apiKeySecret)}&${encodeURIComponent(this.accessTokenSecret)}`;
    
    // Generate the signature
    const signature = crypto
      .createHmac('sha1', signingKey)
      .update(signatureBaseString)
      .digest('base64');
    
    return {
      ...oauthParams,
      oauth_signature: signature
    };
  }

  // Create OAuth 1.0a authorization header
  createOAuth1Header(method: string, url: string, params: Record<string, string> = {}): string {
    const oauthParams = this.createOAuth1Signature(method, url, params);
    
    // Format as Authorization header
    return 'OAuth ' + Object.keys(oauthParams)
      .filter(k => k.startsWith('oauth_'))
      .map(k => `${encodeURIComponent(k)}="${encodeURIComponent(oauthParams[k])}"`)
      .join(', ');
  }

  // Make an authenticated request specifically using OAuth 1.0a
  async makeOAuth1Request(endpoint: string, method = 'GET', data = null): Promise<any> {
    // Determine which API version to use
    const isV1Endpoint = endpoint.startsWith('trends/') || endpoint.startsWith('geo/') || endpoint.includes('trends');
    const apiVersion = isV1Endpoint ? '1.1' : '2';
    const apiUrl = `https://api.twitter.com/${apiVersion}/${endpoint}`;
    
    // Convert data to Record<string, string> if needed
    const paramsForSignature: Record<string, string> = {};
    if (data && typeof data === 'object') {
      Object.entries(data).forEach(([key, value]) => {
        paramsForSignature[key] = String(value);
      });
    }
    
    const headers: any = {
      Authorization: this.createOAuth1Header(method, apiUrl, method === 'GET' ? paramsForSignature : {})
    };
    
    console.log(`[XApiAuth] Making OAuth 1.0a request to: ${apiUrl}`, { 
      method, 
      hasHeaders: true,
      hasData: !!data 
    });
    
    try {
      const response = await axios({
        method,
        url: apiUrl,
        headers,
        params: method === 'GET' ? paramsForSignature : undefined,
        data: method !== 'GET' ? data : undefined
      });
      
      console.log(`[XApiAuth] OAuth 1.0a request successful, status: ${response.status}`);
      return response.data;
    } catch (error) {
      console.error('[XApiAuth] OAuth 1.0a request failed:', error);
      return this.handleAuthError(error);
    }
  }

  // Make an app-level request using OAuth 1.0a (MrSorkoSorkos account)
  async makeAppLevelRequest(endpoint: string, method = 'GET', data: any = null): Promise<any> {
    // Always use OAuth 1.0a for app-level requests
    return await this.makeOAuth1Request(endpoint, method, data);
  }

  // Make Authenticated Request
  async makeAuthenticatedRequest(endpoint: string, method = 'GET', data: any = null, userId: string | null = null, useOAuth1 = false): Promise<any> {
    // For debugging
    console.log(`[XApiAuth] Making request to: https://api.twitter.com/2/${endpoint} {
  method: '${method}',
  hasHeaders: ${!!userId},
  userId: '${userId || ''}',
  hasData: ${!!data},
  authMethod: '${useOAuth1 ? 'OAuth 1.0a' : (userId ? 'OAuth 2.0 User Context' : 'Bearer Token')}'
}`);
    
    try {
      // If OAuth 1.0a is specified and we have app credentials, use that auth method
      if (useOAuth1 && this.apiKey && this.apiKeySecret && this.accessToken && this.accessTokenSecret) {
        return await this.makeOAuth1Request(endpoint, method, data);
      }
      
      // If userId is provided, use OAuth 2.0 user context authentication
      if (userId) {
        let tokens = await this.getUserTokens(userId);
        
        if (!tokens?.access_token) {
          throw new AuthError(
            'No access token available for user context request', 
            'NO_ACCESS_TOKEN'
          );
        }
        
        // Check if token is expired or close to expiring
        const expiresAt = tokens.created_at + (tokens.expires_in * 1000);
        const now = Date.now();
        
        // If token is expired or within 5 minutes of expiring, refresh it
        if (now > (expiresAt - 300000)) {
          console.log('Token expired or close to expiring, refreshing...');
          try {
            tokens = await this.refreshAccessToken(userId);
          } catch (refreshError) {
            console.error('Error refreshing token:', refreshError);
            throw refreshError;
          }
        }
        
        const baseURL = 'https://api.twitter.com/2/';
        
        // Make the API request
        try {
          const response = await axios({
            method: method,
            url: `${baseURL}${endpoint}`,
            data: data,
            headers: {
              Authorization: `Bearer ${tokens.access_token}`,
              'Content-Type': 'application/json',
            }
          });
          
          // Update rate limit info
          if (response.headers['x-rate-limit-limit']) {
            this.rateLimitManager.updateLimits(endpoint, response.headers);
          }
          
          return response.data;
        } catch (requestError: any) {
          // Handle axios errors with more detail
          if (requestError.response) {
            console.log(`[XApiAuth] Request failed: ${requestError.response.status}`, {
              endpoint,
              errorMessage: requestError.message,
              responseData: requestError.response.data
            });
            
            // Handle specific errors
            if (requestError.response.status === 429) {
              throw new AuthError('Rate limit exceeded', 'RATE_LIMIT', requestError.response.data);
            }
            
            // Handle other API errors
            throw new AuthError(
              `API error (${requestError.response.status})`, 
              'API_ERROR',
              requestError.response.data
            );
          }
          
          // Network or other errors
          throw new AuthError(
            `Request failed: ${requestError.message}`,
            'REQUEST_FAILED'
          );
        }
      }
      
      // Otherwise, use app authentication (bearer token)
      if (!this.bearerToken) {
        throw new AuthError('No bearer token available for app-only authentication', 'NO_BEARER_TOKEN');
      }
      
      try {
        const baseURL = 'https://api.twitter.com/2/';
        const response = await axios({
          method: method,
          url: `${baseURL}${endpoint}`,
          data: data,
          headers: {
            Authorization: `Bearer ${this.bearerToken}`,
            'Content-Type': 'application/json',
          }
        });
        
        if (response.headers['x-rate-limit-limit']) {
          this.rateLimitManager.updateLimits(endpoint, response.headers);
        }
        
        return response.data;
      } catch (appError: any) {
        if (appError.response) {
          console.log(`[XApiAuth] App-only request failed: ${appError.response.status}`, {
            endpoint,
            errorMessage: appError.message,
            responseData: appError.response.data
          });
          
          if (appError.response.status === 429) {
            throw new AuthError('Rate limit exceeded', 'RATE_LIMIT', appError.response.data);
          }
          
          throw new AuthError(
            `API error (${appError.response.status})`, 
            'API_ERROR',
            appError.response.data
          );
        }
        
        throw new AuthError(
          `Request failed: ${appError.message}`,
          'REQUEST_FAILED'
        );
      }
    } catch (error: unknown) {
      // Catch-all for any errors not handled above
      if (error instanceof AuthError) {
        throw error; // Re-throw AuthError instances without modification
      }
      
      // Create a general AuthError for anything else
      throw new AuthError(
        `Request failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'REQUEST_FAILED',
        error instanceof Error && 'response' in error ? (error as any).response?.data : undefined
      );
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