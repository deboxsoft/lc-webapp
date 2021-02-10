import { getContext, setContext } from "svelte";

import { createMock } from "__@stores/store";

const KEY = {};

export const createActivaTetapContext = () => {
  const store = createMock();
  setContext(KEY, store);
  return store;
};

export const getActivaTetapContext = () => getContext<any>(KEY);
