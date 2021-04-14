import type { BalanceContext } from "@deboxsoft/accounting-client/types/stores";

import { stores, graphql } from "@deboxsoft/accounting-client";
import { getApplicationContext } from "../app";

let generalLedgerService;
export const createBalanceContext = () => {
  const { fetch, env, notify } = getApplicationContext();
  if (!generalLedgerService) {
    generalLedgerService = new graphql.GeneralLedgerGraphqlClient({ fetch });
  }
  return stores.createBalanceStoreService({
    generalLedgerService,
    notify: (env !== "production" && notify) || undefined
  });
};

export const getBalanceContext = (): BalanceContext => stores.getBalanceContext();
