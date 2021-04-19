import { stores } from "@deboxsoft/users-client";
import { writable } from "svelte/store";

let profile = writable({ username: "Demo", id: "13" });
export const getAuthStore = () => ({ profile });
export const createAuthStore = (_profile) => {
  return stores.createAuthenticationManagerStore();
};
