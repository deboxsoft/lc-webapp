import type { GraphQLClient, FetchGraphql } from "@deboxsoft/module-graphql";

import { setContext, getContext } from "svelte";
import { createGraphqlClient } from "@deboxsoft/module-client";
import Notify, { Options as NotyOptions, Type as TypeNoty } from "noty";
import { Writable, writable } from "svelte/store";
import { createAccountContext, createGeneralLedgerContext } from "./accounting";

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
  const env = process.env.NODE_ENV;
  const context: ApplicationContext = { client, fetch, notify, loading, env };
  setContext<ApplicationContext>(APPLICATION_CONTEXT, context);
  // register service
  const accountService = createAccountContext({ fetch, notify, env, loading });
  createGeneralLedgerContext({ fetch, notify, env });
  const fetchAccounting = accountService.load();
  return Promise.all([fetchAccounting]).then(() => {
    loading.update(() => false);
  });
};

export const getApplicationContext = () => {
  return getContext<ApplicationContext>(APPLICATION_CONTEXT);
};
