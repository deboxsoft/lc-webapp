// import { createAuthStore } from "@deboxsoft/users-client-svelte";
//
// export const createUserStore = () => createAuthStore({});
import type { User } from "@deboxsoft/users-api";

import { getContext, setContext } from "svelte";
import { Readable, writable } from "svelte/store";

const KEY = Symbol("user");

export const createUserContext = () => {
  const store = writable<Partial<User>>({
    id: "1232345",
    username: "demo",
    roles: ["ADMIN"]
  });
  setContext(KEY, { user: store });
  return store;
};

export const getUserContext = (): { user: Readable<Partial<User>> } => getContext(KEY);
