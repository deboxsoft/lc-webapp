import type { StockTransferStoreService } from "@deboxsoft/accounting-client/types/stores";

import { getApplicationContext } from "__@modules/app";
import { stores, graphql } from "@deboxsoft/accounting-client";

export const createStockInContext = () => {
  const { fetch, notify } = getApplicationContext();
  const stockTransferService = new graphql.StockTransferGraphqlClient(fetch);
  return stores.createStockTransferStoreService({ stockTransferService, notify });
};

export const getStockInContext = (): StockTransferStoreService => stores.getStockTransferContext();
