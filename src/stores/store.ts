import { derived, writable } from "svelte/store";

export const createMock = <Data extends { id: string } & Record<string, any>, Input extends Data>(
  data: Data[] = []
) => {
  const store = writable<Data[]>(data);
  return {
    store,
    remove: (id) => {
      Promise.resolve().then(() => {
        store.update(($store) => {
          const i = $store.findIndex((_) => _.id === id);
          $store.splice(i, 1);
          return $store;
        });
      });
    },
    update: (id, input: Input) => {
      store.update(($store) => {
        const i = $store.findIndex((_) => _.id === id);
        $store[i] = input;
        return $store;
      });
    },
    create: (input) => {
      store.update(($store) => {
        return [...$store, input];
      });
    },
    find: () => {},
    findById: (id) =>
      derived(store, ($store) => {
        const i = $store.findIndex((_) => _.id === id);
        return $store[i];
      })
  };
};
