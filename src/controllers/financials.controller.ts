import { Request, Response } from 'express';
import { financialsService } from '../services/financials.service';
import { BadRequestError } from '../utils/httpErrors';

/**
 * Controller for financial data endpoints
 * Handles HTTP requests and delegates to the service layer
 */
export class FinancialsController {
  /**
   * GET /financials
   * Fetch financial statement data for a ticker
   * Query parameters:
   *   - ticker: Stock ticker symbol (required)
   *   - limit: Number of periods to fetch (optional, default: 1, max: 1000)
   *   - period: Period type (optional, default: 'annual', values: 'annual', 'quarter', 'Q1', 'Q2', 'Q3', 'Q4', 'FY')
   */
  async getFinancials(req: Request, res: Response): Promise<void> {
    // Extract query parameters
    const { ticker, limit, period } = req.query;

    // Validate ticker parameter is required
    if (!ticker || typeof ticker !== 'string') {
      throw new BadRequestError('Ticker parameter is required');
    }

    // Parse and validate limit parameter
    let parsedLimit = 1; // Default limit
    if (limit) {
      if (typeof limit !== 'string') {
        throw new BadRequestError('Invalid limit parameter type');
      }

      parsedLimit = parseInt(limit, 10);

      // Validate limit is a positive integer
      if (isNaN(parsedLimit) || parsedLimit < 1) {
        throw new BadRequestError('Limit must be a positive integer');
      }

      if (parsedLimit > 1000) {
        throw new BadRequestError('Limit cannot exceed 1000');
      }
    }

    // Validate period parameter
    let periodValue = 'annual'; // Default period
    if (period) {
      if (typeof period !== 'string') {
        throw new BadRequestError('Invalid period parameter type');
      }
      periodValue = period;
    }

    // Fetch financial data from service
    const financialData = await financialsService.fetchFinancialsForTicker(ticker, parsedLimit, periodValue);

    // Send success response
    res.status(200).json({
      success: true,
      data: financialData,
    });
  }
}

// Export singleton instance
export const financialsController = new FinancialsController();
