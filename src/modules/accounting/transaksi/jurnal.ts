import type { TransactionStoreService } from "@deboxsoft/accounting-client/types/stores";

import { stores, graphql } from "@deboxsoft/accounting-client";
import { getApplicationContext } from "__@modules/app";

export const createTransactionContext = (): stores.TransactionStoreService => {
  const { fetch, notify, env } = getApplicationContext();
  const transactionService = new graphql.TransactionClientService(fetch);

  return stores.createTransactionStoreService({
    transactionService,
    notify: (env !== "production" && notify) || undefined
  });
};
export const getTransactionContext = (): TransactionStoreService => stores.getTransactionContext();
