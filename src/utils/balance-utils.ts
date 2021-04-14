import type { get, Readable } from "svelte/store";
import type { AccountTree, AccountTreeBalance, BalanceSheet } from "@deboxsoft/accounting-api";

// import { setBalanceToAccountsTree } from "@deboxsoft/accounting-api";

export interface BalanceAccounts {
  aktivaLancar: Readable<string[]>;
  aktivaTetap: Readable<string[]>;
  pasiva: Readable<string[]>;
  cadangan: Readable<string[]>;
  modal: Readable<string[]>;
}

export type BalanceDataResult = Record<
  keyof BalanceAccounts,
  {
    items: AccountTreeBalance[];
    sum: number;
  }
>;
export type BalanceAccountTree = Record<keyof BalanceAccounts, AccountTree[]>;

export const neracaParsingUtils = (accountsTree: AccountTree[], balanceAccounts: BalanceAccounts) => {
  // const aktivaTetap = getAccountsTreeBalance(accountsTree, get(balanceAccounts.aktivaTetap));
  // const aktivaLancar = getAccountMap(accountsTree, get(balanceAccounts.aktivaLancar));
  // const pasiva = getAccountMap(accountsTree, get(balanceAccounts.pasiva));
  // const cadangan = getAccountMap(accountsTree, get(balanceAccounts.cadangan));
  // const modal = getAccountMap(accountsTree, get(balanceAccounts.modal));
  const result: any = {};
  //   aktivaTetap: {
  //     items: aktivaTetap.accountTrees,
  //     sum: 0
  //   },
  //   aktivaLancar: {
  //     items: aktivaLancar.accountTrees,
  //     sum: 0
  //   },
  //   pasiva: {
  //     items: pasiva.accountTrees,
  //     sum: 0
  //   },
  //   cadangan: {
  //     items: cadangan.accountTrees,
  //     sum: 0
  //   },
  //   modal: {
  //     items: modal.accountTrees,
  //     sum: 0
  //   }
  // };
  return (balanceSheets: BalanceSheet[]): BalanceDataResult => {
    // balanceSheets.forEach((balanceSheet) => {
    //   if (aktivaTetap.ids.includes(balanceSheet.accountId)) {
    //     result.aktivaTetap.items.forEach((_) => {
    //       setBalanceToAccountsTree(_, balanceSheet);
    //     });
    //     result.aktivaTetap.sum += balanceSheet.balance;
    //   } else if (aktivaLancar.ids.includes(balanceSheet.accountId)) {
    //     result.aktivaLancar.items.forEach((_) => {
    //       setBalanceToAccountsTree(_, balanceSheet);
    //     });
    //     result.aktivaLancar.sum += balanceSheet.balance;
    //   } else if (pasiva.ids.includes(balanceSheet.accountId)) {
    //     result.pasiva.items.forEach((_) => {
    //       setBalanceToAccountsTree(_, balanceSheet);
    //     });
    //     result.pasiva.sum += balanceSheet.balance;
    //   } else if (cadangan.ids.includes(balanceSheet.accountId)) {
    //     result.cadangan.items.forEach((_) => {
    //       setBalanceToAccountsTree(_, balanceSheet);
    //     });
    //     result.cadangan.sum += balanceSheet.balance;
    //   } else if (modal.ids.includes(balanceSheet.accountId)) {
    //     result.modal.items.forEach((_) => {
    //       setBalanceToAccountsTree(_, balanceSheet);
    //     });
    //     result.modal.sum += balanceSheet.balance;
    //   }
    // });
    return result;
  };
};
