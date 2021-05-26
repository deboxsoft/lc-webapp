import { graphql, stores } from "@deboxsoft/accounting-client";
import type { CompanyContext } from "@deboxsoft/accounting-client/types/stores";
import { ApplicationContext, getApplicationContext } from "../app";

export const createCompanyContext = (appContext: ApplicationContext = getApplicationContext()): CompanyContext => {
  const companyService = new graphql.CompanyGraphqlClient(appContext);
  return stores.createCompanyContext({
    companyService
  });
};

export const getCompanyContext = (): CompanyContext => stores.getCompanyContext();
