import type { GeneralLedgerStoreService } from "@deboxsoft/accounting-client/types/stores";

import { getApplicationContext } from "__@modules/app";
import { stores, graphql } from "@deboxsoft/accounting-client";

export const createGeneralLedgerContext = () => {
  const { fetch, notify, env } = getApplicationContext();
  const generalLedgerService = new graphql.GeneralLedgerGraphqlClient(fetch);
  return stores.createGeneralLedgerStoreService({
    generalLedgerService,
    notify: (env !== "production" && notify) || undefined
  });
};

export const getGeneralLedgerContext = (): GeneralLedgerStoreService => stores.getGeneralLedgerContext();
