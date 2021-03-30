import { AccountTree, AccountTreeBalance, GeneralLedger, getAccountMap } from "@deboxsoft/accounting-api";

import { transformToAccountTreeBalance } from "@deboxsoft/accounting-api";

export interface BalanceAccounts {
  aktivaLancar: string[];
  aktivaTetap: string[];
  pasiva: string[];
  cadangan: string[];
  modal: string[];
}

export type BalanceDataResult = Record<keyof BalanceAccounts, AccountTreeBalance[]>;
export type BalanceAccountTree = Record<keyof BalanceAccounts, AccountTree[]>;

export const neracaParsingUtils = (accountsTree: AccountTree[], balanceAccounts: BalanceAccounts) => {
  const aktivaTetap = getAccountMap(accountsTree, balanceAccounts.aktivaTetap);
  const aktivaLancar = getAccountMap(accountsTree, balanceAccounts.aktivaLancar);
  const pasiva = getAccountMap(accountsTree, balanceAccounts.pasiva);
  const cadangan = getAccountMap(accountsTree, balanceAccounts.cadangan);
  const modal = getAccountMap(accountsTree, balanceAccounts.modal);
  const result: BalanceDataResult = {
    aktivaTetap: aktivaTetap.accountTrees,
    aktivaLancar: aktivaLancar.accountTrees,
    pasiva: pasiva.accountTrees,
    cadangan: cadangan.accountTrees,
    modal: modal.accountTrees
  };
  return (generalLedgers: GeneralLedger[]): BalanceDataResult => {
    generalLedgers.forEach((generalLedger) => {
      if (aktivaTetap.ids.includes(generalLedger.accountId)) {
        result.aktivaTetap.forEach((_) => {
          transformToAccountTreeBalance(_, generalLedger);
        });
      } else if (aktivaLancar.ids.includes(generalLedger.accountId)) {
        result.aktivaLancar.forEach((_) => {
          transformToAccountTreeBalance(_, generalLedger);
        });
      } else if (pasiva.ids.includes(generalLedger.accountId)) {
        result.pasiva.forEach((_) => {
          transformToAccountTreeBalance(_, generalLedger);
        });
      } else if (cadangan.ids.includes(generalLedger.accountId)) {
        result.cadangan.forEach((_) => {
          transformToAccountTreeBalance(_, generalLedger);
        });
      } else if (modal.ids.includes(generalLedger.accountId)) {
        result.modal.forEach((_) => {
          transformToAccountTreeBalance(_, generalLedger);
        });
      }
    });
    return result;
  };
};
