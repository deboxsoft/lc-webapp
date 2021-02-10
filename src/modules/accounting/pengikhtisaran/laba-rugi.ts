import { getContext, setContext } from "svelte";

import { createMock } from "__@stores/store";

const KEY = {};

export const createLabaRugiContext = () => {
  const store = createMock();
  setContext(KEY, store);
  return store;
};

export const getLabaRugiContext = () => getContext<any>(KEY);
