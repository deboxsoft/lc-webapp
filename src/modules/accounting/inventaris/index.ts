import type { InventoryContext } from "@deboxsoft/accounting-client/types/stores";
import { getApplicationContext } from "__@modules/app";
import { stores, graphql } from "@deboxsoft/accounting-client";

export const createInventoryContext = () => {
  const appContext = getApplicationContext();
  const inventoryService = new graphql.InventoryGraphqlClient(appContext);
  return stores.createInventoryContext({ inventoryService });
};

export const getInventoryContext = (): InventoryContext => stores.getInventoryContext();
