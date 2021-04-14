import type { AccountContext, PreferenceAccountingContext } from "@deboxsoft/accounting-client/types/stores";

import { getApplicationContext, ApplicationContext } from "__@modules/app";
import { graphql, stores } from "@deboxsoft/accounting-client";

export const createAccountContext = (
  { fetch, notify, env, subscriptionClient }: ApplicationContext = getApplicationContext(),
  preferenceAccountingContext: PreferenceAccountingContext
) => {
  const accountService = new graphql.AccountGraphqlClient({ fetch });
  return stores.createAccountContext({
    accountService,
    notify: (env !== "production" && notify) || undefined,
    preferenceAccountingContext
  });
};

export const getAccountContext = (): AccountContext => {
  return {
    ...stores.getAccountContext()
  };
};
