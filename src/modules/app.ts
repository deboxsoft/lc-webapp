import type { GraphQLClient, FetchGraphql } from "@deboxsoft/module-graphql";

import "./errors-map";
import fetch from "cross-fetch";
import { SubscriptionClient } from "graphql-subscriptions-client";
import { createUIContext } from "__@stores/ui";
import { setContext, getContext } from "svelte";
import { createGraphqlClient } from "@deboxsoft/module-client";
import Notify, { Options as NotyOptions, Type as TypeNoty } from "noty";
import { Writable, writable } from "svelte/store";
import { registerAccountingContext, createCompanyContext } from "./accounting";
import { createConfigModule } from "./config";
import { createAuthenticationContext } from "./users";

type NotifyConfig = Omit<NotyOptions, "text">;
const defaultConfig: Partial<NotifyConfig> = {
  theme: "metroui",
  timeout: 1000
};

export interface ApplicationContext {
  client?: GraphQLClient;
  fetchGraphqlWS: SubscriptionClient;
  fetch: typeof fetch;
  fetchGraphql: FetchGraphql;
  apiUrl: string;
  notify: (message: string, type?: TypeNoty, config?: NotifyConfig) => void;
  loading: Writable<boolean>;
  env?: string;
  config?: Writable<any>;
  uiControl?: any;
}

const APPLICATION_CONTEXT = "ApplicationContext";

const notify = (message: string, type?: TypeNoty, config: NotifyConfig = {}) => {
  new Notify({ ...defaultConfig, ...config, ...{ text: message, type } }).show();
};

export const createBaseApplicationContext = () => {
  // let loadingStore = writable(true);
  const createLoadingStore = () => {
    let countLoading = 0;
    const { subscribe, set, update } = writable(true);
    return {
      subscribe,
      update,
      set: (val) => {
        let prev;
        subscribe((_) => {
          prev = _;
        });
        if (val) {
          countLoading++;
          if (!prev) {
            set(true);
          }
        } else {
          countLoading = countLoading > 0 ? countLoading - 1 : 0;
          if (prev && countLoading === 0) {
            set(false);
          }
        }
      }
    };
  };
  const loading = createLoadingStore();
  const config = writable({});
  const { client, fetch: fetchGraphql } = createGraphqlClient(process.env.DBX_ENV_GRAPHQL_URL || "", {});
  const fetchGraphqlWS = new SubscriptionClient(process.env.DBX_ENV_GRAPHQL_WS);
  const apiUrl = process.env.DBX_ENV_API_URL || "localhost";
  const env = process.env.NODE_ENV;
  const uiControl = createUIContext();
  loading.set(true);
  const configPromise = createConfigModule(fetchGraphql).then((_) => config.set(_));
  Promise.all([configPromise]).then(() => {
    loading.set(false);
  });
  const context: ApplicationContext = {
    client,
    fetch,
    fetchGraphql,
    fetchGraphqlWS,
    apiUrl,
    notify,
    loading,
    env,
    config,
    uiControl
  };
  setContext<ApplicationContext>(APPLICATION_CONTEXT, context);
  return {
    client,
    fetch,
    fetchGraphql,
    fetchGraphqlWS,
    apiUrl,
    notify,
    loading,
    env,
    config,
    uiControl
  };
};

export const createApplicationContext = () => {
  const appContext = createBaseApplicationContext();
  // register service
  const authenticationContext = createAuthenticationContext(appContext);
  const accountingContext = registerAccountingContext(appContext);
  const companyContext = createCompanyContext(appContext);
  return {
    ...appContext,
    accountingContext,
    authenticationContext,
    companyContext
  };
};

export const getApplicationContext = () => {
  return getContext<ApplicationContext>(APPLICATION_CONTEXT);
};
