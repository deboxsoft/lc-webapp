import { getContext, setContext } from "svelte";
import { writable, Writable } from "svelte/store";

export interface BreadcrumbItem {
  path: string;
  title: string;
}
export interface BreadcrumbProps {
  class?: string;
  itemList: BreadcrumbItem[];
}
type Options = {
  initial?: BreadcrumbItem[];
  store?: Writable<BreadcrumbItem[]>;
};

type Context = {
  store: Writable<BreadcrumbItem[]>;
  list: BreadcrumbItem[];
};

export const BREADCRUMB_CONTEXT = "BreadcrumbContext";
export const createBreadcrumbStore = ({ initial = [], store }: Options = {}) => {
  !store && (store = writable<BreadcrumbItem[]>(initial));
  setContext<Context>(BREADCRUMB_CONTEXT, {
    store,
    list: initial
  });
  return store;
};

export const getBreadcrumbStore = () => {
  const { list, store } = getContext<Context>(BREADCRUMB_CONTEXT);
  const getList = (breadcrumb: BreadcrumbItem[] | BreadcrumbItem) => {
    !Array.isArray(breadcrumb) && (breadcrumb = [breadcrumb]);
    return [...list, ...breadcrumb];
  };
  return {
    breadcrumbStore: store,
    setBreadcrumbContext: (breadcrumb: BreadcrumbItem[] | BreadcrumbItem) => {
      const _list = getList(breadcrumb);
      store.set(_list);
      setContext<Context>(BREADCRUMB_CONTEXT, {
        store,
        list: _list
      });
    },
    setBreadcrumb: (breadcrumb: BreadcrumbItem[] | BreadcrumbItem) => {
      store.set(getList(breadcrumb));
    }
  };
};
