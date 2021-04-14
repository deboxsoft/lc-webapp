import type { BankReconciliationContext } from "@deboxsoft/accounting-client/types/stores";

import { ApplicationContext, getApplicationContext } from "__@modules/app";
import { stores, graphql } from "@deboxsoft/accounting-client";

export const createReconciliationContext = (
  { fetch, notify, env, subscriptionClient }: ApplicationContext = getApplicationContext()
) => {
  const bankReconciliationService = new graphql.BankReconciliationGraphqlClient({
    fetch,
    subscriptionClient
  });
  return stores.createBankStoreContext({
    bankReconciliationService,
    notify: (env !== "production" && notify) || undefined
  });
};

export const getReconciliationContext = (): BankReconciliationContext => stores.getBankReconciliationContext();
