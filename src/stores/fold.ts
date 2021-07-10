import { createLocalStore } from "./localstorage";

type Options = {
  key: string;
  initial: any;
};
export const createFoldStore = ({ key, initial = [] }: Options) => {
  const { set, subscribe, clear, update } = createLocalStore(key, initial);
  return {
    set,
    subscribe,
    clear,
    update
  };
};
