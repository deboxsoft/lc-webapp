import type { TransactionClientService } from "@deboxsoft/accounting-client/types/graphql";
import type { TransactionContext } from "@deboxsoft/accounting-client/types/stores";

import { stores, graphql } from "@deboxsoft/accounting-client";
import { getApplicationContext } from "__@modules/app";

let transactionService: TransactionClientService;

export const getTransactionService = () => {
  if (!transactionService) {
    const { fetch } = getApplicationContext();
    transactionService = new graphql.TransactionClientService({ fetch });
  }
  return transactionService;
};
export const createTransactionContext = (): TransactionContext => {
  const { env, notify } = getApplicationContext();
  return stores.createTransactionContext({
    transactionService: getTransactionService(),
    notify: (env !== "production" && notify) || undefined
  });
};

export const getTransactionContext = (): TransactionContext => stores.getTransactionContext();