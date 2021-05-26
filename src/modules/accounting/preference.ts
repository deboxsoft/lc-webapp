import type { PreferenceAccountingContext } from "@deboxsoft/accounting-client/types/stores";

import { stores, graphql } from "@deboxsoft/accounting-client";
import { ApplicationContext, getApplicationContext } from "../app";

export const createPreferenceContext = (
  appContext: ApplicationContext = getApplicationContext()
): PreferenceAccountingContext => {
  const preferenceService = new graphql.PreferenceAccountingGraphqlClient(appContext);
  return stores.createPreferenceAccountingContext({
    preferenceService
  });
};

export const getPreferenceContext = (): PreferenceAccountingContext => stores.getPreferenceAccountingContext();
