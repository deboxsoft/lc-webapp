import type { ApplicationContext } from "__@modules/app";

import { stores, graphql } from "@deboxsoft/accounting-client";
import { getContext, setContext } from "svelte";
import { derived, get } from "svelte/store";

const KEY = {};
export const createAccountContext = ({ fetch, notify, env }: ApplicationContext) => {
  const accountService = new graphql.AccountGraphqlClient(fetch);
  const store = stores.createAccountStoreService({
    accountService,
    notify: (env !== "production" && notify) || undefined
  });
  setContext(KEY, store);
  return store;
};

export const getAccountContext = () => {
  const {
    accountTypeStore,
    accountStore,
    fetchAccount,
    findAccountType,
    removeAccount,
    updateAccount,
    createAccount,
    findAccount,
    findAccountById
  } = getContext<stores.AccountStoreService>(KEY);
  return {
    accountTypeStore,
    accountStore,
    fetchAccount,
    findAccountType,
    removeAccount,
    updateAccount,
    createAccount,
    findAccount,
    findAccountById,
    getAccount: (id: string) => {
      return derived(accountStore, ($store = []) => {
        const i = $store.findIndex((_) => _.id === id);
        return $store[i] || {};
      });
    },
    getAccountByCode: (code: string) => {
      return derived(accountStore, ($store = []) => {
        const i = $store.findIndex((_) => _.code === code);
        return $store[i] || {};
      });
    },
    getAccountType: (code: string) => {
      const accountTypeList = get(accountTypeStore);
      const i = accountTypeList.findIndex((_) => _.code === code);
      return accountTypeList[i] || {};
    }
  };
};
