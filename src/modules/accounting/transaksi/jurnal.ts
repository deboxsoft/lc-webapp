import { stores, graphql } from "@deboxsoft/accounting-client";
import { getApplicationContext } from "__@modules/app";
import { getContext, setContext } from "svelte";
import { get } from "svelte/store";

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
    getTransactionType: (code: String) => {
      const transactionTypeList = get(transactionTypeStore);
      const i = transactionTypeList.findIndex((_) => _.code === code);
      return transactionTypeList[i];
    }
  };
};
