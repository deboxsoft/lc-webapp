import type { PreferenceAccountingContext } from "@deboxsoft/accounting-client/types/stores";

import { stores, graphql } from "@deboxsoft/accounting-client";
import { ApplicationContext, getApplicationContext } from "../app";

export const createPreferenceContext = (
  { fetch, notify, env, subscriptionClient }: ApplicationContext = getApplicationContext()
): stores.PreferenceAccountingContext => {
  const preferenceService = new graphql.PreferenceAccountingGraphqlClient({ fetch, subscriptionClient });
  return stores.createPreferenceAccountingContext({
    preferenceService,
    notify: (env !== "production" && notify) || undefined
  });
};

export const getPreferenceContext = (): PreferenceAccountingContext => stores.getPreferenceAccountingContext();
