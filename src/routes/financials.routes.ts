import { Router } from 'express';
import { financialsController } from '../controllers/financials.controller';
import { asyncHandler } from '../utils/errorHandler';

// Create router instance
const router = Router();

/**
 * GET /financials
 * Query params:
 *   - ticker (string, required): Stock ticker symbol (e.g., AAPL)
 *   - limit (number, optional): Number of records to return (default: 1)
 * 
 * Example: /financials?ticker=AAPL&limit=1
 */
router.get('/', asyncHandler((req, res) => financialsController.getFinancials(req, res)));

export default router;
