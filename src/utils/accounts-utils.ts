import { stores } from "@deboxsoft/accounting-client";
import { derived, get, Readable } from "svelte/store";
import type { Account } from "@deboxsoft/accounting-api";
import { getAuthenticationContext } from "__@modules/users";

const codeAccount = {
  bdd: "1050100",
  expenseAmortization: "5040100",
  accumulationAmortization: "1050200",
  inventory: "1110100",
  expenseDepreciation: "5050100",
  accumulationDepreciation: "1120100"
};

const codeAccountList = Object.values(codeAccount);

function excludeCodeAccount(account: Account) {
  return !codeAccountList.includes(account.parentId);
}

export function filteringAccountDebit(accountStore: Readable<Account[]>) {
  const { authenticationStore } = getAuthenticationContext();
  let accountsIdDebit = get(authenticationStore).metadata?.includeAccounts;
  return derived(accountStore, (_) => {
    return _.filter((_) => {
      if (/^[^4].*/g.test(_.id)) {
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
  let accountsIdCredit = get(authenticationStore).metadata?.includeAccounts;
  return derived(accountStore, (_) => {
    return _.filter((_) => {
      if (/^[^5].*/g.test(_.id)) {
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
  let includeAccounts = get(authenticationStore).metadata?.includeAccounts;
  return derived(accountStore, (_) => {
    return _.filter((_) => {
      if (/^(101).*/g.test(_.id)) {
        if (!includeAccounts || includeAccounts.includes(_.id)) {
          return excludeCodeAccount(_);
        }
      }
      return false;
    });
  });
}

export function filteringAccountExpense(accountStore: Readable<Account[]>) {
  return derived(accountStore, (_) => {
    return _.filter((_) => {
      if (/^(5).*/g.test(_.id)) {
      }
      return excludeCodeAccount(_);
    });
  });
}

export function filteringAccountRevenue(accountStore: Readable<Account[]>) {
  const { authenticationStore } = getAuthenticationContext();
  let includeAccounts = get(authenticationStore).metadata?.includeAccounts;
  return derived(accountStore, (_) => {
    return _.filter((_) => {
      if (/^(4).*/g.test(_.id)) {
        if (!includeAccounts || includeAccounts.includes(_.id)) {
          return excludeCodeAccount(_);
        }
      }
      return false;
    });
  });
}

export function filteringAccountStock(accountStore: Readable<Account[]>) {
  const { preferenceStore } = stores.getPreferenceAccountingContext();
  const config = get(preferenceStore);
  const regex = new RegExp(`^(${config.codeAccount.stock}).*`, "g");
  return derived(accountStore, (_) => _.filter((_) => regex.test(_.id)));
}

export function filteringAccountBdd(accountStore: Readable<Account[]>) {
  const { preferenceStore } = stores.getPreferenceAccountingContext();
  const config = get(preferenceStore);
  const regex = new RegExp(`^(${config.codeAccount.bdd}).*`, "g");
  return derived(accountStore, (_) => _.filter((_) => regex.test(_.id)));
}

export function filteringAccountExpenseAmortization(accountStore: Readable<Account[]>) {
  const { preferenceStore } = stores.getPreferenceAccountingContext();
  const config = get(preferenceStore);
  const regex = new RegExp(`^(${config.codeAccount.expenseAmortization}).*`, "g");
  return derived(accountStore, (_) => _.filter((_) => regex.test(_.id)));
}

export function filteringAccountAccumulationAmortization(accountStore: Readable<Account[]>) {
  const { preferenceStore } = stores.getPreferenceAccountingContext();
  const config = get(preferenceStore);
  const regex = new RegExp(`^(${config.codeAccount.accumulationAmortization}).*`, "g");
  return derived(accountStore, (_) => _.filter((_) => regex.test(_.id)));
}

export function filteringAccountInventory(accountStore: Readable<Account[]>) {
  const { preferenceStore } = stores.getPreferenceAccountingContext();
  const config = get(preferenceStore);
  const regex = new RegExp(`^(${config.codeAccount.inventory}).*`, "g");
  return derived(accountStore, (_) => _.filter((_) => regex.test(_.id)));
}

export function filteringAccountExpenseDepreciation(accountStore: Readable<Account[]>) {
  const { preferenceStore } = stores.getPreferenceAccountingContext();
  const config = get(preferenceStore);
  const regex = new RegExp(`^(${config.codeAccount.expenseDepreciation}).*`, "g");
  return derived(accountStore, (_) => _.filter((_) => regex.test(_.id)));
}

export function filteringAccountAccumulationDepreciation(accountStore: Readable<Account[]>) {
  const { preferenceStore } = stores.getPreferenceAccountingContext();
  const config = get(preferenceStore);
  const regex = new RegExp(`^(${config.codeAccount.accumulationDepreciation}).*`, "g");
  return derived(accountStore, (_) => _.filter((_) => regex.test(_.id)));
}
