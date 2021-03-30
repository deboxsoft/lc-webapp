import { getContext, setContext } from "svelte";

// import { createMock } from "__@stores/store";

const KEY = {};

export const createFinancialContext = () => {
  // const store = createMock();
  // setContext(KEY, store);
  // return store;
};

export const getFinancialContext = () => getContext<any>(KEY);
