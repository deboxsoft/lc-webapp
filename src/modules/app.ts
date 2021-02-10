import type { GraphQLClient, FetchGraphql } from "@deboxsoft/module-graphql";

import { setContext, getContext, tick } from "svelte";
import { createGraphqlClient } from "@deboxsoft/module-client";
import Notify, { Options as NotyOptions, Type as TypeNoty } from "noty";
// import { createUserStore } from "__@modules/users";
import { createAccountContext } from "__@modules/accounting";
import { Writable, writable } from "svelte/store";

type NotifyConfig = Omit<NotyOptions, "text">;
const defaultConfig: Partial<NotifyConfig> = {
  theme: "metroui",
  timeout: 1000
};

export interface ApplicationContext {
  client?: GraphQLClient;
  fetch: FetchGraphql;
  notify: (message: string, type?: TypeNoty, config?: NotifyConfig) => void;
  loading: Writable<boolean>;
  env?: string;
}

const APPLICATION_CONTEXT = "ApplicationContext";

const notify = (message: string, type?: TypeNoty, config: NotifyConfig = {}) => {
  new Notify({ ...defaultConfig, ...config, ...{ text: message, type } }).show();
};

export const createApplicationContext = () => {
  let loading = writable(true);
  const { client, fetch } = createGraphqlClient(process.env.DBX_ENV_GRAPHQL_URL || "", {});
  const context: ApplicationContext = { client, fetch, notify, loading, env: process.env.NODE_ENV };
  setContext<ApplicationContext>(APPLICATION_CONTEXT, context);
  const accountService = createAccountContext(context);
  const fetchAccounting = accountService.fetchAccount();
  // createUserStore();
  return Promise.all([fetchAccounting]).then(() => {
    loading.update(() => false);
  });
};

export const getApplicationContext = () => {
  return getContext<ApplicationContext>(APPLICATION_CONTEXT);
};
