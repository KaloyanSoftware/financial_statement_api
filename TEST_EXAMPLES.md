# API Test Examples

## ✅ Real FMP API Integration Complete!

The API is now integrated with the **real Financial Modeling Prep API** and fetches live financial data.

## Test the API using curl or any HTTP client

### 1. Health Check
```bash
curl http://localhost:3000/health
```

Expected Response:
```json
{
  "success": true,
  "message": "Financial Statement API is running",
  "timestamp": "2025-12-02T22:44:00.000Z"
}
```

### 2. Get Financial Data for AAPL (Single Period)
```bash
curl "http://localhost:3000/financials?ticker=AAPL&limit=1"
```

Expected Response Structure:
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

### 3. Get Multiple Periods (3 Years)
```bash
curl "http://localhost:3000/financials?ticker=AAPL&limit=3"
```

Returns 3 years of historical financial data for Apple.

### 4. Get Financial Data for Other Companies
```bash
# Microsoft
curl "http://localhost:3000/financials?ticker=MSFT&limit=1"

# Tesla
curl "http://localhost:3000/financials?ticker=TSLA&limit=1"

# Amazon
curl "http://localhost:3000/financials?ticker=AMZN&limit=1"

# Google (Alphabet)
curl "http://localhost:3000/financials?ticker=GOOGL&limit=1"
```

## Error Handling Tests

### 5. Missing Ticker Parameter
```bash
curl "http://localhost:3000/financials"
```

Response (400 Bad Request):
```json
{
  "success": false,
  "error": {
    "message": "Ticker parameter is required",
    "statusCode": 400,
    "timestamp": "2025-12-02T22:44:00.000Z",
    "path": "/financials"
  }
}
```

### 6. Invalid Ticker (Not Found)
```bash
curl "http://localhost:3000/financials?ticker=INVALID123456"
```

Response (404 Not Found):
```json
{
  "success": false,
  "error": {
    "message": "No financial statements found for ticker: INVALID123456",
    "statusCode": 404,
    "timestamp": "2025-12-02T22:44:00.000Z",
    "path": "/financials"
  }
}
```

### 7. Invalid Limit (Negative)
```bash
curl "http://localhost:3000/financials?ticker=AAPL&limit=-1"
```

Response (400 Bad Request):
```json
{
  "success": false,
  "error": {
    "message": "Limit must be a positive integer",
    "statusCode": 400,
    "timestamp": "2025-12-02T22:44:00.000Z",
    "path": "/financials"
  }
}
```

### 8. Limit Too High
```bash
curl "http://localhost:3000/financials?ticker=AAPL&limit=200"
```

Response (400 Bad Request):
```json
{
  "success": false,
  "error": {
    "message": "Limit cannot exceed 100",
    "statusCode": 400,
    "timestamp": "2025-12-02T22:44:00.000Z",
    "path": "/financials"
  }
}
```

## PowerShell (Windows) Examples

```powershell
# Health check
Invoke-RestMethod -Uri "http://localhost:3000/health"

# Get financials (formatted JSON)
Invoke-RestMethod -Uri "http://localhost:3000/financials?ticker=AAPL&limit=1" | ConvertTo-Json -Depth 10

# Get multiple periods
Invoke-RestMethod -Uri "http://localhost:3000/financials?ticker=AAPL&limit=3" | ConvertTo-Json -Depth 10
```

## VS Code REST Client

Create a file `test.http` and use the REST Client extension:

```http
### Health Check
GET http://localhost:3000/health

### Apple - 1 Period
GET http://localhost:3000/financials?ticker=AAPL&limit=1

### Apple - 3 Periods
GET http://localhost:3000/financials?ticker=AAPL&limit=3

### Microsoft
GET http://localhost:3000/financials?ticker=MSFT&limit=1

### Tesla
GET http://localhost:3000/financials?ticker=TSLA&limit=1

### Error Test - Missing Ticker
GET http://localhost:3000/financials

### Error Test - Invalid Ticker
GET http://localhost:3000/financials?ticker=INVALID123456
```

## API Features

✅ **Real FMP Data**: Fetches live financial data from Financial Modeling Prep  
✅ **Parallel Requests**: Uses `Promise.all()` for efficient data fetching  
✅ **Snake Case Normalization**: All fields returned in `snake_case`  
✅ **Free Cash Flow Calculation**: Automatically calculated from operating cash flow and CapEx  
✅ **Multi-Period Support**: Fetch multiple years of historical data  
✅ **Comprehensive Error Handling**: Handles invalid tickers, timeouts, rate limits, etc.  
✅ **Field Extraction**: Returns only the most important financial metrics  
✅ **Type Safety**: Full TypeScript support throughout

## Data Points Extracted

### Income Statement
- `revenue` - Total revenue
- `gross_profit` - Gross profit
- `operating_income` - Operating income
- `net_income` - Net income
- `eps` - Earnings per share

### Balance Sheet
- `cash_and_cash_equivalents` - Cash on hand
- `short_term_investments` - Short-term investments
- `total_assets` - Total assets
- `total_liabilities` - Total liabilities
- `total_shareholder_equity` - Shareholder equity
- `long_term_debt` - Long-term debt

### Cash Flow
- `operating_cash_flow` - Cash from operations
- `capital_expenditure` - CapEx (typically negative)
- `free_cash_flow` - Calculated: operating_cash_flow + capital_expenditure

## Notes

- ✅ API is configured with a **real FMP API key**
- ✅ All requests fetch data from the live FMP API
- 🔒 Rate limits apply based on your FMP subscription tier
- 📊 Financial data is normalized and cleaned for easy consumption
- 🐛 Comprehensive error handling for all edge cases
