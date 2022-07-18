import { Account, BalanceData, createAccountUtils, PreferenceAccounting } from "@deboxsoft/accounting-api";
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

export function filteringAccountDebit(accountStore: Readable<Account[]>, exclude = true) {
  const { authenticationStore } = getAuthenticationContext();
  const { preferenceStore } = stores.getPreferenceAccountingContext();
  return derived([accountStore, preferenceStore, authenticationStore], ([_, config, authStore]) => {
    if (!config || !_) {
      return [];
    }
    const includeAccounts = authStore.metadata?.includeAccounts;
    const accountsUtils = createAccountUtils(config);
    return _.filter((_) => {
      if (accountsUtils.isRevenue(_.id)) {
        return false;
      }
      if (!includeAccounts || includeAccounts.includes(_.id)) {
        return !accountsUtils.isExclusiveAccount(_);
      }
      return !exclude;
    });
  });
}

export function filteringAccountCredit(accountStore: Readable<Account[]>, exclude = true) {
  const { authenticationStore } = getAuthenticationContext();
  const { preferenceStore } = stores.getPreferenceAccountingContext();
  return derived([accountStore, preferenceStore, authenticationStore], ([_, config, authStore]) => {
    if (!config || !_) {
      return [];
    }
    const includeAccounts = authStore.metadata?.includeAccounts;
    const accountsUtils = createAccountUtils(config);
    return _.filter((_) => {
      if (accountsUtils.isExpense(_.id)) {
        return false;
      }
      if (!includeAccounts || includeAccounts.includes(_.id)) {
        return !accountsUtils.isExclusiveAccount(_);
      }
      return !exclude;
    });
  });
}

export function filteringAccountCash(accountStore: Readable<Account[]>, exclude = true) {
  const { authenticationStore } = getAuthenticationContext();
  const { preferenceStore } = stores.getPreferenceAccountingContext();
  return derived([accountStore, preferenceStore, authenticationStore], ([_, config, authStore]) => {
    if (!config || !_) {
      return [];
    }
    const includeAccounts = authStore.metadata?.includeAccounts;
    const accountsUtils = createAccountUtils(config);
    return _.filter((_) => {
      if (accountsUtils.isCash(_.id)) {
        if (!includeAccounts || includeAccounts.includes(_.id)) {
          return !accountsUtils.isExclusiveAccount(_);
        }
      }
      return !exclude;
    });
  });
}

export function filteringAccountPayment(accountStore: Readable<Account[]>, exclude = true) {
  const { authenticationStore } = getAuthenticationContext();
  const { preferenceStore } = stores.getPreferenceAccountingContext();
  return derived([accountStore, preferenceStore, authenticationStore], ([_, config, authStore]) => {
    if (!config || !_) {
      return [];
    }
    const includeAccounts = authStore.metadata?.includeAccounts;
    const accountsUtils = createAccountUtils(config);
    return _.filter((_) => {
      if (accountsUtils.isCash(_.id) || accountsUtils.isPayable(_.id)) {
        if (!includeAccounts || includeAccounts.includes(_.id)) {
          return !accountsUtils.isExclusiveAccount(_);
        }
      }
      return !exclude;
    });
  });
}

export function filteringAccountRevenue(accountStore: Readable<Account[]>, exclude = true) {
  const { preferenceStore } = stores.getPreferenceAccountingContext();
  return derived([accountStore, preferenceStore], ([_, config]) => {
    if (!config || !_) {
      return [];
    }
    const accountsUtils = createAccountUtils(config);
    return _.filter((_) => {
      if (accountsUtils.isRevenue(_.id)) {
        return !accountsUtils.isExclusiveAccount(_);
      }
      return !exclude;
    });
  });
}

export function filteringAccountExpense(accountStore: Readable<Account[]>, exclude = true) {
  const { preferenceStore } = stores.getPreferenceAccountingContext();
  return derived([accountStore, preferenceStore], ([_, config]) => {
    if (!config || !_) {
      return [];
    }
    const accountsUtils = createAccountUtils(config);
    return _.filter((_) => {
      if (accountsUtils.isExpense(_.id)) {
        return !accountsUtils.isExclusiveAccount(_);
      }
      return !exclude;
    });
  });
}

export function filteringAccountStock(accountStore: Readable<Account[]>) {
  const { preferenceStore } = stores.getPreferenceAccountingContext();
  return derived([accountStore, preferenceStore], ([_, config]) => {
    if (!config || !_) {
      return [];
    }
    const parentId = config.codeAccount.stock;
    return _.filter((_) => _.parentId === parentId);
  });
}

export function filteringAccountBdd(accountStore: Readable<Account[]>) {
  const { preferenceStore } = stores.getPreferenceAccountingContext();
  return derived([accountStore, preferenceStore], ([_, config]) => {
    if (!config || !_) {
      return [];
    }
    const parentId = config.codeAccount.bdd;
    return _.filter((_) => _.parentId === parentId);
  });
}

export function filteringAccountExpenseAmortization(accountStore: Readable<Account[]>) {
  const { preferenceStore } = stores.getPreferenceAccountingContext();
  return derived([accountStore, preferenceStore], ([_, config]) => {
    if (!config || !_) {
      return [];
    }
    const parentId = config.codeAccount.expenseAmortization;
    return _.filter((_) => _.parentId === parentId);
  });
}

export function filteringAccountAccumulationAmortization(accountStore: Readable<Account[]>) {
  const { preferenceStore } = stores.getPreferenceAccountingContext();
  return derived([accountStore, preferenceStore], ([_, config]) => {
    if (!config || !_) {
      return [];
    }
    const parentId = config.codeAccount.accumulationAmortization;
    return _.filter((_) => _.parentId === parentId);
  });
}

export function filteringAccountInventory(accountStore: Readable<Account[]>) {
  const { preferenceStore } = stores.getPreferenceAccountingContext();
  return derived([accountStore, preferenceStore], ([_, config]) => {
    if (!config || !_) {
      return [];
    }
    const parentId = config.codeAccount.inventory;
    return _.filter((_) => _.parentId === parentId);
  });
}

export function filteringAccountExpenseDepreciation(accountStore: Readable<Account[]>) {
  const { preferenceStore } = stores.getPreferenceAccountingContext();
  return derived([accountStore, preferenceStore], ([_, config]) => {
    if (!config || !_) {
      return [];
    }
    const parentId = config.codeAccount.expenseDepreciation;
    return _.filter((_) => _.parentId === parentId);
  });
}

export function filteringAccountAccumulationDepreciation(accountStore: Readable<Account[]>) {
  const { preferenceStore } = stores.getPreferenceAccountingContext();
  return derived([accountStore, preferenceStore], ([_, config]) => {
    if (!config || !_) {
      return [];
    }
    const parentId = config.codeAccount.accumulationDepreciation;
    return _.filter((_) => _.parentId === parentId);
  });
}

export function filteringAccountPayable(accountStore: Readable<Account[]>) {
  const { preferenceStore } = stores.getPreferenceAccountingContext();
  return derived([accountStore, preferenceStore], ([_, config]) => {
    if (!config || !_) {
      return [];
    }
    const accountsUtils = createAccountUtils(config);
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

export function getBalanceDataAccount(accountId: string | undefined, store: Readable<BalanceData | undefined>) {
  return derived(store, (_) => {
    if (_ && accountId) {
      return _[accountId];
    }
  });
}
