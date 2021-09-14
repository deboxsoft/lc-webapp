import { stores } from "@deboxsoft/accounting-client";
import { derived, get, Readable } from "svelte/store";
import type { Account, PreferenceAccounting } from "@deboxsoft/accounting-api";
import { getAuthenticationContext } from "__@modules/users";

const codeAccount: PreferenceAccounting["codeAccount"] = {
  stock: "1030100",
  bdd: "1050100",
  expenseAmortization: "5040100",
  accumulationAmortization: "1050200",
  inventory: "1110100",
  expenseDepreciation: "5050100",
  accumulationDepreciation: "1120100",
  cash: "101",
  revenue: "4",
  expense: "5"
};

const codeAccountList = Object.values(codeAccount);

function excludeCodeAccount(account: Account) {
  return !codeAccountList.includes(account.parentId);
}

export function isCash(accountId: string): boolean {
  const { preferenceStore } = stores.getPreferenceAccountingContext();
  const config = get(preferenceStore);
  const code = config.codeAccount.cash;
  const regex = new RegExp(`^(${code}).*`, "g");
  return regex.test(accountId);
}

export function isRevenue(accountId: string): boolean {
  const { preferenceStore } = stores.getPreferenceAccountingContext();
  const config = get(preferenceStore);
  const code = config.codeAccount.revenue;
  const regex = new RegExp(`^(${code}).*`, "g");
  return regex.test(accountId);
}

export function isExpense(accountId: string): boolean {
  const { preferenceStore } = stores.getPreferenceAccountingContext();
  const config = get(preferenceStore);
  const code = config.codeAccount.expense;
  const regex = new RegExp(`^(${code}).*`, "g");
  return regex.test(accountId);
}

export function filteringAccountDebit(accountStore: Readable<Account[]>) {
  const { authenticationStore } = getAuthenticationContext();
  const { preferenceStore } = stores.getPreferenceAccountingContext();
  const config = get(preferenceStore);
  const code = config.codeAccount.revenue;
  const regex = new RegExp(`^[^${code}].*`, "g");
  let accountsIdDebit = get(authenticationStore).metadata?.includeAccounts;
  return derived(accountStore, (_) => {
    return _.filter((_) => {
      if (regex.test(_.id)) {
        if (!accountsIdDebit || accountsIdDebit.includes(_.id)) {
          return excludeCodeAccount(_);
        }
      }
      return false;
    });
  });
}

export function filteringAccountCredit(accountStore: Readable<Account[]>) {
  const { authenticationStore } = getAuthenticationContext();
  const { preferenceStore } = stores.getPreferenceAccountingContext();
  const config = get(preferenceStore);
  const code = config.codeAccount.expense;
  const regex = new RegExp(`^[^${code}].*`, "g");
  let accountsIdCredit = get(authenticationStore).metadata?.includeAccounts;
  return derived(accountStore, (_) => {
    return _.filter((_) => {
      if (regex.test(_.id)) {
        if (!accountsIdCredit || accountsIdCredit.includes(_.id)) {
          return excludeCodeAccount(_);
        }
      }
      return false;
    });
  });
}

export function filteringAccountCash(accountStore: Readable<Account[]>) {
  const { authenticationStore } = getAuthenticationContext();
  const { preferenceStore } = stores.getPreferenceAccountingContext();
  const config = get(preferenceStore);
  const code = config.codeAccount.cash;
  const regex = new RegExp(`^(${code}).*`, "g");
  let includeAccounts = get(authenticationStore).metadata?.includeAccounts;
  return derived(accountStore, (_) => {
    return _.filter((_) => {
      if (regex.test(_.id)) {
        if (!includeAccounts || includeAccounts.includes(_.id)) {
          return excludeCodeAccount(_);
        }
      }
      return false;
    });
  });
}

export function filteringAccountRevenue(accountStore: Readable<Account[]>) {
  const { preferenceStore } = stores.getPreferenceAccountingContext();
  const config = get(preferenceStore);
  const code = config.codeAccount.revenue;
  const regex = new RegExp(`^(${code}).*`, "g");
  return derived(accountStore, (_) => {
    return _.filter((_) => {
      if (regex.test(_.id)) {
        return excludeCodeAccount(_);
      }
      return false;
    });
  });
}

export function filteringAccountExpense(accountStore: Readable<Account[]>) {
  const { preferenceStore } = stores.getPreferenceAccountingContext();
  const config = get(preferenceStore);
  const code = config.codeAccount.expense;
  const regex = new RegExp(`^(${code}).*`, "g");
  return derived(accountStore, (_) => {
    return _.filter((_) => {
      if (regex.test(_.id)) {
        return excludeCodeAccount(_);
      }
      return false;
    });
  });
}

export function filteringAccountStock(accountStore: Readable<Account[]>) {
  const { preferenceStore } = stores.getPreferenceAccountingContext();
  const config = get(preferenceStore);
  const parentId = config.codeAccount.stock;
  return derived(accountStore, (_) => _.filter((_) => _.parentId === parentId));
}

export function filteringAccountBdd(accountStore: Readable<Account[]>) {
  const { preferenceStore } = stores.getPreferenceAccountingContext();
  const config = get(preferenceStore);
  const parentId = config.codeAccount.bdd;
  return derived(accountStore, (_) => _.filter((_) => _.parentId === parentId));
}

export function filteringAccountExpenseAmortization(accountStore: Readable<Account[]>) {
  const { preferenceStore } = stores.getPreferenceAccountingContext();
  const config = get(preferenceStore);
  const parentId = config.codeAccount.expenseAmortization;
  return derived(accountStore, (_) => _.filter((_) => _.parentId === parentId));
}

export function filteringAccountAccumulationAmortization(accountStore: Readable<Account[]>) {
  const { preferenceStore } = stores.getPreferenceAccountingContext();
  const config = get(preferenceStore);
  const parentId = config.codeAccount.accumulationAmortization;
  return derived(accountStore, (_) => _.filter((_) => _.parentId === parentId));
}

export function filteringAccountInventory(accountStore: Readable<Account[]>) {
  const { preferenceStore } = stores.getPreferenceAccountingContext();
  const config = get(preferenceStore);
  const parentId = config.codeAccount.inventory;
  return derived(accountStore, (_) => _.filter((_) => _.parentId === parentId));
}

export function filteringAccountExpenseDepreciation(accountStore: Readable<Account[]>) {
  const { preferenceStore } = stores.getPreferenceAccountingContext();
  const config = get(preferenceStore);
  const parentId = config.codeAccount.expenseDepreciation;
  return derived(accountStore, (_) => _.filter((_) => _.parentId === parentId));
}

export function filteringAccountAccumulationDepreciation(accountStore: Readable<Account[]>) {
  const { preferenceStore } = stores.getPreferenceAccountingContext();
  const config = get(preferenceStore);
  const parentId = config.codeAccount.accumulationDepreciation;
  return derived(accountStore, (_) => _.filter((_) => _.parentId === parentId));
}
