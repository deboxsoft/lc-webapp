import { Account, createAccountUtils, PreferenceAccounting } from "@deboxsoft/accounting-api";
import { stores } from "@deboxsoft/accounting-client";
import { getAuthenticationContext } from "__@modules/users";
import { derived, get, Readable } from "svelte/store";
import { t } from "../locales";

export function isRevenue(accountId: string): boolean {
  const { preferenceStore } = stores.getPreferenceAccountingContext();
  const config = get(preferenceStore);
  const accountsUtils = createAccountUtils(config);
  return accountsUtils.isRevenue(accountId);
}

export function isExpense(accountId: string): boolean {
  const { preferenceStore } = stores.getPreferenceAccountingContext();
  const config = get(preferenceStore);
  const accountsUtils = createAccountUtils(config);
  return accountsUtils.isExpense(accountId);
}

export function filteringAccountDebit(accountStore: Readable<Account[]>) {
  const { authenticationStore } = getAuthenticationContext();
  const { preferenceStore } = stores.getPreferenceAccountingContext();
  const config = get(preferenceStore);
  const accountsUtils = createAccountUtils(config);
  let accountsIdDebit = get(authenticationStore).metadata?.includeAccounts;
  return derived(accountStore, (_) => {
    return _.filter((_) => {
      if (accountsUtils.isRevenue(_.id)) {
        return false;
      }
      if (!accountsIdDebit || accountsIdDebit.includes(_.id)) {
        return accountsUtils.excludeCodeAccount(_);
      }
      return true;
    });
  });
}

export function filteringAccountCredit(accountStore: Readable<Account[]>) {
  const { authenticationStore } = getAuthenticationContext();
  const { preferenceStore } = stores.getPreferenceAccountingContext();
  const config = get(preferenceStore);
  const accountsUtils = createAccountUtils(config);
  let accountsIdCredit = get(authenticationStore).metadata?.includeAccounts;
  return derived(accountStore, (_) => {
    return _.filter((_) => {
      if (accountsUtils.isExpense(_.id)) {
        return false;
      }
      if (!accountsIdCredit || accountsIdCredit.includes(_.id)) {
        return accountsUtils.excludeCodeAccount(_);
      }
      return true;
    });
  });
}

export function filteringAccountCash(accountStore: Readable<Account[]>) {
  const { authenticationStore } = getAuthenticationContext();
  const { preferenceStore } = stores.getPreferenceAccountingContext();
  const config = get(preferenceStore);
  const accountsUtils = createAccountUtils(config);
  let includeAccounts = get(authenticationStore).metadata?.includeAccounts;
  return derived(accountStore, (_) => {
    return _.filter((_) => {
      if (accountsUtils.isCash(_.id)) {
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
  const accountsUtils = createAccountUtils(config);
  return derived(accountStore, (_) => {
    return _.filter((_) => {
      if (accountsUtils.isRevenue(_.id)) {
        return accountsUtils.excludeCodeAccount(_);
      }
      return false;
    });
  });
}

export function filteringAccountExpense(accountStore: Readable<Account[]>) {
  const { preferenceStore } = stores.getPreferenceAccountingContext();
  const config = get(preferenceStore);
  const accountsUtils = createAccountUtils(config);
  return derived(accountStore, (_) => {
    return _.filter((_) => {
      if (accountsUtils.isExpense(_.id)) {
        return accountsUtils.excludeCodeAccount(_);
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

export function filteringAccountPayable(accountStore: Readable<Account[]>) {
  const { preferenceStore } = stores.getPreferenceAccountingContext();
  const config = get(preferenceStore);
  const accountsUtils = createAccountUtils(config);
  return derived(accountStore, (_) => {
    return _.filter((__) => {
      return accountsUtils.isPayable(__.id);
    });
  });
}

export function getAccountType(account: Account, preference: PreferenceAccounting) {
  const accountsUtils = createAccountUtils(preference);
  let type = "-";
  if (accountsUtils.isAssets(account.id)) {
    type = get(t)("account.assets");
  } else if (accountsUtils.isPayable(account.id) || accountsUtils.isEquities(account.id)) {
    type = get(t)("account.liabilities");
  } else if (accountsUtils.isRevenue(account.id)) {
    type = get(t)("account.revenue");
  } else if (accountsUtils.isExpense(account.id)) {
    type = get(t)("account.expense");
  }
  return type;
}
