# Financial Statement API - Specification

## Base Configuration

### Environment Variables
```env
FMP_BASE_URL=https://financialmodelingprep.com/stable
FMP_API_KEY=your_api_key_here
PORT=3000
```

### FMP API Authentication
- **Method**: Query Parameter
- **Parameter Name**: `apikey`
- **Format**: `?apikey=YOUR_API_KEY`
- **Note**: Use `&apikey=` if other query parameters already exist in the endpoint

---

## Endpoints

### 1. Get Financial Statements

Fetches income statement, balance sheet, and cash flow statement data for a given ticker.

#### Request

**Endpoint**: `GET /financials`

**Query Parameters**:

| Parameter | Type   | Required | Default  | Description                                                         |
|-----------|--------|----------|----------|---------------------------------------------------------------------|
| ticker    | string | Yes      | -        | Stock ticker symbol (e.g., 'AAPL', 'MSFT')                         |
| limit     | number | No       | 1        | Number of periods to fetch (1-1000)                                 |
| period    | string | No       | 'annual' | Period type: 'annual', 'quarter', 'Q1', 'Q2', 'Q3', 'Q4', or 'FY' |

**Example Requests**:
```bash
# Get annual financial statements for Apple (1 year)
curl "http://localhost:3000/financials?ticker=AAPL"

# Get last 5 annual periods
curl "http://localhost:3000/financials?ticker=AAPL&limit=5"

# Get quarterly data
curl "http://localhost:3000/financials?ticker=AAPL&limit=4&period=quarter"

# Get specific quarter (Q1)
curl "http://localhost:3000/financials?ticker=AAPL&period=Q1"
```

#### Response

**Status Code**: `200 OK`

**Response Body**:
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

**404 Not Found** - Ticker not found
```json
{
  "success": false,
  "error": {
    "message": "Ticker \"INVALID\" not found. Please verify the ticker symbol is correct.",
    "statusCode": 404
  }
}
```

**503 Service Unavailable** - API error or rate limit
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

## Underlying FMP API Endpoints

### Income Statement
- **Endpoint**: `https://financialmodelingprep.com/stable/income-statement`
- **Method**: GET
- **Parameters**:
  - `symbol` (required): Stock ticker
  - `limit` (optional): Max 1000
  - `period` (optional): 'annual', 'quarter', 'Q1', 'Q2', 'Q3', 'Q4', 'FY'
  - `apikey` (required): Your API key

**Example**:
```
https://financialmodelingprep.com/stable/income-statement?symbol=AAPL&limit=5&period=annual&apikey=YOUR_KEY
```

### Balance Sheet Statement
- **Endpoint**: `https://financialmodelingprep.com/stable/balance-sheet-statement`
- **Method**: GET
- **Parameters**: Same as Income Statement

**Example**:
```
https://financialmodelingprep.com/stable/balance-sheet-statement?symbol=AAPL&limit=5&period=annual&apikey=YOUR_KEY
```

### Cash Flow Statement
- **Endpoint**: `https://financialmodelingprep.com/stable/cash-flow-statement`
- **Method**: GET
- **Parameters**: Same as Income Statement

**Example**:
```
https://financialmodelingprep.com/stable/cash-flow-statement?symbol=AAPL&limit=5&period=annual&apikey=YOUR_KEY
```

---

## Field Mappings

### Income Statement

| Our API Field     | FMP API Field    | Description                          |
|-------------------|------------------|--------------------------------------|
| revenue           | revenue          | Total revenue                        |
| gross_profit      | grossProfit      | Revenue minus cost of revenue        |
| operating_income  | operatingIncome  | Operating profit (EBIT)              |
| net_income        | netIncome        | Bottom line profit after all expenses|
| eps               | eps              | Earnings per share                   |

### Balance Sheet

| Our API Field               | FMP API Field              | Description                     |
|-----------------------------|----------------------------|---------------------------------|
| cash_and_cash_equivalents   | cashAndCashEquivalents     | Cash on hand                    |
| short_term_investments      | shortTermInvestments       | Short-term marketable securities|
| total_assets                | totalAssets                | All assets owned by company     |
| total_liabilities           | totalLiabilities           | All debts and obligations       |
| total_shareholder_equity    | totalStockholdersEquity    | Assets minus liabilities        |
| long_term_debt              | longTermDebt               | Debt due after 1 year           |

### Cash Flow Statement

| Our API Field          | FMP API Field                       | Description                          |
|------------------------|-------------------------------------|--------------------------------------|
| operating_cash_flow    | operatingCashFlow                   | Cash from business operations        |
| capital_expenditure    | capitalExpenditure                  | Investment in fixed assets (negative)|
| free_cash_flow         | (calculated)                        | Operating CF + CapEx                 |

**Note**: Free cash flow is calculated as: `operating_cash_flow + capital_expenditure` (since capital expenditure is negative)

---

## Rate Limits

FMP API rate limits depend on your subscription tier. Common limits:
- **Free tier**: 250 requests per day
- **Starter**: 500 requests per day
- **Professional**: Higher limits

The API will return a `503 Service Unavailable` error with message about rate limiting if exceeded.

---

## Currency

All financial values are reported in the currency specified in the company's official filings (typically USD for US companies). Check the `reportedCurrency` field in the raw FMP response if needed.

---

## Data Freshness

- **Annual data**: Available after company files 10-K (typically within days of fiscal year end)
- **Quarterly data**: Available after company files 10-Q (typically within 45 days of quarter end)

---

## Testing

### Using cURL
```bash
# Basic test
curl "http://localhost:3000/financials?ticker=AAPL&limit=1"

# With all parameters
curl "http://localhost:3000/financials?ticker=AAPL&limit=5&period=annual"

# Quarterly data
curl "http://localhost:3000/financials?ticker=MSFT&limit=4&period=quarter"
```

### Using REST Client (VS Code extension)
See `test.http` file in the project root.

### Using Postman/Insomnia
- **URL**: `http://localhost:3000/financials`
- **Method**: GET
- **Query Params**: 
  - ticker: AAPL
  - limit: 5
  - period: annual
