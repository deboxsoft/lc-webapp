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
