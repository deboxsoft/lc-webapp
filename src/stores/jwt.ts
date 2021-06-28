import { createLocalStore, LocalstorageStore } from "./localstorage";

export type JwtStore = LocalstorageStore<string>;

export const createJwtStore = (token?: string) => {
  return createLocalStore("_tok", token);
};
