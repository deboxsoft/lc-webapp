import type { GraphQLClient, FetchGraphql } from "@deboxsoft/module-graphql";

import { SubscriptionClient } from "graphql-subscriptions-client";
import { createUIContext } from "__@stores/ui";
import { setContext, getContext } from "svelte";
import { createGraphqlClient } from "@deboxsoft/module-client";
import Notify, { Options as NotyOptions, Type as TypeNoty } from "noty";
import { Writable, writable } from "svelte/store";
import { registerAccountingContext } from "./accounting";
import { createAuthenticationContext } from "./users";

type NotifyConfig = Omit<NotyOptions, "text">;
const defaultConfig: Partial<NotifyConfig> = {
  theme: "metroui",
  timeout: 1000
};

export interface ApplicationContext {
  client?: GraphQLClient;
  subscriptionClient: SubscriptionClient;
  fetch: FetchGraphql;
  notify: (message: string, type?: TypeNoty, config?: NotifyConfig) => void;
  loading: Writable<boolean>;
  env?: string;
  uiControl?: any;
}

const APPLICATION_CONTEXT = "ApplicationContext";

const notify = (message: string, type?: TypeNoty, config: NotifyConfig = {}) => {
  new Notify({ ...defaultConfig, ...config, ...{ text: message, type } }).show();
};

export const createBaseApplicationContext = () => {
  let loading = writable(true);
  const { client, fetch } = createGraphqlClient(process.env.DBX_ENV_GRAPHQL_URL || "", {});
  const subscriptionClient = new SubscriptionClient(process.env.DBX_ENV_GRAPHQL_WS);
  const env = process.env.NODE_ENV;
  const uiControl = createUIContext();
  const context: ApplicationContext = { client, fetch, notify, loading, env, uiControl, subscriptionClient };
  setContext<ApplicationContext>(APPLICATION_CONTEXT, context);
  return {
    client,
    fetch,
    notify,
    loading,
    env,
    uiControl,
    subscriptionClient
  };
};

export const createApplicationContext = () => {
  const { loading, fetch, env, notify, subscriptionClient, client, uiControl } = createBaseApplicationContext();
  // register service
  const authenticationContext = createAuthenticationContext({ fetch, notify, env, loading, subscriptionClient });
  const accountingContext = registerAccountingContext({ fetch, notify, env, loading, subscriptionClient });
  authenticationContext.authenticate().then(({ authenticated }) => {
    if (authenticated) {
      accountingContext.load().then(() => {
        loading.update(() => false);
      });
    } else {
      loading.update(() => false);
    }
  });
  return {
    client,
    fetch,
    notify,
    loading,
    env,
    uiControl,
    subscriptionClient
  };
};

export const getApplicationContext = () => {
  return getContext<ApplicationContext>(APPLICATION_CONTEXT);
};
