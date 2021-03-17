import type { GeneralLedgerStoreService } from "@deboxsoft/accounting-client/types/stores";

import { stores, graphql } from "@deboxsoft/accounting-client";

export const createGeneralLedgerContext = ({ fetch, notify, env }) => {
  const generalLedgerService = new graphql.GeneralLedgerGraphqlClient(fetch);
  return stores.createGeneralLedgerStoreService({
    generalLedgerService,
    notify: (env !== "production" && notify) || undefined
  });
};

export const getGeneralLedgerContext = (): GeneralLedgerStoreService => stores.getGeneralLedgerContext();
