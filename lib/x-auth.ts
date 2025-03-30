import axios from 'axios';
import crypto from 'crypto';

/**
 * X.com OAuth Authentication Client
 * Handles OAuth 2.0 flow for X.com integration
 */
export class XAuthClient {
  private apiKey: string;
  private apiKeySecret: string;
  private bearerToken: string;
  private clientId: string;
  private clientSecret: string;
  private callbackUrl: string;
  private userTokens: Map<string, any>;

  constructor() {
    // Initialize with environment variables or default values
    this.apiKey = process.env.X_API_KEY || '';
    this.apiKeySecret = process.env.X_API_SECRET || '';
    this.bearerToken = process.env.X_BEARER_TOKEN || '';
    this.clientId = process.env.X_CLIENT_ID || '';
    this.clientSecret = process.env.X_CLIENT_SECRET || '';
    this.callbackUrl = process.env.X_CALLBACK_URL || '/api/x/callback';
    
    // Store tokens in memory (in production, use a database)
    this.userTokens = new Map();
  }

  /**
   * Generate a random string for PKCE code verifier
   */
  generateRandomString(length = 64): string {
    return crypto.randomBytes(length)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
      .slice(0, length);
  }

  /**
   * Generate code challenge from code verifier for PKCE
   */
  async generateCodeChallenge(codeVerifier: string): Promise<string> {
    const hash = crypto.createHash('sha256')
      .update(codeVerifier)
      .digest('base64');
    
    return hash
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  /**
   * Generate authorization URL for OAuth 2.0 flow
   */
  async generateAuthUrl(state: string, forceLogin = false): Promise<{ url: string; codeVerifier: string }> {
    const codeVerifier = this.generateRandomString();
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);
    
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.callbackUrl,
      scope: 'tweet.read tweet.write users.read offline.access',
      state: state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256'
    });
    
    // Add force_login parameter if requested
    if (forceLogin) {
      params.append('force_login', 'true');
    }
    
    return {
      url: `https://twitter.com/i/oauth2/authorize?${params.toString()}`,
      codeVerifier
    };
  }

  /**
   * Exchange authorization code for access token
   */
  async getAccessToken(code: string, codeVerifier: string): Promise<any> {
    try {
      const params = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: this.callbackUrl,
        code_verifier: codeVerifier,
        client_id: this.clientId
      });
      
      const response = await axios.post('https://api.twitter.com/2/oauth2/token', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        auth: {
          username: this.clientId,
          password: this.clientSecret
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error getting access token:', error);
      throw error;
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(refreshToken: string): Promise<any> {
    try {
      const params = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: this.clientId
      });
      
      const response = await axios.post('https://api.twitter.com/2/oauth2/token', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        auth: {
          username: this.clientId,
          password: this.clientSecret
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  }

  /**
   * Store user tokens in memory (in production, use a database)
   */
  storeUserTokens(userId: string, tokens: any): void {
    this.userTokens.set(userId, {
      ...tokens,
      expires_at: Date.now() + (tokens.expires_in * 1000)
    });
  }

  /**
   * Get user tokens from memory (in production, use a database)
   */
  getUserTokens(userId: string): any {
    return this.userTokens.get(userId);
  }

  /**
   * Make an authenticated request to the X.com API using app-only authentication
   */
  async makeRequest(endpoint: string, method = 'GET', data = null): Promise<any> {
    try {
      const url = endpoint.startsWith('http') 
        ? endpoint 
        : `https://api.twitter.com/${endpoint.startsWith('2/') ? '' : '1.1/'}${endpoint}`;
      
      const response = await axios({
        method,
        url,
        data,
        headers: {
          'Authorization': `Bearer ${this.bearerToken}`,
          'Content-Type': 'application/json',
        }
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error making request to ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Make an authenticated request to the X.com API using user authentication
   */
  async makeUserRequest(userId: string, endpoint: string, method = 'GET', data = null): Promise<any> {
    try {
      const userTokens = this.getUserTokens(userId);
      
      if (!userTokens) {
        throw new Error(`No tokens found for user ${userId}`);
      }
      
      // Check if token is expired
      if (userTokens.expires_at < Date.now()) {
        // Refresh token
        const newTokens = await this.refreshAccessToken(userTokens.refresh_token);
        this.storeUserTokens(userId, newTokens);
        userTokens.access_token = newTokens.access_token;
      }
      
      const url = endpoint.startsWith('http') 
        ? endpoint 
        : `https://api.twitter.com/${endpoint.startsWith('2/') ? '' : '1.1/'}${endpoint}`;
      
      const response = await axios({
        method,
        url,
        data,
        headers: {
          'Authorization': `Bearer ${userTokens.access_token}`,
          'Content-Type': 'application/json',
        }
      });
      
      return response.data;
    } catch (error) {
      console.error(`Error making authenticated request to ${endpoint}:`, error);
      throw error;
    }
  }
}

// Create a singleton instance for reuse
export const xAuthClient = new XAuthClient(); 