import type { Account, Balance } from "@deboxsoft/accounting-api";

export const parsingRevenueReport = (data) => {
  const statementIncomeReport = data.statementIncomeReport;
  const revenueBalance = statementIncomeReport.revenue.balance + statementIncomeReport.revenueOther.balance;
  const expenseBalance = statementIncomeReport.expense.balance + statementIncomeReport.expenseOther.balance;
  const statementIncomeBalance = revenueBalance - expenseBalance;
  return {
    statementIncomeReport,
    revenueBalance,
    expenseBalance,
    statementIncomeBalance
  };
};

export const parsingBalanceSheetReport = (data) => {
  const { revenueBalance, expenseBalance } = parsingRevenueReport(data);
  const balanceSheetReport = data.balanceSheetReport;
  const statementIncomeReport = data.statementIncomeReport;
  const assetsBalance = balanceSheetReport.assetsCurrent.balance + balanceSheetReport.assetsFixed.balance;
  const statementIncomeBalance = revenueBalance - expenseBalance;
  const liabilitiesBalance =
    balanceSheetReport.liabilitiesCurrent.balance +
    balanceSheetReport.liabilitiesFixed.balance +
    balanceSheetReport.equities.balance +
    statementIncomeBalance;
  return {
    balanceSheetReport,
    statementIncomeReport,
    assetsBalance,
    revenueBalance,
    expenseBalance,
    statementIncomeBalance,
    liabilitiesBalance
  };
};

export const calculateBalance = (accounts: Account[], balance: Balance) => {
  for (const account of accounts) {
    if (account.children) {
      account.balance = 0;
      for (const child of account.children) {
        child.balance = balance[child.id] || 0;
        account.balance += child.balance;
      }
    }
  }
};
