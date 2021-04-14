import type { StockTransferContext } from "@deboxsoft/accounting-client/types/stores";

import { getApplicationContext } from "__@modules/app";
import { stores, graphql } from "@deboxsoft/accounting-client";

export const createStockInContext = () => {
  // const { fetch, notify } = getApplicationContext();
  // const stockTransferService = new graphql.StockTransferGraphqlClient({ fetch });
  // return stores.createStockTransferContext({ storeInContext: stockTransferService, notify });
};

export const getStockInContext = (): StockTransferContext => stores.getStockTransferContext();
