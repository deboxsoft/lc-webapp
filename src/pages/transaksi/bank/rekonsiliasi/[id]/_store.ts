import type { BankReconciliation } from "@deboxsoft/accounting-api";
import type { stores } from "@deboxsoft/accounting-client";
import type { Writable } from "svelte/store";

import { setContext, getContext } from "svelte";
import { writable } from "svelte/store";
import { getReconciliationContext } from "__@modules/accounting";

const KEY_CONTEXT = Symbol();

interface StoreContext {
  bankId: string;
  fileDataImport: Writable<any[]>;
  bankReconciliation: BankReconciliation;
  loading: Writable<boolean>;
  update: stores.BankReconciliationContext["update"];
}

interface Options {
  bankId: string;
}

export const createStoreContext = ({ bankId }: Options) => {
  const { getBankReconciliation, update } = getReconciliationContext();
  const loading = writable(false);
  const fileDataImport = writable(null);
  const bankReconciliation = getBankReconciliation(bankId);
  const context: StoreContext = { bankId, fileDataImport, bankReconciliation, loading, update };
  setContext<StoreContext>(KEY_CONTEXT, context);
  return context;
};

export const getStoreContext = () => getContext<StoreContext>(KEY_CONTEXT);
