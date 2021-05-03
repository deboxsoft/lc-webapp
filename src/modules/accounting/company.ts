import { graphql, stores } from "@deboxsoft/accounting-client";
import type { CompanyContext } from "@deboxsoft/accounting-client/types/stores";
import { ApplicationContext, getApplicationContext } from "../app";

export const createCompanyContext = (
  { fetch, notify, env, subscriptionClient }: ApplicationContext = getApplicationContext()
): CompanyContext => {
  const companyService = new graphql.CompanyGraphqlClient({ fetch, subscriptionClient });
  return stores.createCompanyContext({
    companyService,
    notify: (env !== "production" && notify) || undefined
  });
};

export const getCompanyContext = (): CompanyContext => stores.getCompanyContext();
