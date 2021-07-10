import { Writable, writable } from "svelte/store";

export type LocalstorageStore<T = string> = Writable<T> & {
  clear: () => void;
};

// User/JWT-related
// https://stackoverflow.com/a/61300826/2933427
export const createLocalStore = (key, startValue = null): LocalstorageStore => {
  const { subscribe, set, update } = writable(startValue);
  const useLocalStorage = () => {
    const json = localStorage.getItem(key);
    if (json) {
      set(JSON.parse(json));
    }

    subscribe((current) => {
      if (current) {
        localStorage.setItem(key, JSON.stringify(current));
      }
    });
  };
  useLocalStorage();
  return {
    subscribe,
    set,
    update,
    clear: () => {
      localStorage.removeItem(key);
      update(() => undefined);
    }
  };
};
