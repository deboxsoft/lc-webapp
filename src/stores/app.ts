import type { GraphQLClient, FetchGraphql } from "@deboxsoft/module-graphql";

import { setContext, getContext } from "svelte";
import { createGraphqlClient } from "@deboxsoft/module-client";

interface ApplicationContext {
  client: GraphQLClient;
  fetch: FetchGraphql;
}

const { client, fetch } = createGraphqlClient(process.env.DBX_ENV_GRAPHQL_URL || "", {});
const APPLICATION_CONTEXT = "ApplicationContext";

export const createContextApplication = () => {
  setContext<ApplicationContext>(APPLICATION_CONTEXT, { client, fetch });
};

export const getContextApplication = () => {
  return getContext<ApplicationContext>(APPLICATION_CONTEXT);
};
