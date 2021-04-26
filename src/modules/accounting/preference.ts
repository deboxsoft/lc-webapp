import type { PreferenceAccountingContext, CompanyContext } from "@deboxsoft/accounting-client/types/stores";

import { stores, graphql } from "@deboxsoft/accounting-client";
import { ApplicationContext, getApplicationContext } from "../app";

type PreferenceContext = PreferenceAccountingContext & CompanyContext;

export const createPreferenceContext = (
  { fetch, notify, env, subscriptionClient }: ApplicationContext = getApplicationContext()
): PreferenceContext => {
  const preferenceService = new graphql.PreferenceAccountingGraphqlClient({ fetch, subscriptionClient });
  const companyService = new graphql.CompanyGraphqlClient({ fetch, subscriptionClient });
  const preferenceAccountingContext = stores.createPreferenceAccountingContext({
    preferenceService,
    notify: (env !== "production" && notify) || undefined
  });
  const companyContext = stores.createCompanyContext({ companyService, notify });
  return {
    ...preferenceAccountingContext,
    ...companyContext
  };
};

export const getPreferenceContext = (): PreferenceContext => {
  const preferenceAccountingContext = stores.getPreferenceAccountingContext();
  const companyContext = stores.getCompanyContext();
  return {
    ...preferenceAccountingContext,
    ...companyContext
  };
};
