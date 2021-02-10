import { getApplicationContext } from "__@modules/app";
import { stores, graphql } from "@deboxsoft/accounting-client";
import { getContext, setContext } from "svelte";
import { derived } from "svelte/store";

const KEY = {};

export const createStockInContext = () => {
  const { fetch, notify } = getApplicationContext();
  const stockTransferService = new graphql.StockTransferGraphqlClient(fetch);
  const context = stores.createStockTransferStoreService({ stockTransferService, notify });
  setContext(KEY, context);
  return context;
};

export const getStockInContext = () => {
  const {
    stockTransferStore,
    createStockIn,
    createStockOut,
    updateStockIn,
    updateStockOut,
    removeStockTransfer,
    findStockTransfer,
    fetchMoreStockTransfer,
    findStockTransferById
  } = getContext<stores.StockTransferStoreService>(KEY);
  return {
    stockTransferStore,
    createStockIn,
    createStockOut,
    updateStockIn,
    updateStockOut,
    removeStockTransfer,
    findStockTransfer,
    fetchMoreStockTransfer,
    findStockTransferById,
    getStock(id: string) {
      return derived(stockTransferStore, ($stockTransferStore = []) => {
        const i = $stockTransferStore.findIndex((_) => _.id === id);
        return $stockTransferStore[i];
      });
    }
  };
};
