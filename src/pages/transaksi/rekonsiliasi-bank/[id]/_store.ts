import type { BankReconciliation, BankReconciliationService } from "@deboxsoft/accounting-api";
import type { Writable, Readable } from "svelte/store";

import { setContext, getContext } from "svelte";
import { writable } from "svelte/store";
import { getReconciliationContext } from "__@modules/accounting";

const KEY_CONTEXT = Symbol();

interface StoreContext {
  bankId: string;
  fileDataImport: Writable<any[]>;
  bankReconciliation: Readable<BankReconciliation>;
  loading: Writable<boolean>;
  updateBankReconciliation: BankReconciliationService["updateBankReconciliation"];
}

interface Options {
  bankId: string;
}

export const createStoreContext = ({ bankId }: Options) => {
  const { getReconciliation, updateBankReconciliation } = getReconciliationContext();
  const loading = writable(false);
  const fileDataImport = writable(null);
  const bankReconciliation = getReconciliation(bankId);
  const context: StoreContext = { bankId, fileDataImport, bankReconciliation, loading, updateBankReconciliation };
  setContext<StoreContext>(KEY_CONTEXT, context);
  return context;
};

export const getStoreContext = () => getContext<StoreContext>(KEY_CONTEXT);
