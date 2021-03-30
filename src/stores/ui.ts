import { getContext as getContextSvelte, setContext } from "svelte";
import { Readable, writable } from "svelte/store";

export interface Store {
  isDark?: boolean;
  minimizeSidebar: boolean;
  showMobileSidebar: boolean;
  modalOpen: boolean;
}

const createUiStore = () => {
  const isDark = localStorage.getItem("is-dark");
  const toggleMinimizeSidebar = localStorage.getItem("toggle-minimize-sidebar");
  const toggleShowMobileSidebar = localStorage.getItem("toggle-show-mobile-sidebar");
  return writable<Store>({
    isDark: isDark === "true" || false,
    minimizeSidebar: toggleMinimizeSidebar === "true" || false,
    showMobileSidebar: toggleShowMobileSidebar === "true" || false,
    modalOpen: false
  });
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

export const createUIContext = () => {
  const context = {
    store,
    toggleTheme,
    toggleMinimizeSidebar,
    toggleShowMobileSidebar
  };
  setContext<Context>(key, context);
  return context;
};

export const getUIContext = (): Context => getContextSvelte<Context>(key);
