import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  FMPIncomeStatementResponse,
  FMPBalanceSheetResponse,
  FMPCashFlowResponse,
} from '../types/financials';
import { ServiceUnavailableError, InternalServerError, NotFoundError } from '../utils/httpErrors';

/**
 * FMP API Client
 * Handles all HTTP requests to the Financial Modeling Prep API
 */
export class FMPClient {
  private client: AxiosInstance;
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.FMP_API_KEY || '';
    const baseURL = process.env.FMP_BASE_URL || 'https://financialmodelingprep.com/stable';
    
    console.log(`[FMP Client] Initializing with API key: ${this.apiKey ? this.apiKey.substring(0, 8) + '...' : 'NOT SET'}`);
    console.log(`[FMP Client] Base URL: ${baseURL}`);
    
    if (!this.apiKey) {
      console.warn('⚠️  FMP_API_KEY not found in environment variables. API calls will fail.');
    }

    this.client = axios.create({
      baseURL,
      timeout: 15000, // 15 second timeout
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to log requests in development
    this.client.interceptors.request.use((config) => {
      console.log(`[FMP Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
      console.log(`[FMP Params]`, config.params);
      return config;
    });

    // Add response interceptor to log responses
    this.client.interceptors.response.use(
      (response) => {
        console.log(`[FMP Success] Status: ${response.status}, Data count: ${Array.isArray(response.data) ? response.data.length : 'N/A'}`);
        return response;
      },
      (error) => {
        // Error logging handled in handleFMPError
        return Promise.reject(error);
      }
    );
  }

  /**
   * Fetch income statements from FMP API
   * Endpoint: https://financialmodelingprep.com/stable/income-statement
   * @param ticker - Stock ticker symbol
   * @param limit - Number of annual periods to fetch (max 1000)
   * @param period - Period type: 'annual', 'quarter', or specific quarters (Q1, Q2, Q3, Q4, FY)
   */
  async getIncomeStatements(ticker: string, limit: number = 1, period: string = 'annual'): Promise<FMPIncomeStatementResponse[]> {
    try {
      const response = await this.client.get('/income-statement', {
        params: {
          symbol: ticker.toUpperCase(),
          limit,
          period,
          apikey: this.apiKey,
        },
      });

      // Validate response
      if (!response.data || !Array.isArray(response.data)) {
        throw new InternalServerError('Invalid response format from FMP API for income statement');
      }

      return response.data;
    } catch (error) {
      this.handleFMPError(error, 'income statement', ticker);
      throw error; // TypeScript requirement, won't reach here
    }
  }

  /**
   * Fetch balance sheets from FMP API
   * Endpoint: https://financialmodelingprep.com/stable/balance-sheet-statement
   * @param ticker - Stock ticker symbol
   * @param limit - Number of annual periods to fetch (max 1000)
   * @param period - Period type: 'annual', 'quarter', or specific quarters (Q1, Q2, Q3, Q4, FY)
   */
  async getBalanceSheets(ticker: string, limit: number = 1, period: string = 'annual'): Promise<FMPBalanceSheetResponse[]> {
    try {
      const response = await this.client.get('/balance-sheet-statement', {
        params: {
          symbol: ticker.toUpperCase(),
          limit,
          period,
          apikey: this.apiKey,
        },
      });

      // Validate response
      if (!response.data || !Array.isArray(response.data)) {
        throw new InternalServerError('Invalid response format from FMP API for balance sheet');
      }

      return response.data;
    } catch (error) {
      this.handleFMPError(error, 'balance sheet', ticker);
      throw error; // TypeScript requirement, won't reach here
    }
  }

  /**
   * Fetch cash flow statements from FMP API
   * Endpoint: https://financialmodelingprep.com/stable/cash-flow-statement
   * @param ticker - Stock ticker symbol
   * @param limit - Number of annual periods to fetch (max 1000)
   * @param period - Period type: 'annual', 'quarter', or specific quarters (Q1, Q2, Q3, Q4, FY)
   */
  async getCashFlows(ticker: string, limit: number = 1, period: string = 'annual'): Promise<FMPCashFlowResponse[]> {
    try {
      const response = await this.client.get('/cash-flow-statement', {
        params: {
          symbol: ticker.toUpperCase(),
          limit,
          period,
          apikey: this.apiKey,
        },
      });

      // Validate response
      if (!response.data || !Array.isArray(response.data)) {
        throw new InternalServerError('Invalid response format from FMP API for cash flow');
      }

      return response.data;
    } catch (error) {
      this.handleFMPError(error, 'cash flow statement', ticker);
      throw error; // TypeScript requirement, won't reach here
    }
  }

  /**
   * Centralized error handling for FMP API calls
   */
  private handleFMPError(error: unknown, statementType: string, ticker: string): never {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      // Log detailed error information
      console.error(`[FMP Error] ${statementType} for ${ticker}:`, {
        code: axiosError.code,
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        data: axiosError.response?.data,
        message: axiosError.message,
      });

      // Timeout errors
      if (axiosError.code === 'ECONNABORTED') {
        throw new ServiceUnavailableError(
          `Request timeout while fetching ${statementType} for ${ticker}`
        );
      }

      // Network errors
      if (axiosError.code === 'ECONNREFUSED' || axiosError.code === 'ENOTFOUND') {
        throw new ServiceUnavailableError(
          `Unable to connect to FMP API. Please check your network connection.`
        );
      }

      // HTTP error responses
      if (axiosError.response) {
        const status = axiosError.response.status;
        const errorData = axiosError.response.data as any;

        // 401 Unauthorized - Invalid API key
        if (status === 401) {
          throw new ServiceUnavailableError(
            'Invalid or missing FMP API key. Please check your FMP_API_KEY environment variable.'
          );
        }

        // 403 Forbidden - Rate limit or insufficient permissions
        if (status === 403) {
          throw new ServiceUnavailableError(
            'FMP API access forbidden. You may have exceeded your rate limit or lack access to this endpoint.'
          );
        }

        // 404 Not Found - Invalid ticker
        if (status === 404) {
          throw new NotFoundError(
            `Ticker "${ticker}" not found. Please verify the ticker symbol is correct.`
          );
        }

        // 429 Too Many Requests - Rate limiting
        if (status === 429) {
          throw new ServiceUnavailableError(
            'FMP API rate limit exceeded. Please try again later.'
          );
        }

        // 500+ Server errors
        if (status >= 500) {
          throw new ServiceUnavailableError(
            `FMP API server error (${status}). Please try again later.`
          );
        }

        // Other HTTP errors
        throw new ServiceUnavailableError(
          `FMP API error (${status}): ${errorData?.message || axiosError.message}`
        );
      }

      // Generic Axios error
      throw new ServiceUnavailableError(
        `Failed to fetch ${statementType}: ${axiosError.message}`
      );
    }

    // Non-Axios errors (shouldn't happen, but handle gracefully)
    if (error instanceof Error) {
      throw new InternalServerError(`Unexpected error fetching ${statementType}: ${error.message}`);
    }

    // Unknown error type
    throw new InternalServerError(`Unknown error occurred while fetching ${statementType}`);
  }

}

// Export a singleton instance
export const fmpClient = new FMPClient();
