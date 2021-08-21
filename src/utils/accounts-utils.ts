import { derived, get, Readable } from "svelte/store";
import type { Account } from "@deboxsoft/accounting-api";
import { getAuthenticationContext } from "__@modules/users";

export function filteringAccountDebit(accountStore: Readable<Account[]>) {
  const { authenticationStore } = getAuthenticationContext();
  let accountsIdDebit = get(authenticationStore).metadata?.debitAccounts;
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
  let accountsIdCredit = get(authenticationStore).metadata?.creditAccounts;
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
  let accountsInclude = get(authenticationStore).metadata?.accountsInclude;
  return derived(accountStore, (_) => {
    return _.filter((_) => {
      if (/^(101).*/g.test(_.id)) {
        if (!accountsInclude || accountsInclude.includes(_.id)) {
          return true;
        }
      }
      return false;
    });
  });
}

export function filteringAccountExpense(accountStore: Readable<Account[]>) {
  const { authenticationStore } = getAuthenticationContext();
  let accountsInclude = get(authenticationStore).metadata?.accountsInclude;
  return derived(accountStore, (_) => {
    return _.filter((_) => {
      if (/^(5).*/g.test(_.id)) {
        if (!accountsInclude || accountsInclude.includes(_.id)) {
          return true;
        }
      }
      return false;
    });
  });
}

export function filteringAccountRevenue(accountStore: Readable<Account[]>) {
  const { authenticationStore } = getAuthenticationContext();
  let accountsInclude = get(authenticationStore).metadata?.accountsInclude;
  return derived(accountStore, (_) => {
    return _.filter((_) => {
      if (/^(4).*/g.test(_.id)) {
        if (!accountsInclude || accountsInclude.includes(_.id)) {
          return true;
        }
      }
      return false;
    });
  });
}
