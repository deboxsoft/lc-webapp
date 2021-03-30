import { getContext, setContext } from "svelte";

// import { createMock } from "__@stores/store";

const KEY = {};

export const createAkumulasiContext = () => {
  // const store = createMock();
  // setContext(KEY, store);
  // return store;
};

export const getAkumulasiContext = () => getContext<any>(KEY);
