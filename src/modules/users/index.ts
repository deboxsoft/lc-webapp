// import { createAuthStore } from "@deboxsoft/users-client-svelte";
//
// export const createUserStore = () => createAuthStore({});

import { getContext, setContext } from "svelte";

import { createMock } from "__@stores/store";

const KEY = {};

export const createUserContext = () => {
  const store = createMock();
  setContext(KEY, store);
  return store;
};

export const getUserContext = () => getContext<any>(KEY);
