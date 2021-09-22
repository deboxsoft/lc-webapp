import type { ApplicationContext } from "./app";
import { stores } from "@deboxsoft/accounting-client";

// initial bootsrap
export const registerAccountingContext = (applicationContext: ApplicationContext) => {
  applicationContext.loading.set(true);
  const preferenceAccountingContext = stores.createPreferenceAccountingContext(applicationContext);
  const accountContext = stores.createAccountContext({
    preferenceAccountingContext,
    ...applicationContext
  });
  accountContext.subscribe();
  stores.createTransactionContext({ accountContext, ...applicationContext });
  return {
    load: () => {
      const preferenceLoad = preferenceAccountingContext.load();
      const accountLoad = accountContext.load();
      return Promise.all([preferenceLoad, accountLoad]).then(() => {
        applicationContext.loading.set(false);
      });
    }
  };
};
