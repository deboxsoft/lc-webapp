import { getContext, setContext } from "svelte";

// import { createMock } from "__@stores/store";

const KEY = {};

export const createNeracaContext = () => {
  // const store = createMock();
  // setContext(KEY, store);
  // return store;
};

export const getNeracaContext = () => getContext<any>(KEY);
