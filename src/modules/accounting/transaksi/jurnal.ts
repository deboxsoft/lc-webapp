import { stores, graphql } from "@deboxsoft/accounting-client";
import { getApplicationContext } from "__@modules/app";
import { getContext, setContext } from "svelte";
import { derived, get } from "svelte/store";

const KEY = {};
export const createTransactionContext = (): stores.TransactionStoreService => {
  const { fetch, notify, env } = getApplicationContext();
  const transactionService = new graphql.TransactionClientService(fetch);

  const store = stores.createTransactionStoreService({
    transactionService,
    notify: (env !== "production" && notify) || undefined
  });
  setContext(KEY, store);
  return store;
};
export const getTransactionContext = () => {
  const {
    transactionStore,
    transactionTypeStore,
    createTransaction,
    fetchTransaction,
    findTransactionType,
    fetchMoreTransaction,
    findTransaction,
    findTransactionById,
    removeTransaction,
    updateTransaction
  } = getContext<stores.TransactionStoreService>(KEY);
  return {
    transactionStore,
    transactionTypeStore,
    createTransaction,
    fetchTransaction,
    findTransactionType,
    fetchMoreTransaction,
    findTransaction,
    findTransactionById,
    removeTransaction,
    updateTransaction,
    getTransaction: (id) => {
      return derived(transactionStore, ($transactionStore) => {
        const i = $transactionStore.findIndex((_) => _.id === id);
        return i && $transactionStore[i];
      });
    },
    getTransactionType: (code: String) => {
      return derived(transactionTypeStore, ($transactionTypeStore) => {
        const i = $transactionTypeStore.findIndex((_) => _.code === code);
        return $transactionTypeStore[i];
      });
    }
  };
};
