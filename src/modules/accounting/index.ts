import type { ApplicationContext } from "../app";
import { createPreferenceContext } from "./preference";
import { createAccountContext } from "./transaksi";

export * from "./amortisasi";
export * from "./inventaris";
export * from "./pelaporan";
export * from "./balance";
export * from "./transaksi";
export * from "./persediaan";
export * from "./preference";
export * from "./company";

// initial bootsrap
export const registerAccountingContext = (applicationContext: ApplicationContext) => {
  const preferenceAccountingContext = createPreferenceContext(applicationContext);
  const accountContext = createAccountContext(applicationContext, preferenceAccountingContext);
  return {
    load: () => {
      const preferenceLoad = preferenceAccountingContext.load();
      const accountLoad = accountContext.load();
      return Promise.all([preferenceLoad, accountLoad]).then(() => {});
    }
  };
};
