import { getApplicationContext } from "__@modules/app";
import { stores, graphql } from "@deboxsoft/accounting-client";
import { getContext, setContext } from "svelte";
import { derived } from "svelte/store";

const KEY = {};
let store;
export const createInventoryContext = () => {
  const { fetch, notify } = getApplicationContext();
  const inventoryService = new graphql.InventoryGraphqlClient(fetch);
  store = store || stores.createInventoryStoreService({ inventoryService, notify });
  setContext(KEY, store);
  return store;
};

export const getInventoryContext = () => {
  const {
    inventoryStore,
    createInventory,
    updateInventory,
    removeInventory,
    findInventory,
    findInventoryById,
    fetchMoreInventory
  } = getContext<stores.InventoryStoreService>(KEY);
  return {
    inventoryStore,
    createInventory,
    updateInventory,
    removeInventory,
    findInventory,
    findInventoryById,
    fetchMoreInventory,
    getInventory(id: string) {
      return derived(inventoryStore, ($inventoryStore = []) => {
        const i = $inventoryStore.findIndex((_) => _.id === id);
        return $inventoryStore[i];
      });
    }
  };
};
