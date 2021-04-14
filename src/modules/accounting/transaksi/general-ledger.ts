import type { GeneralLedgerContext } from "@deboxsoft/accounting-client/types/stores";

import { ApplicationContext, getApplicationContext } from "__@modules/app";
import { stores, graphql } from "@deboxsoft/accounting-client";

export const createGeneralLedgerContext = (
  { fetch, notify, env, subscriptionClient }: ApplicationContext = getApplicationContext()
): GeneralLedgerContext => {
  const generalLedgerService = new graphql.GeneralLedgerGraphqlClient({ fetch });
  return stores.createGeneralLedgerStoreService({
    generalLedgerService,
    notify: (env !== "production" && notify) || undefined
  });
};

export const getGeneralLedgerContext = (): GeneralLedgerContext => stores.getGeneralLedgerContext();
