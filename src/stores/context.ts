import { getContext, setContext } from "svelte";
import { writable, Writable } from "svelte/store";
import { createLocalStore } from "./localstorage";

const KEY = Symbol("store-context");
interface ContextOptions {
  useLocalstorage?: boolean;
  key?: string;
  initial?: any;
}
export const createContextStore = ({ useLocalstorage, key, initial }: ContextOptions = {}) => {
  let store: Writable<any> = writable(initial);
  if (useLocalstorage && key) {
    store = createLocalStore(key, initial);
  }
  setContext(KEY, store);
  return store;
};

export const getContextStore = () => getContext(KEY);
