import { getApplicationContext } from "__@modules/app";
import { stores, graphql } from "@deboxsoft/accounting-client";
import { getContext, setContext } from "svelte";
import { derived } from "svelte/store";

const KEY = {};

export const createReconciliationContext = () => {
  const { fetch, notify, env } = getApplicationContext();
  const bankReconciliationService = new graphql.BankReconciliationGraphqlClient(fetch);
  const store = stores.createBankStoreService({
    bankReconciliationService,
    notify: (env !== "production" && notify) || undefined
  });
  setContext(KEY, store);
  return store;
};

export const getReconciliationContext = () => {
  const {
    bankReconciliationStore,
    createBankReconciliation,
    updateBankReconciliation,
    removeBankReconciliation,
    findBankReconciliation,
    findBankReconciliationById
  } = getContext<stores.BankStoreService>(KEY);
  return {
    bankReconciliationStore,
    createBankReconciliation,
    updateBankReconciliation,
    removeBankReconciliation,
    findBankReconciliation,
    findBankReconciliationById,
    getReconciliation: (id: string) => {
      return derived(bankReconciliationStore, (_reconciliationStore = []) => {
        const i = _reconciliationStore.findIndex((_) => _.id === id);
        return _reconciliationStore[i];
      });
    }
  };
};
