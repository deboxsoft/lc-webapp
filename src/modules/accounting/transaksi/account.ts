import type { AccountContext, PreferenceAccountingContext } from "@deboxsoft/accounting-client/types/stores";

import { getApplicationContext, ApplicationContext } from "__@modules/app";
import { graphql, stores } from "@deboxsoft/accounting-client";

export const createAccountContext = (
  appContext: ApplicationContext = getApplicationContext(),
  preferenceAccountingContext: PreferenceAccountingContext
) => {
  const accountService = new graphql.AccountGraphqlClient(appContext);
  return stores.createAccountContext({
    accountService,
    preferenceAccountingContext
  });
};

export const getAccountContext = (): AccountContext => {
  return {
    ...stores.getAccountContext()
  };
};
