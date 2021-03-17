import type { AccountStoreService } from "@deboxsoft/accounting-client/types/stores";
import type { ApplicationContext } from "__@modules/app";

import { graphql, stores } from "@deboxsoft/accounting-client";

export const createAccountContext = ({ fetch, notify, env }: ApplicationContext) => {
  const accountService = new graphql.AccountGraphqlClient(fetch);
  return stores.createAccountStoreService({
    accountService,
    notify: (env !== "production" && notify) || undefined
  });
};

export const getAccountContext = (): AccountStoreService => stores.getAccountContext();
