import "./errors-map";
import id from "dayjs/locale/id";
import dayjs from "dayjs";
import { ApisContext, createApisContext } from "@deboxsoft/module-client";
import { stores } from "@deboxsoft/accounting-client";
import { createUIContext } from "__@stores/ui";
import { setContext, getContext } from "svelte";
import Notify, { Options as NotyOptions, Type as TypeNoty } from "noty";
import { Writable, writable } from "svelte/store";
import { registerAccountingContext } from "./accounting";
import { createConfigModule } from "./config";
import { createUsersModuleContext } from "./users";
import { createJwtStore, JwtStore } from "__@stores/jwt";

type NotifyConfig = Omit<NotyOptions, "text">;
dayjs.locale(id);
const defaultConfig: Partial<NotifyConfig> = {
  theme: "metroui",
  timeout: 3000
};

export interface ApplicationContext extends ApisContext {
  apiUrl: string;
  notify: (message: string, type?: TypeNoty, config?: NotifyConfig) => void;
  loading: Writable<boolean>;
  env?: string;
  config?: Writable<any>;
  uiControl?: any;
  jwtStore: JwtStore;
  configPromise: Promise<any>;
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
  const apisContext = createApisContext({
    subscriptionClientOptions: {
      reconnect: true
    },
    // @ts-ignore
    graphqlUrl: DBX_ENV_GRAPHQL_URL || process.env.DBX_ENV_GRAPHQL_URL,
    // @ts-ignore
    graphqlWsUrl: DBX_ENV_GRAPHQL_WS || process.env.DBX_ENV_GRAPHQL_WS
  });
  // jwt
  const jwtStore = createJwtStore();
  // subscribe jwt
  jwtStore.subscribe((_) => {
    if (_) {
      apisContext.addHeader("Authorization", `Bearer ${_}`);
    } else {
      apisContext.addHeader("Authorization", undefined);
      const headers = apisContext.getHeaders();
      delete headers.Authorization;
      apisContext.setHeaders(headers);
    }
  });
  const apiUrl = process.env.DBX_ENV_API_URL || "localhost";
  const env = process.env.NODE_ENV;
  const uiControl = createUIContext();
  loading.set(true);
  // config
  const configPromise = createConfigModule(apisContext.fetchGraphql).then((_) => config.set(_));
  Promise.all([configPromise]).then(() => {
    loading.set(false);
  });
  const context: ApplicationContext = {
    ...apisContext,
    apiUrl,
    notify,
    loading,
    env,
    config,
    uiControl,
    jwtStore,
    configPromise
  };
  setContext<ApplicationContext>(APPLICATION_CONTEXT, context);
  return context;
};

export const createApplicationContext = () => {
  const appContext = createBaseApplicationContext();
  // register service
  const authenticationContext = createUsersModuleContext(appContext);
  const accountingContext = registerAccountingContext(appContext);
  const companyContext = stores.createCompanyContext(appContext);
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
