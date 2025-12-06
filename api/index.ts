// Load environment variables FIRST before any other imports
import dotenv from 'dotenv';
dotenv.config();

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import financialsRoutes from '../routes/financials.routes';
import { errorHandler, notFoundHandler } from './utils/errorHandler';

// Create Express application
const app: Application = express();

// Middleware configuration
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Root endpoint - API info
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Financial Statement API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      financials: '/financials?ticker=AAPL&limit=1&period=annual'
    },
    documentation: 'https://github.com/KaloyanSoftware/financial_statement_api'
  });
});

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Financial Statement API is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/financials', financialsRoutes);

// 404 Handler - must be after all routes
app.use(notFoundHandler);

// Error Handler - must be last
app.use(errorHandler);

// Export for Vercel serverless
export default app;
