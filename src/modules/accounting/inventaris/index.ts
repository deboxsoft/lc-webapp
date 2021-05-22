import type { InventoryContext } from "@deboxsoft/accounting-client/types/stores";
import { getApplicationContext } from "__@modules/app";
import { stores, graphql } from "@deboxsoft/accounting-client";

export const createInventoryContext = () => {
  const { fetch, notify } = getApplicationContext();
  const inventoryService = new graphql.InventoryGraphqlClient({ fetch });
  return stores.createInventoryContext({ inventoryService, notify });
};

export const getInventoryContext = (): InventoryContext => stores.getInventoryContext();
