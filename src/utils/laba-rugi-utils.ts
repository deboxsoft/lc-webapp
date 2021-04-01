import { AccountTree, AccountTreeBalance, BalanceSheet, getAccountMap } from "@deboxsoft/accounting-api";

import { transformToAccountTreeBalance } from "@deboxsoft/accounting-api";

export interface LabaRugiAccounts {
  pendapatan: string[];
  pendapatanLain: string[];
  beban: string[];
  bebanLain: string[];
}

export type LabaRugiDataResult = Record<keyof LabaRugiAccounts, { items: AccountTreeBalance[]; sum: number }>;
export type LabaRugiAccountTree = Record<keyof LabaRugiAccounts, AccountTree[]>;

export const labaRugiParsingUtils = (accountsTree: AccountTree[], labaRugiAccounts: LabaRugiAccounts) => {
  const pendapatan = getAccountMap(accountsTree, labaRugiAccounts.pendapatan);
  const pendapatanLain = getAccountMap(accountsTree, labaRugiAccounts.pendapatanLain);
  const beban = getAccountMap(accountsTree, labaRugiAccounts.beban);
  const bebanLain = getAccountMap(accountsTree, labaRugiAccounts.bebanLain);

  const result: LabaRugiDataResult = {
    pendapatan: { items: pendapatan.accountTrees, sum: 0 },
    pendapatanLain: { items: pendapatanLain.accountTrees, sum: 0 },
    beban: { items: beban.accountTrees, sum: 0 },
    bebanLain: { items: bebanLain.accountTrees, sum: 0 }
  };
  return (balanceSheets: BalanceSheet[]): LabaRugiDataResult => {
    balanceSheets.forEach((balanceSheet) => {
      if (pendapatan.ids.includes(balanceSheet.accountId)) {
        result.pendapatan.items.forEach((_) => {
          transformToAccountTreeBalance(_, balanceSheet);
        });
        result.pendapatan.sum += balanceSheet.balance;
      } else if (pendapatanLain.ids.includes(balanceSheet.accountId)) {
        result.pendapatanLain.items.forEach((_) => {
          transformToAccountTreeBalance(_, balanceSheet);
        });
        result.pendapatanLain.sum += balanceSheet.balance;
      } else if (beban.ids.includes(balanceSheet.accountId)) {
        result.beban.items.forEach((_) => {
          transformToAccountTreeBalance(_, balanceSheet);
        });
        result.beban.sum += balanceSheet.balance;
      } else if (bebanLain.ids.includes(balanceSheet.accountId)) {
        result.bebanLain.items.forEach((_) => {
          transformToAccountTreeBalance(_, balanceSheet);
        });
        result.bebanLain.sum += balanceSheet.balance;
      }
    });
    return result;
  };
};
