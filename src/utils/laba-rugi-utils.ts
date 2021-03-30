import { AccountTree, AccountTreeBalance, GeneralLedger, getAccountMap } from "@deboxsoft/accounting-api";

import { transformToAccountTreeBalance } from "@deboxsoft/accounting-api";

export interface LabaRugiAccounts {
  pendapatan: string[];
  pendapatanLain: string[];
  beban: string[];
  bebanLain: string[];
}

export type LabaRugiDataResult = Record<keyof LabaRugiAccounts, AccountTreeBalance[]>;
export type LabaRugiAccountTree = Record<keyof LabaRugiAccounts, AccountTree[]>;

export const labaRugiParsingUtils = (accountsTree: AccountTree[], labaRugiAccounts: LabaRugiAccounts) => {
  const pendapatan = getAccountMap(accountsTree, labaRugiAccounts.pendapatan);
  const pendapatanLain = getAccountMap(accountsTree, labaRugiAccounts.pendapatanLain);
  const beban = getAccountMap(accountsTree, labaRugiAccounts.beban);
  const bebanLain = getAccountMap(accountsTree, labaRugiAccounts.bebanLain);

  const result: LabaRugiDataResult = {
    pendapatan: pendapatan.accountTrees,
    pendapatanLain: pendapatanLain.accountTrees,
    beban: beban.accountTrees,
    bebanLain: bebanLain.accountTrees
  };
  return (generalLedgers: GeneralLedger[]): LabaRugiDataResult => {
    generalLedgers.forEach((generalLedger) => {
      if (pendapatan.ids.includes(generalLedger.accountId)) {
        result.pendapatan.forEach((_) => {
          transformToAccountTreeBalance(_, generalLedger);
        });
      } else if (pendapatanLain.ids.includes(generalLedger.accountId)) {
        result.pendapatanLain.forEach((_) => {
          transformToAccountTreeBalance(_, generalLedger);
        });
      } else if (beban.ids.includes(generalLedger.accountId)) {
        result.beban.forEach((_) => {
          transformToAccountTreeBalance(_, generalLedger);
        });
      } else if (bebanLain.ids.includes(generalLedger.accountId)) {
        result.bebanLain.forEach((_) => {
          transformToAccountTreeBalance(_, generalLedger);
        });
      }
    });
    return result;
  };
};
