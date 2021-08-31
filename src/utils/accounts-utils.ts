import { derived, get, Readable } from "svelte/store";
import type { Account } from "@deboxsoft/accounting-api";
import { getAuthenticationContext } from "__@modules/users";

export function filteringAccountDebit(accountStore: Readable<Account[]>) {
  const { authenticationStore } = getAuthenticationContext();
  let accountsIdDebit = get(authenticationStore).metadata?.includeAccounts;
  return derived(accountStore, (_) => {
    return _.filter((_) => {
      if (/^[^4].*/g.test(_.id)) {
        if (!accountsIdDebit || accountsIdDebit.includes(_.id)) {
          return true;
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
          return true;
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
          return true;
        }
      }
      return false;
    });
  });
}

export function filteringAccountExpense(accountStore: Readable<Account[]>) {
  const { authenticationStore } = getAuthenticationContext();
  let includeAccounts = get(authenticationStore).metadata?.includeAccounts;
  return derived(accountStore, (_) => {
    return _.filter((_) => {
      if (/^(5).*/g.test(_.id)) {
        if (!includeAccounts || includeAccounts.includes(_.id)) {
          return true;
        }
      }
      return false;
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
          return true;
        }
      }
      return false;
    });
  });
}

export function filteringAccountStock(accountStore: Readable<Account[]>) {
  const { authenticationStore } = getAuthenticationContext();
  let includeAccounts = get(authenticationStore).metadata?.includeAccounts;
  return derived(accountStore, (_) => {
    return _.filter((_) => {
      if (/^(103).*/g.test(_.id)) {
        if (!includeAccounts || includeAccounts.includes(_.id)) {
          return true;
        }
      }
      return false;
    });
  });
}

export function filteringAccountBdd(accountStore: Readable<Account[]>) {
  const { authenticationStore } = getAuthenticationContext();
  let includeAccounts = get(authenticationStore).metadata?.includeAccounts;
  return derived(accountStore, (_) => {
    return _.filter((_) => {
      if (/^(104).*/g.test(_.id)) {
        if (!includeAccounts || includeAccounts.includes(_.id)) {
          return true;
        }
      }
      return false;
    });
  });
}

export function filteringAccountExpenseBdd(accountStore: Readable<Account[]>) {
  const { authenticationStore } = getAuthenticationContext();
  let includeAccounts = get(authenticationStore).metadata?.includeAccounts;
  return derived(accountStore, (_) => {
    return _.filter((_) => {
      if (/^(105100).*/g.test(_.id)) {
        if (!includeAccounts || includeAccounts.includes(_.id)) {
          return true;
        }
      }
      return false;
    });
  });
}

export function filteringAccountAccumulationBdd(accountStore: Readable<Account[]>) {
  const { authenticationStore } = getAuthenticationContext();
  let includeAccounts = get(authenticationStore).metadata?.includeAccounts;
  return derived(accountStore, (_) => {
    return _.filter((_) => {
      if (/^(10502).*/g.test(_.id)) {
        if (!includeAccounts || includeAccounts.includes(_.id)) {
          return true;
        }
      }
      return false;
    });
  });
}

export function filteringAccountInventory(accountStore: Readable<Account[]>) {
  const { authenticationStore } = getAuthenticationContext();
  let includeAccounts = get(authenticationStore).metadata?.includeAccounts;
  return derived(accountStore, (_) => {
    return _.filter((_) => {
      if (/^(111|113).*/g.test(_.id)) {
        if (!includeAccounts || includeAccounts.includes(_.id)) {
          return true;
        }
      }
      return false;
    });
  });
}

export function filteringAccountAccumulationDepreciation(accountStore: Readable<Account[]>) {
  const { authenticationStore } = getAuthenticationContext();
  let includeAccounts = get(authenticationStore).metadata?.includeAccounts;
  return derived(accountStore, (_) => {
    return _.filter((_) => {
      if (/^(112).*/g.test(_.id)) {
        if (!includeAccounts || includeAccounts.includes(_.id)) {
          return true;
        }
      }
      return false;
    });
  });
}
