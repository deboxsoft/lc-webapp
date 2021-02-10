import { getApplicationContext } from "__@modules/app";
import { stores, graphql } from "@deboxsoft/accounting-client";
import { getContext, setContext } from "svelte";

const KEY = {};

export const createGeneralLedgerContext = () => {
  const { fetch, notify, env } = getApplicationContext();
  const generalLedgerService = new graphql.GeneralLedgerGraphqlClient(fetch);
  const store = stores.createGeneralLedgerStoreService({
    generalLedgerService,
    notify: (env !== "production" && notify) || undefined
  });
  setContext(KEY, store);
  return store;
};

export const getGeneralLedgerContext = () => {
  const {
    generalLedgerStore,
    fetchMoreGeneralLedger,
    findGeneralLedger
  } = getContext<stores.GeneralLedgerStoreService>(KEY);
  return {
    generalLedgerStore,
    fetchMoreGeneralLedger,
    findGeneralLedger
  };
};
