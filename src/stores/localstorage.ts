import { writable } from "svelte/store";

// User/JWT-related
// https://stackoverflow.com/a/61300826/2933427
export const createWritableStore = (key, startValue) => {
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
