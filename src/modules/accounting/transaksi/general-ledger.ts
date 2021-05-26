import type { GeneralLedgerContext } from "@deboxsoft/accounting-client/types/stores";

import { ApplicationContext, getApplicationContext } from "__@modules/app";
import { stores, graphql } from "@deboxsoft/accounting-client";

export const createGeneralLedgerContext = (
  appContext: ApplicationContext = getApplicationContext()
): GeneralLedgerContext => {
  const generalLedgerService = new graphql.GeneralLedgerGraphqlClient(appContext);
  return stores.createGeneralLedgerStoreService({
    generalLedgerService
  });
};

export const getGeneralLedgerContext = (): GeneralLedgerContext => stores.getGeneralLedgerContext();
