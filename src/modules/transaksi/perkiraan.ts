import type { FetchGraphql } from "@deboxsoft/module-graphql";

import { stores, graphql } from "@deboxsoft/accounting-client";
import { getContext, setContext } from "svelte";
import { derived } from "svelte/store";

const KEY = {};
export const createAccountContext = (fetch: FetchGraphql) => {
  const accountService = new graphql.AccountClientService(fetch);
  const store = stores.createAccountStoreService({ accountService });
  setContext(KEY, store);
  return store;
};

export const getAccountContext = () => {
  const {
    getAccountType,
    accountTypeList,
    accountStore,
    removeAccount,
    updateAccount,
    createAccount,
    findAccount,
    findAccountById
  } = getContext<stores.AccountStoreService>(KEY);
  return {
    getAccountType,
    accountTypeList,
    accountStore,
    removeAccount,
    updateAccount,
    createAccount,
    findAccount,
    findAccountById,
    getAccount(id: string) {
      return derived(accountStore, ($store) => {
        let account;
        $store.some((_) => {
          if (id === _.id) {
            account = _;
            return true;
          }
          return false;
        });
        return account;
      });
    }
  };
};
