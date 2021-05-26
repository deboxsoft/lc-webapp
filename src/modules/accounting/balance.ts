import type { BalanceContext } from "@deboxsoft/accounting-client/types/stores";

import { stores, graphql } from "@deboxsoft/accounting-client";
import { getApplicationContext } from "../app";

let generalLedgerService;
export const createBalanceContext = () => {
  const appContext = getApplicationContext();
  if (!generalLedgerService) {
    generalLedgerService = new graphql.GeneralLedgerGraphqlClient(appContext);
  }
  return stores.createBalanceStoreService({
    generalLedgerService
  });
};

export const getBalanceContext = (): BalanceContext => stores.getBalanceContext();
