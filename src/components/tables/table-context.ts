import { getContext, setContext } from "svelte";
import { writable, Writable } from "svelte/store";

const KEY = Symbol("table-context");

export type TableContext = {
  store: Writable<TableStore>;
};
export type TableOptions = {};

export type TableStore = {
  height?: number;
};

export const createTableContext = (options: TableOptions = {}): TableContext => {
  const tableStore = writable<TableStore>({});
  const context = {
    store: tableStore
  };
  setContext(KEY, context);
  return context;
};

export const getTableStore = () => {
  return getContext(KEY);
};
