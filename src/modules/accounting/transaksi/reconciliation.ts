import type { BankReconciliationStoreService } from "@deboxsoft/accounting-client/types/stores";

import { getApplicationContext } from "__@modules/app";
import { stores, graphql } from "@deboxsoft/accounting-client";

export const createReconciliationContext = () => {
  const { fetch, notify, env } = getApplicationContext();
  const bankReconciliationService = new graphql.BankReconciliationGraphqlClient(fetch);
  return stores.createBankStoreService({
    bankReconciliationService,
    notify: (env !== "production" && notify) || undefined
  });
};

export const getReconciliationContext = (): BankReconciliationStoreService => stores.getBankReconciliationContext();
