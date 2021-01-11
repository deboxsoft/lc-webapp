import { setContext, getContext as getContextSvelte } from "svelte";
import { writable, Readable } from "svelte/store";

export interface Store {
  isDark?: boolean;
  minimizeSidebar: boolean;
  showMobileSidebar: boolean;
}

const createUiStore = () => {
  const isDark = localStorage.getItem("is-dark");
  const toggleMinimizeSidebar = localStorage.getItem("toggle-minimize-sidebar");
  const toggleShowMobileSidebar = localStorage.getItem("toggle-show-mobile-sidebar");
  const store = writable<Store>({
    isDark: isDark === "true" || false,
    minimizeSidebar: toggleMinimizeSidebar === "true" || false,
    showMobileSidebar: toggleShowMobileSidebar === "true" || false
  });
  return store;
};

const store = createUiStore();

export type Context = {
  store: Readable<Store>;
  toggleTheme: () => void;
  toggleMinimizeSidebar: () => void;
  toggleShowMobileSidebar: () => void;
};

const key = {};

const toggleTheme = () => {
  store.update((s) => {
    localStorage.setItem("is-dark", String(!!!s.isDark));
    s.isDark = !!!s.isDark;
    return s;
  });
};

const toggleMinimizeSidebar = () => {
  store.update((s) => {
    localStorage.setItem("toggle-minimize-sidebar", String(!!!s.minimizeSidebar));
    return { ...s, ...{ minimizeSidebar: !!!s.minimizeSidebar } };
  });
};

const toggleShowMobileSidebar = () => {
  store.update((s) => {
    localStorage.setItem("toggle-show-mobile-sidebar", String(!!!s.showMobileSidebar));
    return { ...s, ...{ showMobileSidebar: !!!s.showMobileSidebar } };
  });
};

export const createContext = () => {
  setContext<Context>(key, {
    store,
    toggleTheme,
    toggleMinimizeSidebar,
    toggleShowMobileSidebar
  });
  return getContext();
};

export const getContext = (): Context => getContextSvelte<Context>(key);
