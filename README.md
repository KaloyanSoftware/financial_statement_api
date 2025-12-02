# Financial Statement API

A TypeScript Express.js API for fetching normalized financial statement data from the Financial Modeling Prep (FMP) API.

## Features

- ✅ **Clean Architecture** - Modular structure with clear separation of concerns
- ✅ **TypeScript** - Full type safety with strict mode enabled
- ✅ **Normalized Data** - All fields returned in snake_case format
- ✅ **Error Handling** - Comprehensive error handling for all edge cases
- ✅ **Mock Data Support** - Works without API key using mock data
- ✅ **CORS Enabled** - Ready for cross-origin requests
- ✅ **Field Validation** - Validates all required fields from API responses

## API Endpoints

### GET /financials

Fetch financial statement data for a given ticker.

**Query Parameters:**
- `ticker` (required): Stock ticker symbol (e.g., `AAPL`, `MSFT`)
- `limit` (optional): Number of periods to fetch (default: `1`, max: `1000`)
- `period` (optional): Period type (default: `annual`)
  - `annual` - Annual financial statements
  - `quarter` - All quarterly statements
  - `Q1`, `Q2`, `Q3`, `Q4` - Specific quarter
  - `FY` - Fiscal year

**Example Requests:**
```bash
# Get 1 annual period (default)
GET http://localhost:3000/financials?ticker=AAPL

# Get 5 annual periods
GET http://localhost:3000/financials?ticker=AAPL&limit=5&period=annual

# Get last 4 quarters
GET http://localhost:3000/financials?ticker=AAPL&limit=4&period=quarter
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "ticker": "AAPL",
    "count": 1,
    "data": [
      {
        "fiscal_year": 2023,
        "fiscal_period": "2023-09-30",
        "income_statement": {
          "revenue": 383285000000,
          "gross_profit": 169148000000,
          "operating_income": 114301000000,
          "net_income": 96995000000,
          "eps": 6.16
        },
        "balance_sheet": {
          "cash_and_cash_equivalents": 29965000000,
          "short_term_investments": 31590000000,
          "total_assets": 352755000000,
          "total_liabilities": 290437000000,
          "total_shareholder_equity": 62146000000,
          "long_term_debt": 106063000000
        },
        "cash_flow": {
          "operating_cash_flow": 110543000000,
          "capital_expenditure": -10959000000,
          "free_cash_flow": 99584000000
        }
      }
    ]
  }
}
```

### GET /health

Health check endpoint.

**Example Response:**
```json
{
  "success": true,
  "message": "Financial Statement API is running",
  "timestamp": "2025-12-02T10:30:00.000Z"
}
```

## Installation

1. **Clone the repository**
```bash
cd c:\Users\kkiva\API\financial_statement_api
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory:
```env
PORT=3000
FMP_API_KEY=your_api_key_here
FMP_BASE_URL=https://financialmodelingprep.com/stable
```

**Important Notes:**
- The FMP API base URL is `https://financialmodelingprep.com/stable` (not `/api/v3`)
- API key is passed as a query parameter: `?apikey=YOUR_KEY`
- To get an FMP API key, visit: https://financialmodelingprep.com/developer/docs
- The API requires a valid FMP API key to function

4. **Start the development server**
```bash
npm run dev
```

The server will start on `http://localhost:3000`

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run production build
- `npm run clean` - Remove dist directory

## 📁 Project Structure

```
src/
├── app.ts                         # Express app configuration (loads .env first!)
├── server.ts                      # Server entry point
├── clients/
│   └── fmp.client.ts             # FMP API client with real HTTP calls
├── controllers/
│   └── financials.controller.ts  # Request handlers & validation
├── routes/
│   └── financials.routes.ts      # Route definitions
├── services/
│   └── financials.service.ts     # Business logic, data fetching & normalization
├── types/
│   └── financials.ts             # TypeScript interfaces
└── utils/
    ├── errorHandler.ts           # Centralized error middleware
    └── httpErrors.ts             # Custom error classes
```

## Error Handling

The API handles various error scenarios:

- **Invalid ticker format**: Returns 400 Bad Request
- **Missing ticker parameter**: Returns 400 Bad Request
- **No data found for ticker**: Returns 404 Not Found
- **FMP API timeout**: Returns 503 Service Unavailable
- **FMP API rate limit**: Returns 503 Service Unavailable
- **Missing required fields**: Returns 404 Not Found
- **Invalid JSON response**: Returns 500 Internal Server Error

## Data Normalization

All field names are normalized to **snake_case** format:

- `grossProfit` → `gross_profit`
- `operatingIncome` → `operating_income`
- `totalAssets` → `total_assets`
- `cashAndCashEquivalents` → `cash_and_cash_equivalents`

## Free Cash Flow Calculation

Free cash flow is automatically calculated as:
```
free_cash_flow = operating_cash_flow + capital_expenditure
```

Note: `capital_expenditure` is typically negative, so this effectively subtracts it from operating cash flow.

## Technologies

- **Node.js** - Runtime environment
- **TypeScript** - Type safety
- **Express.js** - Web framework
- **Axios** - HTTP client
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## License

ISC
