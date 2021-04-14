import type { ApplicationContext } from "../app";
import { createPreferenceContext } from "./preference-accounting";
import { createAccountContext } from "./transaksi";

export * from "./amortisasi";
export * from "./inventaris";
export * from "./pelaporan";
export * from "./balance";
export * from "./transaksi";
export * from "./persediaan";
export * from "./preference-accounting";

// initial bootsrap
export const registerAccountingContext = (applicationContext: ApplicationContext): Promise<void> => {
  const preferenceAccountingContext = createPreferenceContext(applicationContext);
  const accountContext = createAccountContext(applicationContext, preferenceAccountingContext);
  const preferenceLoad = preferenceAccountingContext.load();
  const accountLoad = accountContext.load();
  return Promise.all([preferenceLoad, accountLoad]).then(() => {});
};
