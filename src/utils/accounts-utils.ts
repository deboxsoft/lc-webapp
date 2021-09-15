import type { Account, PreferenceAccounting } from "@deboxsoft/accounting-api";
import { stores } from "@deboxsoft/accounting-client";
import { getAuthenticationContext } from "__@modules/users";
import { derived, get, Readable } from "svelte/store";

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

const codeAccountList = [
  codeAccount.stock,
  codeAccount.bdd,
  codeAccount.expenseAmortization,
  codeAccount.accumulationAmortization,
  codeAccount.inventory,
  codeAccount.expenseDepreciation,
  codeAccount.accumulationDepreciation
];

function excludeCodeAccount(account: Account) {
  return !codeAccountList.includes(account.parentId);
}

export function isRevenue(accountId: string): boolean {
  const { preferenceStore } = stores.getPreferenceAccountingContext();
  const config = get(preferenceStore);
  const code = config.codeAccount.revenue;
  const regex = new RegExp(`^(${code}).*`);
  return regex.test(accountId);
}

export function isExpense(accountId: string): boolean {
  const { preferenceStore } = stores.getPreferenceAccountingContext();
  const config = get(preferenceStore);
  const code = config.codeAccount.expense;
  const regex = new RegExp(`^(${code}).*`);
  return regex.test(accountId);
}

export function filteringAccountDebit(accountStore: Readable<Account[]>) {
  const { authenticationStore } = getAuthenticationContext();
  const { preferenceStore } = stores.getPreferenceAccountingContext();
  const config = get(preferenceStore);
  const code = config.codeAccount.revenue;
  const regex = new RegExp(`^[^${code}].*`);
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
  const regex = new RegExp(`^[^${code}].*`);
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
  const regex = new RegExp(`^(${code}).*`);
  let includeAccounts = get(authenticationStore).metadata?.includeAccounts;
  return derived(accountStore, (_) => {
    return _.filter((_) => {
      if (regex.test(_.id)) {
        if (!includeAccounts || includeAccounts.includes(_.id)) {
          return _;
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
  const regex = new RegExp(`^(${code}).*`);
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
  const regex = new RegExp(`^(${code}).*`);
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

export function accountUtils() {
  const { preferenceStore } = stores.getPreferenceAccountingContext();
  const { getAccount } = stores.getAccountContext();
  const { getBalance } = stores.getBalanceContext();
  const config = get(preferenceStore);
  const code = config.codeAccount.cash;
  const regex = new RegExp(`^(${code}).*`);
  const isCash = (accountId: string) => regex.test(accountId);
  const checkCashBalance = async (accountId: string, amount: number) => {
    if (isCash(accountId)) {
      const balance = (await getBalance(accountId)) || 0;
      if (balance < amount) {
        const account = get(getAccount(accountId));
        throw new Error(`Saldo kas '${account.name}' tidak mencukupi.`);
      }
    }
  };
  return {
    isCash,
    checkCashBalance
  };
}
