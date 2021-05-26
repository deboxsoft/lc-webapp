import type { TransactionClientService } from "@deboxsoft/accounting-client/types/graphql";
import type { AccountContext, TransactionContext } from "@deboxsoft/accounting-client/types/stores";

import { stores, graphql } from "@deboxsoft/accounting-client";
import { getApplicationContext } from "__@modules/app";

let transactionService: TransactionClientService;

export const getTransactionService = () => {
  if (!transactionService) {
    const appContext = getApplicationContext();
    transactionService = new graphql.TransactionClientService(appContext);
  }
  return transactionService;
};
export const createTransactionContext = (accountContext: AccountContext): TransactionContext => {
  return stores.createTransactionContext({
    transactionService: getTransactionService(),
    accountContext
  });
};

export const getTransactionContext = (): TransactionContext => stores.getTransactionContext();
