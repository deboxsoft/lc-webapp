import { stores, graphql } from "@deboxsoft/accounting-client";
import { getTransactionType as _getTransactionType, TRANSACTION_TYPE } from "@deboxsoft/accounting-api";
import { getApplicationContext } from "__@stores/app";
import { getContext, setContext } from "svelte";

const KEY = {};
export const createTransactionContext = (): stores.TransactionStoreService => {
  const { fetch } = getApplicationContext();
  const transactionService = new graphql.TransactionClientService(fetch);

  const store = stores.createTransactionStoreService({ transactionService });
  setContext(KEY, store);
  return store;
};
export const getTransactionContext = () => {
  const {
    transactionStore,
    createTransaction,
    fetchMoreTransaction,
    findTransaction,
    findTransactionById,
    removeTransaction,
    updateTransaction
  } = getContext<stores.TransactionStoreService>(KEY);
  return {
    transactionStore,
    createTransaction,
    fetchMoreTransaction,
    findTransaction,
    findTransactionById,
    removeTransaction,
    updateTransaction,
    getTransactionTypeList: () => Object.entries(TRANSACTION_TYPE),
    getTransactionType: (key?: keyof typeof TRANSACTION_TYPE) => key && _getTransactionType(key)
  };
};
