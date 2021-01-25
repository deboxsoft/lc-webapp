import type { GraphQLClient, FetchGraphql } from "@deboxsoft/module-graphql";

import { setContext, getContext } from "svelte";
import { createGraphqlClient } from "@deboxsoft/module-client";
// import { createUserStore } from "__@modules/users";
import { createAccountContext } from "__@modules/transaksi";

interface ApplicationContext {
  client: GraphQLClient;
  fetch: FetchGraphql;
}

const APPLICATION_CONTEXT = "ApplicationContext";

export const createApplicationContext = () => {
  const { client, fetch } = createGraphqlClient(process.env.DBX_ENV_GRAPHQL_URL || "", {});
  const context: ApplicationContext = { client, fetch };
  setContext<ApplicationContext>(APPLICATION_CONTEXT, context);
  const accountService = createAccountContext(fetch);
  // createUserStore();
  return {
    accountService,
    fetch
  };
};

export const getApplicationContext = () => {
  return getContext<ApplicationContext>(APPLICATION_CONTEXT);
};
