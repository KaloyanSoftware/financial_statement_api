import { fmpClient } from '../clients/fmp.client';
import { FinancialData, FinancialPeriod } from '../types/financials';
import { BadRequestError, NotFoundError, ServiceUnavailableError, InternalServerError } from '../utils/httpErrors';

/**
 * Service class for financial data operations
 * Fetches and normalizes financial statement data from FMP API
 */
export class FinancialsService {
  /**
   * Fetch comprehensive financial data for a given ticker
   * @param ticker - Stock ticker symbol (e.g., 'AAPL')
   * @param limit - Number of periods to fetch (default: 1, max: 1000 per FMP API)
   * @param period - Period type: 'annual', 'quarter', or specific quarters (Q1, Q2, Q3, Q4, FY)
   * @returns Normalized financial data with snake_case field names
   * @throws BadRequestError if ticker is invalid or limit is out of range
   * @throws NotFoundError if no financial data is found for the ticker
   */
  async fetchFinancialsForTicker(ticker: string, limit: number = 1, period: string = 'annual'): Promise<FinancialData> {
    // Validate ticker
    if (!ticker || typeof ticker !== 'string' || ticker.trim().length === 0) {
      throw new BadRequestError('Ticker symbol is required and must be a non-empty string');
    }

    // Normalize ticker to uppercase
    const normalizedTicker = ticker.trim().toUpperCase();

    // Validate ticker format (basic check for alphanumeric characters)
    if (!/^[A-Z0-9.\-]+$/.test(normalizedTicker)) {
      throw new BadRequestError('Invalid ticker format. Ticker must contain only letters, numbers, dots, and hyphens');
    }

    // Validate limit (FMP API max is 1000)
    if (!Number.isInteger(limit) || limit < 1 || limit > 1000) {
      throw new BadRequestError('Limit must be an integer between 1 and 1000');
    }

    // Validate period parameter
    const validPeriods = ['annual', 'quarter', 'Q1', 'Q2', 'Q3', 'Q4', 'FY'];
    if (!validPeriods.includes(period)) {
      throw new BadRequestError(`Invalid period. Must be one of: ${validPeriods.join(', ')}`);
    }

    try {
      // Fetch all financial statements in parallel using Promise.all
      const [incomeStatements, balanceSheets, cashFlows] = await Promise.all([
        fmpClient.getIncomeStatements(normalizedTicker, limit, period),
        fmpClient.getBalanceSheets(normalizedTicker, limit, period),
        fmpClient.getCashFlows(normalizedTicker, limit, period),
      ]);

      // Check if ALL responses are empty
      if (
        (!incomeStatements || incomeStatements.length === 0) &&
        (!balanceSheets || balanceSheets.length === 0) &&
        (!cashFlows || cashFlows.length === 0)
      ) {
        throw new NotFoundError(`No financial statements found for ticker: ${normalizedTicker}`);
      }

      // Determine how many periods we actually have
      const actualLimit = Math.min(
        incomeStatements?.length || 0,
        balanceSheets?.length || 0,
        cashFlows?.length || 0
      );

      if (actualLimit === 0) {
        throw new NotFoundError(`No complete financial data found for ticker: ${normalizedTicker}`);
      }

      // Build array of financial periods
      const periods: FinancialPeriod[] = [];

      for (let i = 0; i < actualLimit; i++) {
        const incomeStatement = incomeStatements?.[i];
        const balanceSheet = balanceSheets?.[i];
        const cashFlow = cashFlows?.[i];

        // Skip if any of the three statements are missing for this period
        if (!incomeStatement || !balanceSheet || !cashFlow) {
          console.warn(`Skipping period ${i} for ${normalizedTicker} - incomplete data`);
          continue;
        }

        // Extract fiscal year and period
        const fiscalYear = parseInt(incomeStatement.calendarYear || incomeStatement.date.split('-')[0], 10);
        const fiscalPeriod = incomeStatement.date; // e.g., "2023-09-30"

        // Normalize and construct clean period data with snake_case fields
        const period: FinancialPeriod = {
          fiscal_year: fiscalYear,
          fiscal_period: fiscalPeriod,
          income_statement: {
            revenue: incomeStatement.revenue ?? null,
            gross_profit: incomeStatement.grossProfit ?? null,
            operating_income: incomeStatement.operatingIncome ?? null,
            net_income: incomeStatement.netIncome ?? null,
            eps: incomeStatement.eps ?? null,
          },
          balance_sheet: {
            cash_and_cash_equivalents: balanceSheet.cashAndCashEquivalents ?? null,
            short_term_investments: balanceSheet.shortTermInvestments ?? null,
            total_assets: balanceSheet.totalAssets ?? null,
            total_liabilities: balanceSheet.totalLiabilities ?? null,
            total_shareholder_equity: balanceSheet.totalStockholdersEquity ?? null,
            long_term_debt: balanceSheet.longTermDebt ?? null,
          },
          cash_flow: {
            operating_cash_flow: cashFlow.operatingCashFlow ?? null,
            capital_expenditure: cashFlow.capitalExpenditure ?? null,
            // Calculate free cash flow: operating cash flow + capital expenditure
            // Note: capitalExpenditure is typically negative, so this effectively subtracts
            free_cash_flow: 
              (cashFlow.operatingCashFlow !== null && cashFlow.capitalExpenditure !== null)
                ? (cashFlow.operatingCashFlow + cashFlow.capitalExpenditure)
                : null,
          },
        };

        periods.push(period);
      }

      // If we didn't build any valid periods, throw error
      if (periods.length === 0) {
        throw new NotFoundError(`No complete financial data found for ticker: ${normalizedTicker}`);
      }

      // Construct final response
      const financialData: FinancialData = {
        ticker: normalizedTicker,
        count: periods.length,
        data: periods,
      };

      return financialData;
    } catch (error) {
      // Re-throw known errors without modification
      if (
        error instanceof BadRequestError || 
        error instanceof NotFoundError || 
        error instanceof ServiceUnavailableError ||
        error instanceof InternalServerError
      ) {
        throw error;
      }

      // Handle unexpected errors
      console.error('Unexpected error in FinancialsService:', error);
      throw new InternalServerError(`Unexpected error while fetching financial data for ticker: ${normalizedTicker}`);
    }
  }
}

// Export singleton instance
export const financialsService = new FinancialsService();
