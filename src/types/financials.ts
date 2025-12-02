// Normalized financial statement types (snake_case for API response)
export interface IncomeStatement {
  revenue: number | null;
  gross_profit: number | null;
  operating_income: number | null;
  net_income: number | null;
  eps: number | null;
}

export interface BalanceSheet {
  cash_and_cash_equivalents: number | null;
  short_term_investments: number | null;
  total_assets: number | null;
  total_liabilities: number | null;
  total_shareholder_equity: number | null;
  long_term_debt: number | null;
}

export interface CashFlowStatement {
  operating_cash_flow: number | null;
  capital_expenditure: number | null;
  free_cash_flow: number | null;
}

// Single period financial data
export interface FinancialPeriod {
  fiscal_year: number;
  fiscal_period: string; // e.g., "2023-09-30"
  income_statement: IncomeStatement;
  balance_sheet: BalanceSheet;
  cash_flow: CashFlowStatement;
}

// Combined financial data response
export interface FinancialData {
  ticker: string;
  count: number;
  data: FinancialPeriod[];
}

// FMP API raw response types (camelCase from API)
// Based on: https://financialmodelingprep.com/stable/income-statement
export interface FMPIncomeStatementResponse {
  date: string;
  symbol: string;
  reportedCurrency: string;
  cik: string;
  filingDate: string;
  acceptedDate: string;
  calendarYear: string;
  period: string;
  revenue: number;
  costOfRevenue: number;
  grossProfit: number;
  grossProfitRatio: number;
  researchAndDevelopmentExpenses: number;
  generalAndAdministrativeExpenses: number;
  sellingAndMarketingExpenses: number;
  sellingGeneralAndAdministrativeExpenses: number;
  otherExpenses: number;
  operatingExpenses: number;
  costAndExpenses: number;
  netInterestIncome: number;
  interestIncome: number;
  interestExpense: number;
  depreciationAndAmortization: number;
  ebitda: number;
  ebitdaratio: number;
  operatingIncome: number;
  operatingIncomeRatio: number;
  totalOtherIncomeExpensesNet: number;
  incomeBeforeTax: number;
  incomeBeforeTaxRatio: number;
  incomeTaxExpense: number;
  netIncome: number;
  netIncomeRatio: number;
  eps: number;
  epsdiluted: number;
  weightedAverageShsOut: number;
  weightedAverageShsOutDil: number;
  link: string;
  finalLink: string;
}

// Based on: https://financialmodelingprep.com/stable/balance-sheet-statement
export interface FMPBalanceSheetResponse {
  date: string;
  symbol: string;
  reportedCurrency: string;
  cik: string;
  filingDate: string;
  acceptedDate: string;
  calendarYear: string;
  period: string;
  fiscalYear: string;
  cashAndCashEquivalents: number;
  shortTermInvestments: number;
  cashAndShortTermInvestments: number;
  netReceivables: number;
  accountsReceivables: number;
  otherReceivables: number;
  inventory: number;
  prepaids: number;
  otherCurrentAssets: number;
  totalCurrentAssets: number;
  propertyPlantEquipmentNet: number;
  goodwill: number;
  intangibleAssets: number;
  goodwillAndIntangibleAssets: number;
  longTermInvestments: number;
  taxAssets: number;
  otherNonCurrentAssets: number;
  totalNonCurrentAssets: number;
  otherAssets: number;
  totalAssets: number;
  accountPayables: number;
  shortTermDebt: number;
  taxPayables: number;
  deferredRevenue: number;
  otherCurrentLiabilities: number;
  totalCurrentLiabilities: number;
  longTermDebt: number;
  deferredRevenueNonCurrent: number;
  deferredTaxLiabilitiesNonCurrent: number;
  otherNonCurrentLiabilities: number;
  totalNonCurrentLiabilities: number;
  otherLiabilities: number;
  capitalLeaseObligations: number;
  totalLiabilities: number;
  preferredStock: number;
  commonStock: number;
  retainedEarnings: number;
  accumulatedOtherComprehensiveIncomeLoss: number;
  othertotalStockholdersEquity: number;
  totalStockholdersEquity: number;
  totalEquity: number;
  totalLiabilitiesAndStockholdersEquity: number;
  minorityInterest: number;
  totalLiabilitiesAndTotalEquity: number;
  totalInvestments: number;
  totalDebt: number;
  netDebt: number;
  link: string;
  finalLink: string;
}

// Based on: https://financialmodelingprep.com/stable/cash-flow-statement
export interface FMPCashFlowResponse {
  date: string;
  symbol: string;
  reportedCurrency: string;
  cik: string;
  filingDate: string;
  acceptedDate: string;
  calendarYear: string;
  period: string;
  fiscalYear: string;
  netIncome: number;
  depreciationAndAmortization: number;
  deferredIncomeTax: number;
  stockBasedCompensation: number;
  changeInWorkingCapital: number;
  accountsReceivables: number;
  inventory: number;
  accountsPayables: number;
  otherWorkingCapital: number;
  otherNonCashItems: number;
  netCashProvidedByOperatingActivities: number;
  investmentsInPropertyPlantAndEquipment: number;
  acquisitionsNet: number;
  purchasesOfInvestments: number;
  salesMaturitiesOfInvestments: number;
  otherInvestingActivites: number;
  netCashUsedForInvestingActivites: number;
  debtRepayment: number;
  commonStockIssued: number;
  commonStockRepurchased: number;
  dividendsPaid: number;
  otherFinancingActivites: number;
  netCashUsedProvidedByFinancingActivities: number;
  effectOfForexChangesOnCash: number;
  netChangeInCash: number;
  cashAtEndOfPeriod: number;
  cashAtBeginningOfPeriod: number;
  operatingCashFlow: number;
  capitalExpenditure: number;
  freeCashFlow: number;
  link: string;
  finalLink: string;
}
