# Financial Statement API

A production-ready TypeScript Express.js API that provides normalized financial statement data for publicly traded companies. Get income statements, balance sheets, and cash flow statements through a simple REST API.

---

## ✨ Features

- 🚀 **Simple REST API** - Single endpoint returns all three financial statements
- 📊 **Comprehensive Data** - Income statement, balance sheet, and cash flow in one request
- 🔄 **Normalized Format** - Clean snake_case field names for easy integration
- ⚡ **Fast & Efficient** - Parallel data fetching for optimal performance
- 🛡️ **Error Handling** - Comprehensive validation and descriptive error messages
- 📈 **Flexible Periods** - Support for annual, quarterly, and specific quarter data
- 🎯 **Type Safe** - Full TypeScript support with strict mode
- 🔌 **CORS Enabled** - Ready for frontend integrations

---

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ installed
- FMP API key (get one free at [Financial Modeling Prep](https://financialmodelingprep.com/developer/docs))

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Set up environment variables**

Create a `.env` file in the root directory:
```env
PORT=3000
FMP_API_KEY=your_api_key_here
FMP_BASE_URL=https://financialmodelingprep.com/stable
```

3. **Start the server**
```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm run build
npm start
```

Server runs at: `http://localhost:3000`

---

## 📡 API Reference

### Get Financial Statements

**Endpoint:** `GET /financials`

Fetches income statement, balance sheet, and cash flow statement data for a given ticker.

#### Query Parameters

| Parameter | Type   | Required | Default  | Description                                                    |
|-----------|--------|----------|----------|----------------------------------------------------------------|
| `ticker`  | string | Yes      | -        | Stock ticker symbol (e.g., 'AAPL', 'MSFT', 'TSLA')            |
| `limit`   | number | No       | 1        | Number of periods to fetch (1-1000)                            |
| `period`  | string | No       | 'annual' | Period type: 'annual', 'quarter', 'Q1', 'Q2', 'Q3', 'Q4', 'FY' |

#### Example Requests

```bash
# Get latest annual financial statements
curl "http://localhost:3000/financials?ticker=AAPL"

# Get last 5 annual periods
curl "http://localhost:3000/financials?ticker=AAPL&limit=5"

# Get last 4 quarters
curl "http://localhost:3000/financials?ticker=AAPL&limit=4&period=quarter"

# Get Q1 data only
curl "http://localhost:3000/financials?ticker=MSFT&period=Q1"
```

#### Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "data": {
    "ticker": "AAPL",
    "count": 1,
    "data": [
      {
        "fiscal_year": 2024,
        "fiscal_period": "2024-09-28",
        "income_statement": {
          "revenue": 391035000000,
          "gross_profit": 180683000000,
          "operating_income": 123216000000,
          "net_income": 93736000000,
          "eps": 6.08
        },
        "balance_sheet": {
          "cash_and_cash_equivalents": 29943000000,
          "short_term_investments": 35228000000,
          "total_assets": 364980000000,
          "total_liabilities": 308030000000,
          "total_shareholder_equity": 56950000000,
          "long_term_debt": 85750000000
        },
        "cash_flow": {
          "operating_cash_flow": 118254000000,
          "capital_expenditure": -9447000000,
          "free_cash_flow": 108807000000
        }
      }
    ]
  }
}
```

#### Response Fields

**Income Statement:**
- `revenue` - Total revenue/sales
- `gross_profit` - Revenue minus cost of goods sold
- `operating_income` - Operating profit (EBIT)
- `net_income` - Bottom line profit after all expenses
- `eps` - Earnings per share

**Balance Sheet:**
- `cash_and_cash_equivalents` - Liquid cash on hand
- `short_term_investments` - Marketable securities
- `total_assets` - All assets owned
- `total_liabilities` - All debts and obligations
- `total_shareholder_equity` - Net worth (assets - liabilities)
- `long_term_debt` - Debt due after one year

**Cash Flow:**
- `operating_cash_flow` - Cash from business operations
- `capital_expenditure` - Investment in fixed assets (negative value)
- `free_cash_flow` - Cash available after CapEx (calculated as: operating_cash_flow + capital_expenditure)

#### Error Responses

**400 Bad Request** - Invalid parameters
```json
{
  "success": false,
  "error": {
    "message": "Ticker parameter is required",
    "statusCode": 400
  }
}
```

**404 Not Found** - Ticker not found or no data available
```json
{
  "success": false,
  "error": {
    "message": "Ticker \"INVALID\" not found. Please verify the ticker symbol is correct.",
    "statusCode": 404
  }
}
```

**503 Service Unavailable** - API rate limit or service issues
```json
{
  "success": false,
  "error": {
    "message": "FMP API rate limit exceeded. Please try again later.",
    "statusCode": 503
  }
}
```

---

### Health Check

**Endpoint:** `GET /health`

Check if the API is running.

**Response:**
```json
{
  "success": true,
  "message": "Financial Statement API is running",
  "timestamp": "2025-12-06T10:30:00.000Z"
}
```

---

## 🧪 Testing

### Using cURL
```bash
# Basic test
curl "http://localhost:3000/financials?ticker=AAPL"

# Multiple periods
curl "http://localhost:3000/financials?ticker=AAPL&limit=5&period=annual"

# Quarterly data
curl "http://localhost:3000/financials?ticker=MSFT&limit=4&period=quarter"
```

### Using REST Client (VS Code)
See `test.http` file in the project root for pre-configured requests.

### Using Postman/Insomnia
- **Method:** GET
- **URL:** `http://localhost:3000/financials`
- **Query Params:** ticker=AAPL, limit=5, period=annual

---

## 🏗️ Architecture

### Project Structure
```
src/
├── app.ts                         # Express app setup & middleware
├── server.ts                      # Server entry point
├── clients/
│   └── fmp.client.ts             # HTTP client for data source
├── controllers/
│   └── financials.controller.ts  # Request handling & validation
├── routes/
│   └── financials.routes.ts      # API route definitions
├── services/
│   └── financials.service.ts     # Business logic & data transformation
├── types/
│   └── financials.ts             # TypeScript type definitions
└── utils/
    ├── errorHandler.ts           # Global error middleware
    └── httpErrors.ts             # Custom error classes
```

### Data Flow
```
Client Request
    ↓
GET /financials?ticker=AAPL&limit=5
    ↓
Controller (validation)
    ↓
Service (business logic)
    ↓
Client (parallel API calls)
    ├─→ Income Statement
    ├─→ Balance Sheet
    └─→ Cash Flow
    ↓
Service (data normalization)
    ↓
Controller (response formatting)
    ↓
JSON Response to Client
```

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

This API is optimized for serverless deployment on Vercel.

#### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/KaloyanSoftware/financial_statement_api)

#### Manual Deployment

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login and Deploy**
   ```bash
   vercel login
   vercel
   ```

3. **Set Environment Variables** in Vercel Dashboard:
   - `FMP_API_KEY` - Your Financial Modeling Prep API key
   - `FMP_BASE_URL` - `https://financialmodelingprep.com/stable`
   - `NODE_ENV` - `production`

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

**📖 Full deployment guide:** See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

---

## 🛠️ Development

### Available Scripts

```bash
# Development with hot reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Run production build
npm start

# Clean build artifacts
npm run clean

# Vercel build (automatic)
npm run vercel-build
```

### Technology Stack

- **Runtime:** Node.js 14+
- **Language:** TypeScript
- **Framework:** Express.js
- **HTTP Client:** Axios
- **Environment:** dotenv
- **CORS:** cors middleware
- **Deployment:** Vercel serverless functions

---

## 📋 Key Features Explained

### Data Normalization
All field names are returned in **snake_case** for consistent formatting:
- API source fields like `grossProfit` → `gross_profit`
- `operatingIncome` → `operating_income`
- `totalStockholdersEquity` → `total_shareholder_equity`

### Free Cash Flow Calculation
Automatically calculated for each period:
```
free_cash_flow = operating_cash_flow + capital_expenditure
```
*Note: capital_expenditure is negative, so this effectively subtracts it*

### Error Handling
Comprehensive error handling for all scenarios:
- ✅ Invalid ticker symbols
- ✅ Missing required parameters
- ✅ Data source rate limits
- ✅ Network timeouts
- ✅ Invalid data responses
- ✅ Missing required fields

### Performance
- Parallel API calls for optimal speed
- 15-second timeout protection
- Efficient data transformation
- Minimal memory footprint

---

## 💡 Usage Examples

### Get Latest Annual Report
```bash
curl "http://localhost:3000/financials?ticker=AAPL"
```
Perfect for current financial snapshot.

### Get 5-Year Historical Data
```bash
curl "http://localhost:3000/financials?ticker=AAPL&limit=5&period=annual"
```
Great for trend analysis and historical comparisons.

### Get Quarterly Performance
```bash
curl "http://localhost:3000/financials?ticker=AAPL&limit=8&period=quarter"
```
Ideal for tracking quarter-over-quarter growth.

### Get Specific Quarter
```bash
curl "http://localhost:3000/financials?ticker=AAPL&period=Q2"
```
Useful for analyzing specific fiscal quarters.

---

## 📊 Data Notes

### Currency
All values are in the reporting currency (typically USD for US companies). Values are numeric without currency symbols.

### Data Freshness
- **Annual data:** Available after 10-K filing (typically within days of fiscal year end)
- **Quarterly data:** Available after 10-Q filing (typically within 45 days of quarter end)

### Rate Limits
API rate limits depend on your data provider subscription:
- Free tier: 250 requests/day
- Each call to `/financials` makes 3 parallel requests to the data source

---

## 🐛 Troubleshooting

### Server won't start
- Verify `.env` file exists with required variables
- Check port 3000 is not already in use
- Ensure Node.js 14+ is installed

### "Ticker not found" error
- Verify ticker symbol is correct
- Check if the company is publicly traded
- Try a well-known ticker like 'AAPL' to test

### Rate limit errors
- Check your API key's rate limit
- Wait before retrying
- Consider upgrading your plan

### Empty data arrays
- Some companies may not have complete financial data
- Try a different period (annual vs quarterly)
- Verify the company files regular financial statements

---

## 📝 License

ISC

---

## 🤝 Contributing

This is a personal project. Feel free to fork and modify for your own use.

---

**Built with ❤️ using TypeScript and Express.js**
