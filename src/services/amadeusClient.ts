import axios, { AxiosError } from 'axios';
import type { AxiosInstance } from 'axios';

// Custom error type for Amadeus API errors
export interface AmadeusError {
  status: number;
  message: string;
  code?: string;
}

// Token cache interface
interface TokenCache {
  accessToken: string;
  expiresAt: number; // timestamp when token expires
}

class AmadeusClient {
  private axiosInstance: AxiosInstance;
  private tokenCache: TokenCache | null = null;
  private tokenRefreshPromise: Promise<string> | null = null;

  constructor() {
    const baseURL = import.meta.env.VITE_AMADEUS_BASE_URL;

    if (!baseURL) {
      throw new Error('VITE_AMADEUS_BASE_URL is not defined in environment variables');
    }

    this.axiosInstance = axios.create({
      baseURL,
      timeout: 30000,
    });

    this.setupInterceptors();
  }

  /**
   * Setup request/response interceptors for logging in development
   */
  private setupInterceptors() {
    // Request interceptor - log in development only
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (import.meta.env.DEV) {
          console.log(`[Amadeus API] ${config.method?.toUpperCase()} ${config.url}`, config.params);
        }
        return config;
      },
      (error) => {
        if (import.meta.env.DEV) {
          console.error('[Amadeus API] Request error:', error);
        }
        return Promise.reject(error);
      }
    );

    // Response interceptor - log in development only
    this.axiosInstance.interceptors.response.use(
      (response) => {
        if (import.meta.env.DEV) {
          console.log(`[Amadeus API] Response from ${response.config.url}:`, response.status);
        }
        return response;
      },
      (error) => {
        if (import.meta.env.DEV) {
          console.error('[Amadeus API] Response error:', error.response?.status, error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Get access token, using cache if available and not expired
   */
  private async getAccessToken(): Promise<string> {
    // If token exists and is not expired (with 60s buffer), return cached token
    if (this.tokenCache && this.tokenCache.expiresAt > Date.now() + 60000) {
      return this.tokenCache.accessToken;
    }

    // If a token refresh is already in progress, wait for it
    if (this.tokenRefreshPromise) {
      return this.tokenRefreshPromise;
    }

    // Start token refresh
    this.tokenRefreshPromise = this.refreshAccessToken();
    try {
      const token = await this.tokenRefreshPromise;
      return token;
    } finally {
      this.tokenRefreshPromise = null;
    }
  }

  /**
   * Refresh access token from Amadeus OAuth2 endpoint
   */
  private async refreshAccessToken(): Promise<string> {
    const apiKey = import.meta.env.VITE_AMADEUS_API_KEY;
    const apiSecret = import.meta.env.VITE_AMADEUS_API_SECRET;

    if (!apiKey || !apiSecret) {
      throw new Error('Amadeus API credentials are not defined in environment variables');
    }

    try {
      const response = await this.axiosInstance.post<{
        access_token: string;
        token_type: string;
        expires_in: number;
      }>(
        '/v1/security/oauth2/token',
        new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: apiKey,
          client_secret: apiSecret,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const { access_token, expires_in } = response.data;

      // Cache token with expiration time
      this.tokenCache = {
        accessToken: access_token,
        expiresAt: Date.now() + expires_in * 1000,
      };

      if (import.meta.env.DEV) {
        console.log('[Amadeus API] Access token obtained, expires in:', expires_in, 'seconds');
      }

      return access_token;
    } catch (error) {
      const amadeusError = this.handleError(error);
      throw amadeusError;
    }
  }

  /**
   * Handle errors and convert to AmadeusError format
   */
  private handleError(error: unknown): AmadeusError {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ error_description?: string; error?: string }>;
      const status = axiosError.response?.status || 500;
      const message =
        axiosError.response?.data?.error_description ||
        axiosError.response?.data?.error ||
        axiosError.message ||
        'An error occurred while communicating with Amadeus API';

      return {
        status,
        message,
        code: axiosError.code,
      };
    }

    if (error instanceof Error) {
      return {
        status: 500,
        message: error.message,
      };
    }

    return {
      status: 500,
      message: 'An unknown error occurred',
    };
  }

  /**
   * Make an authenticated GET request to Amadeus API
   */
  public async get<T>(endpoint: string, params?: Record<string, unknown>): Promise<T> {
    let retryCount = 0;
    const maxRetries = 1;

    while (retryCount <= maxRetries) {
      try {
        // Get access token (cached or refreshed)
        const accessToken = await this.getAccessToken();

        // Make authenticated request
        const response = await this.axiosInstance.get<T>(endpoint, {
          params,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;

          // Handle 401 Unauthorized - token might be invalid, refresh and retry once
          if (axiosError.response?.status === 401 && retryCount < maxRetries) {
            if (import.meta.env.DEV) {
              console.log('[Amadeus API] 401 error, refreshing token and retrying...');
            }
            // Clear token cache to force refresh
            this.tokenCache = null;
            retryCount++;
            continue;
          }

          // Handle 429 Rate Limiting - wait and retry once
          if (axiosError.response?.status === 429 && retryCount < maxRetries) {
            const retryAfter = axiosError.response.headers['retry-after'];
            const delay = retryAfter ? parseInt(retryAfter) * 1000 : 2000;

            if (import.meta.env.DEV) {
              console.log(`[Amadeus API] Rate limited, retrying after ${delay}ms...`);
            }

            await new Promise((resolve) => setTimeout(resolve, delay));
            retryCount++;
            continue;
          }
        }

        // If we get here, throw the error
        throw this.handleError(error);
      }
    }

    // This should never be reached, but TypeScript needs it
    throw this.handleError(new Error('Max retries exceeded'));
  }

  /**
   * Clear token cache (useful for testing or manual refresh)
   */
  public clearTokenCache(): void {
    this.tokenCache = null;
  }
}

// Export singleton instance
export const amadeusClient = new AmadeusClient();

// Export the get method as a convenient wrapper
export const amadeusGet = <T>(endpoint: string, params?: Record<string, unknown>): Promise<T> => {
  return amadeusClient.get<T>(endpoint, params);
};
